import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import { websocketHelper } from './WebsocketHelper';

class HelperService {
    private async executeSh(shPath, shCommand: string, parameters: any[]): Promise<any> {
        return new Promise((resolve) => {
            const output: string[] = [];
            const proc = cp.spawn(shCommand, parameters, {
                cwd: shPath,
                shell: '/bin/bash',
                env: process.env,
            });
            proc.stdout.on('data', (data: any) => {
                console.info(data.toString());
                output.push(data.toString());
            });
            proc.stderr.on('data', (data: any) => {
                console.error(data.toString());
            });
            proc.on('close', (code: any) => {
                if (code === 0) {
                    console.info(`Child process closed with success code: ${code}`);
                    resolve({ success: true, output });
                } else {
                    console.error(`Child process closed with error code: ${code}`);
                    resolve({ success: false, output });
                }
            });
            proc.on('exit', (code: any) => {
                if (code !== 0) {
                    console.error(`child process exited with non-zero code: ${code}`);
                    resolve({ success: false, output });
                }
            });
        });
    }

    setHeaderForExtension(res: any, fileId: string) {
        if (path.extname(fileId) === '.css')
            return res.setHeader('Content-Type', 'text/css');
        else if (path.extname(fileId) === '.js')
            return res.setHeader('Content-Type', 'application/javascript');
        else if (path.extname(fileId) === '.html')
            return res.setHeader('Content-Type', 'text/html');
        else if (path.extname(fileId) === '.png')
            return res.setHeader('Content-Type', 'image/png');
        return -1;
    }

    returnResponse(res: any, statusCode: number, state: boolean, message: string, data?: any) {
        const jsonResult = {
            status: statusCode,
            state,
            message,
            data,
        };
        res.status(statusCode).json(jsonResult);
    }

    async calculateResources(cloudProvider: string, virtualUser: number, threadCountPerPod: number) {
        const podPerNode = 2;
        const plannedPodCount = Math.ceil(virtualUser / threadCountPerPod);
        let plannedNodeCount = Math.ceil(plannedPodCount / podPerNode);

        // minikube node count
        if (cloudProvider === 'Local')
            plannedNodeCount = 1;

        // Return an object with properties
        return { plannedPodCount, plannedNodeCount };
    }

    async checkNodeCount(cloudProvider: string, plannedNodeCount: number): Promise<any> {
        let message: string;
        let status: boolean = true;

        if (cloudProvider === 'Azure' && plannedNodeCount > 2) {
            message = `Azure could provider, do not offer more than 4 cpu in free tier. Current: ${plannedNodeCount * 2}`;
            status = false;
        } else if (cloudProvider === 'DigitalOcean' && plannedNodeCount > 2) {
            message = `Digital Ocean could provider, do not offer more than 3 nodes, 1 is already in use and desired: ${plannedNodeCount}`;
            status = false;
        }
        return { status, message };
    }

    async moveJmxFile(currentPath: string, targetPath: string):  Promise<any> {
        try {
            await fs.promises.rename(currentPath, targetPath);
            return { status: true, message: "File moved successfully!" };
        } catch (error) {
            console.log(error);
            return { status: false, message: "Cannot move file!" };
        }
    }

    async checkCloudProvider(cloudProvider: string) {
        let message: string;
        let status: boolean = true;

        if (cloudProvider !== 'DigitalOcean' && cloudProvider !== 'Azure' && cloudProvider !== 'AWS' && cloudProvider !== 'Local') {
            message = 'Cloud provider is invalid!';
            status = false;
        }
        return { status, message };
    }

    async checkFile(uploadedFile: any): Promise<any> {
        let message: string;
        let status: boolean = true;

        if (!uploadedFile) {
            message = 'Jmx file is not provided!';
            status = false;
        }
        return { status, message };
    }

    private async error(shPath, error: any) {
        const websocketMessage= {
                connectionStatus : "fail",
                socketMessage : error
        }
        console.error('Error:', error.message);
        // send websocket message for error
        websocketHelper.broadcast(websocketMessage.toString());
        // down terraform if there was an error
        this.downTerraformSH(shPath);
    }

