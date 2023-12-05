import dotenv from 'dotenv';

dotenv.config();
import Helper from '../../../services/HelperService';

const HelperService = new Helper();

const runTest = async (req, res) => {
    console.info(`---\nIncoming request to: ${req.url}\nMethod: ${req.method}\nIp: ${req.connection.remoteAddress}\n---\n`);
    const cloudProvider = req.body.cloudProvider;
    const virtualUser = req.body.virtualUser;
    const uploadedFile = req.file;
    const duration = 240;
    const threadCountPerPod = 50;

    // check cloud provider
    const checkCloudProviderRes = await HelperService.checkCloudProvider(cloudProvider);
    if (!checkCloudProviderRes.status)
        return HelperService.returnResponse(res, 400, false, checkCloudProviderRes.message);

    // check file
    const checkFileRes = await HelperService.checkFile(uploadedFile);
    if (!checkFileRes.status)
        return HelperService.returnResponse(res, 400, false, checkFileRes.message);

    // place jmx file to related path
    const moveJmxFileRes = await HelperService.moveJmxFile('./upload/loadtest.jmx', `../Terraform/${cloudProvider}/jmx_Config/loadtest.jmx`);
    if (!moveJmxFileRes.status)
        return HelperService.returnResponse(res, 502, false, moveJmxFileRes.message);

    // get pod and node count according to could provider
    const { plannedPodCount, plannedNodeCount } = await HelperService.calculateResources(cloudProvider, virtualUser, threadCountPerPod);

    // check free tier node counts
    const checkNodeCountRes = await HelperService.checkNodeCount(cloudProvider, plannedNodeCount);
    if (!checkNodeCountRes.status)
        return HelperService.returnResponse(res, 502, false, checkNodeCountRes.message);

    // start sh operations
    await HelperService.runAllSteps(`../Terraform/${cloudProvider}/script`, plannedNodeCount, plannedPodCount, threadCountPerPod, duration);

    return HelperService.returnResponse(res, 200, true, 'Operations started.', [
        `Planned node count : ${plannedNodeCount}`,
        `Planned pod count : ${plannedPodCount}`,
        `Thread count for each pod: ${threadCountPerPod}`,
        `Cloud Provider : ${cloudProvider}`,
    ]);
};

export default runTest;
