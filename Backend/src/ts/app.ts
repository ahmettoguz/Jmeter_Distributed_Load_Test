const express = require("express");
const multer = require("multer");
const path = require('path');
const app = express();


import models from "./db/index";
import connnectDb from "./db/connectDb";
connnectDb();

import HelperService from "./services/HelperService";
import WebsocketHelper from "./services/WebsocketHelper";

const port = 80;
const helperService = new HelperService();

const wsPort = 8080;
const websocketHelper = new WebsocketHelper(wsPort);

// -------------------------------------------------- Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
  res.header("X-Content-Type-Options", "nosniff");
  next();
});
app.use(express.urlencoded({ extended: true }));

// multer file options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./userFile/upload/"); // Dosyanın kaydedileceği klasör
  },
  filename: (req, file, cb) => {
    cb(null, "loadtest.jmx");
  },
});
const upload = multer({ storage: storage });

// open result folder
app.use(express.static(path.join(__dirname, '../../')));

// -------------------------------------------------- Functions
async function runAllSteps(
  cloudProvider,
  plannedNodeCount,
  plannedPodCount,
  threadCountPerPod,
  duration
) {
  const shPath = `./Terraform/${cloudProvider}/script`;
  let result;
  let parameters;

  try {
    // execute prepare sh file params: node count, pod count
    websocketHelper.broadcast(`Files preparing...`);
    parameters = [
      "prepare.sh",
      plannedNodeCount,
      plannedPodCount,
      threadCountPerPod,
      duration,
    ];
    result = await helperService.executeSh(shPath, "bash", parameters);
    console.info("\nprepare.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("prepare.sh failed");
    }
    websocketHelper.broadcast(`Files prepared successfully.`);

    // execute upTerraform sh file
    websocketHelper.broadcast(`Resources allocating...`);
    parameters = ["upTerraform.sh"];
    result = await helperService.executeSh(shPath, "bash", parameters);
    console.info("\nupTerraform.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("upTerraform.sh failed");
    }
    websocketHelper.broadcast(`Resources allocated.`);

    // execute upCluster sh file
    websocketHelper.broadcast(`Cluster preparing...`);
    parameters = ["upCluster.sh"];
    result = await helperService.executeSh(shPath, "bash", parameters);
    console.info("\nupCluster.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("upCluster.sh failed");
    }
    websocketHelper.broadcast(`Cluster prepared.`);

    // execute sh runTest sh file
    websocketHelper.broadcast(`Tests running...`);
    parameters = ["runTest.sh"];
    result = await helperService.executeSh(shPath, "bash", parameters);
    console.info("\nrunTest.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("runTest.sh failed");
    }
    websocketHelper.broadcast(`Tests are runned.`);

    // execute result sh file
    websocketHelper.broadcast(`Results preparing...`);
    parameters = ["result.sh"];
    result = await helperService.executeSh(shPath, "bash", parameters);
    console.info("\nresult.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("result.sh failed");
    }
    websocketHelper.broadcast(`Results : ${result.output}`);

    // execute down sh file
    websocketHelper.broadcast(`Deallocating resources...`);
    parameters = ["downTerraform.sh"];
    result = await helperService.executeSh(shPath, "bash", parameters);
    console.info("\ndownTerraform.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("downTerraform.sh failed");
    }
    websocketHelper.broadcast(`Resources deallocated.`);
  } catch (error: any) {
    console.error("Error:", error.message);

    // send websocket message for error
    websocketHelper.broadcast(`Error: ${error.message}`);

    // down terraform if there was an error
    websocketHelper.broadcast(`Deallocating resources...`);
    parameters = ["downTerraform.sh"];
    result = await helperService.executeSh(shPath, "bash", parameters);
    console.info("\ndownTerraform.sh finished.");
    websocketHelper.broadcast(`Resources deallocated.`);
  }
}

// ------------------------------------------------- End Points
app.get("/", async (req, res) => {
  console.info(
    `---\nIncoming request to: ${req.url}\nMethod: ${req.method}\nIp: ${req.connection.remoteAddress}\n---\n`
  );

  return helperService.returnPositiveMessage(res, "Service is up", null);
});

app.post("/runTest", upload.single("jmxFile"), async (req, res) => {
  console.info(
    `---\nIncoming request to: ${req.url}\nMethod: ${req.method}\nIp: ${req.connection.remoteAddress}\n---\n`
  );

  const cloudProvider = req.body.cloudProvider;
  const virtualUser = req.body.virtualUser;
  const uploadedFile = req.file;

  const duration = 240;
  const threadCountPerPod = 50;

  // check cloud provider
  if ((await helperService.checkCloudProvider(cloudProvider, res)) === false)
    return;

  // check file
  if ((await helperService.checkFile(uploadedFile, res)) === false) return;

  // place jmx file to related path
  if (
    (await helperService.moveJmxFile(
      "./userFile/upload/loadtest.jmx",
      `./Terraform/${cloudProvider}/jmx_Config/loadtest.jmx`,
      res
    )) == false
  )
    return;

  // get pod and node count according to could provider
  const { plannedPodCount, plannedNodeCount } =
    await helperService.calculateResources(
      cloudProvider,
      virtualUser,
      threadCountPerPod
    );

  // check free tier node counts
  if (
    (await helperService.checkNodeCount(
      cloudProvider,
      plannedNodeCount,
      res
    )) === false
  )
    return;

  // start sh operations
  runAllSteps(
    cloudProvider,
    plannedNodeCount,
    plannedPodCount,
    threadCountPerPod,
    duration
  );

  return helperService.returnPositiveMessage(res, "Operations started.", [
    `Planned node count : ${plannedNodeCount}`,
    `Planned pod count : ${plannedPodCount}`,
    `Thread count for each pod: ${threadCountPerPod}`,
    `Cloud Provider : ${cloudProvider}`,
  ]);
});

// Show results
app.get('/result/:id/report', (req, res) => {
  const id = req.params.id;
  const filePath = path.join(__dirname, `../../userFile/result/${id}/report/index.html`);
  
  
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(filePath);
});
// ----------------------------------------------------------- Temporary endpoint for frontend trials
app.get("/temp", async (req, res) => {
  const staticUserId = "65673a23553521aca50a004b";
  const staticTestName = "Static Test Name";

  // READ
  // try {
  //   const user = await models.User.findOne({ _id: staticUserId });
  // } catch (error) {
  //   console.error("Error finding user:", error);
  // }

  // INSERT
  try {
    const newTest = await models.Test.create({
      name: staticTestName,
      user: staticUserId,
      isFinished: false,
    });
    console.log("New test created:", newTest);
    const insertedId = newTest._id.toString();
    console.log(insertedId);
  } catch (error) {
    console.error("Error creating test:", error);
  }

  // READ
  try {
    const test = await models.Test.find({
      _id: "656d633488510354e2491bed",
    }).populate("user");
    console.log(test);
  } catch (error) {
    console.error("Error finding test:", error);
  }

  return helperService.returnPositiveMessage(res, "temp message", null);
});

app.listen(port, () => {
  console.log(`App is running on : http://localhost:${port}`);
});
