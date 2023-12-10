import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import { websocketHelper } from './WebsocketService';

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

    async moveJmxFile(currentPath: string, targetPath: string): Promise<any> {
        try {
            await fs.promises.rename(currentPath, targetPath);
            return { status: true, message: 'File moved successfully!' };
        } catch (error) {
            console.error(error);
            return { status: false, message: 'Cannot move file!' };
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
        console.error('Error:', error.message);
        // send websocket message for error
        websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'fail', resultURL: null, socketMessage: error }));
        // down terraform if there was an error
        this.downTerraformSH(shPath);
        return false;
    }

    async prepareSH(shPath, parameters: any) {
        try {
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Files preparing' }));
            const result = await this.executeSh(shPath, 'bash', parameters);
            if (!result.success)
                throw new Error('prepare.sh failed');

            console.info('\nprepare.sh finished.');
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Files prepared successfully' }));
            return true;
        } catch (error) {
            return await this.error(shPath, error);
        }
    }

    async upTerraformSH(shPath) {
        try {
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Resources allocating' }));
            const result = await this.executeSh(shPath, 'bash', ['upTerraform.sh']);
            if (!result.success)
                throw new Error('upTerraform.sh failed');

            console.info('\nupTerraform.sh finished.');
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Resources allocated' }));
            return true;
        } catch (error) {
            return await this.error(shPath, error);
        }
    }

    async upClusterSH(shPath) {
        try {
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Cluster preparing' }));
            const result = await this.executeSh(shPath, 'bash', ['upCluster.sh']);
            if (!result.success)
                throw new Error('upCluster.sh failed');

            console.info('\nupCluster.sh finished.');
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Cluster prepared' }));
            return true;
        } catch (error) {
            return await this.error(shPath, error);
        }
    }

    async runTestSH(shPath) {
        try {
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Tests running' }));
            const result = await this.executeSh(shPath, 'bash', ['runTest.sh']);
            if (!result.success)
                throw new Error('runTest.sh failed');

            console.info('\nrunTest.sh finished.');
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Test run finished' }));
            return true;
        } catch (error) {
            return await this.error(shPath, error);
        }
    }

    async resultSH(shPath) {
        try {
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Results preparing' }));
            const result = await this.executeSh(shPath, 'bash', ['result.sh']);
            if (!result.success)
                throw new Error('result.sh failed');

            console.info('\nresult.sh finished.');

            // TODO result file will be assigned.
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'success', resultURL: 'http://167.99.140.168/api/result/test_2023-12-06_08-58-53/report/index.html', socketMessage: 'Results prepared' }));
            return true;
        } catch (error) {
            return await this.error(shPath, error);
        }
    }

    async downTerraformSH(shPath) {
        try {
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Deallocating resources' }));
            const result = await this.executeSh(shPath, 'bash', ['downTerraform.sh']);
            if (!result.success)
                throw new Error('downTerraform.sh failed');

            console.info('\ndownTerraform.sh finished.');
            websocketHelper.broadcast(JSON.stringify({ connectionStatus: 'loading', resultURL: null, socketMessage: 'Resources deallocated' }));
            return true;
        } catch (error) {
            return false;
        }
    }

    async runAllSteps(shPath: string, plannedNodeCount: number, plannedPodCount: number, threadCountPerPod: number, duration: number) {
        // execute prepare sh file params: node count, pod count
        let status;
        status = await this.prepareSH(shPath, ['prepare.sh', plannedNodeCount, plannedPodCount, threadCountPerPod, duration]);
        if (!status)
            return;

        // execute upTerraform sh file
        status = await this.upTerraformSH(shPath);
        if (!status)
            return;

        // execute upCluster sh file
        status = await this.upClusterSH(shPath);
        if (!status)
            return;

        // execute sh runTest sh file
        status = await this.runTestSH(shPath);
        if (!status)
            return;

        // execute result sh file
        status = await this.resultSH(shPath);
        if (!status)
            return;

        // execute down sh file
        status = await this.downTerraformSH(shPath);
    }
}

const Helper = new HelperService();
export default Helper;
