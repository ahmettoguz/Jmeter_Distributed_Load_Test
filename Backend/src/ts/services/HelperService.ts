const cp = require("child_process");
const fs = require("fs");

class HelperService {
  moveJmxFile(currentPath, targetPath, res) {
    fs.rename(currentPath, targetPath, (err) => {
      if (err) {
        this.returnNegativeMessage(res, 502, "Cannot move file!");
        return false;
      }
    });
    return true;
  }

  async executeSh(shPath, shCommand, parameters) {
    return new Promise((resolve) => {
      let output: string[] = [];
      const proc = cp.spawn(shCommand, parameters, {
        cwd: shPath,
        shell: "/bin/bash",
        env: process.env,
      });
      proc.stdout.on("data", (data) => {
        console.info(data.toString());
        output.push(data.toString());
      });
      proc.stderr.on("data", (data) => {
        console.error(data.toString());
      });
      proc.on("close", (code) => {
        if (code === 0) {
          console.info(`Child process closed with success code: ${code}`);
          resolve({ success: true, output });
        } else {
          console.error(`Child process closed with error code: ${code}`);
          resolve({ success: false, output });
        }
      });
      proc.on("exit", (code) => {
        if (code !== 0) {
          console.error(`child process exited with non-zero code: ${code}`);
          resolve({ success: false, output });
        }
      });
    });
  }

  async returnPositiveMessage(res, message, data) {
    const jsResult = {
      status: 200,
      state: true,
      message: message,
    };
    if (data != null) jsResult["data"] = data;
    res.status(200).json(jsResult);
  }

  async returnNegativeMessage(res, statusCode, errorMessage) {
    const jsResult = {
      status: statusCode,
      state: false,
      errorMessage: errorMessage,
    };
    res.status(statusCode).json(jsResult);
  }

  async calculateResources(cloudProvider, virtualUser, threadCountPerPod) {
    let podPerNode;

    podPerNode = 2;

    const plannedPodCount = Math.ceil(virtualUser / threadCountPerPod);

    let plannedNodeCount = Math.ceil(plannedPodCount / podPerNode);

    // minikube node count
    if (cloudProvider === "Local") plannedNodeCount = 1;

    // Return an object with properties
    return { plannedPodCount, plannedNodeCount };
  }

  async checkNodeCount(cloudProvider, plannedNodeCount, res) {
    let message;
    let status = true;

    if (cloudProvider == "Azure" && plannedNodeCount > 2) {
      message = `Azure could provider, do not offer more than 4 cpu in free tier. Current: ${
        plannedNodeCount * 2
      }`;
      status = false;
    } else if (cloudProvider == "DigitalOcean" && plannedNodeCount > 2) {
      message = `Digital Ocean could provider, do not offer more than 3 nodes, 1 is already in use and desired: ${plannedNodeCount}`;
      status = false;
    }

    if (status) return true;
    else {
      this.returnNegativeMessage(res, 502, message);
      return false;
    }
  }

  async checkCloudProvider(cloudProvider, res) {
    if (
      cloudProvider != "DigitalOcean" &&
      cloudProvider != "Azure" &&
      cloudProvider != "AWS" &&
      cloudProvider != "Local" 
    ) {
      this.returnNegativeMessage(res, 400, "Cloud provider is invalid!");
      return false;
    }
    return true;
  }

  async checkFile(uploadedFile, res) {
    if (uploadedFile == undefined) {
      this.returnNegativeMessage(res, 400, "Jmx file is not provided!");
      return false;
    }
    return true;
  }
}

export default HelperService;