    async prepareSH(shPath, parameters: any) {
        try {
            let websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Files preparing"
        }
            websocketHelper.broadcast(websocketMessage.toString());
            const result = await this.executeSh(shPath, 'bash', parameters);
            if (!result.success)
                throw new Error('prepare.sh failed');

            console.info('\nprepare.sh finished.');
             websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Files prepared successfully"
        }
            websocketHelper.broadcast(websocketMessage.toString());
        } catch (error) {
            await this.error(shPath, error);
        }
    }

    async upTerraformSH(shPath) {
        try {
            let websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Resources allocating"
        }
            websocketHelper.broadcast(websocketMessage.toString());
            const result = await this.executeSh(shPath, 'bash', ['upTerraform.sh']);
            if (!result.success)
                throw new Error('upTerraform.sh failed');

            console.info('\nupTerraform.sh finished.');
             websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Resources allocated"
        }
            websocketHelper.broadcast(websocketMessage.toString());
        } catch (error) {
            await this.error(shPath, error);
        }
    }

    async upClusterSH(shPath) {
        try {
            let websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Cluster preparing"
        }
            websocketHelper.broadcast(websocketMessage.toString());
            
            const result = await this.executeSh(shPath, 'bash', ['upCluster.sh']);
            if (!result.success)
                throw new Error('upCluster.sh failed');

            console.info('\nupCluster.sh finished.');
             websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Cluster prepared"
        }
            websocketHelper.broadcast(websocketMessage.toString());
        } catch (error) {
            await this.error(shPath, error);
        }
    }

    async runTestSH(shPath) {
        try {
            let websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Tests running"
        }
            websocketHelper.broadcast(websocketMessage.toString());
            const result = await this.executeSh(shPath, 'bash', ['runTest.sh']);
            if (!result.success)
                throw new Error('runTest.sh failed');

            console.info('\nrunTest.sh finished.');
            
             websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Test run finished"
        }
            websocketHelper.broadcast(websocketMessage.toString());
        } catch (error) {
            await this.error(shPath, error);
        }
    }

    async resultSH(shPath) {
        try {
            let websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Results preparing"
        }
            websocketHelper.broadcast(websocketMessage.toString());
            const result = await this.executeSh(shPath, 'bash', ['result.sh']);
            if (!result.success)
                throw new Error('result.sh failed');

            console.info('\nresult.sh finished.');

            // TODO result file will be assigned.
            websocketMessage= {
                connectionStatus : "loading",
                socketMessage : `Results finished : ${result.output}`,
        }
            websocketHelper.broadcast(websocketMessage.toString());
        } catch (error) {
            await this.error(shPath, error);
        }
    }

    async downTerraformSH(shPath) {
        try {
            let websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Deallocating resources"
        }
            websocketHelper.broadcast(websocketMessage.toString());
            const result = await this.executeSh(shPath, 'bash', ['downTerraform.sh']);
            if (!result.success)
                throw new Error('downTerraform.sh failed');

            console.info('\ndownTerraform.sh finished.');
            websocketMessage= {
                connectionStatus : "loading",
                socketMessage : "Resources deallocated"
        }
            websocketHelper.broadcast(websocketMessage.toString());
        } catch (error) {
                    console.log("Error: ",error)
        }
    }

    async runAllSteps(shPath: string, plannedNodeCount: number, plannedPodCount: number, threadCountPerPod: number, duration: number) {
        // execute prepare sh file params: node count, pod count
        await this.prepareSH(shPath, ['prepare.sh', plannedNodeCount, plannedPodCount, threadCountPerPod, duration]);

        // execute upTerraform sh file
        await this.upTerraformSH(shPath);

        // execute upCluster sh file
        await this.upClusterSH(shPath);

        // execute sh runTest sh file
        await this.runTestSH(shPath);

        // execute result sh file
        await this.resultSH(shPath);

        // execute down sh file
        await this.downTerraformSH(shPath);
    }
}

const Helper = new HelperService();
export default Helper;
