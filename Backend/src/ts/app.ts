const express = require("express");
const multer = require("multer");
const app = express();

import HelperService from "./services/HelperService";

const port = 80;
const helperService = new HelperService();

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
    cb(null, "./upload/"); // Dosyanın kaydedileceği klasör
  },
  filename: (req, file, cb) => {
    cb(null, "loadtest.jmx");
  },
});
const upload = multer({ storage: storage });

// -------------------------------------------------- Functions
async function runAllSteps(
  req,
  cloudProvider,
  plannedNodeCount,
  plannedPodCount,
  threadCountPerPod,
  duration
) {
  const shPath = `../Terraform/${cloudProvider}/script`;
  let result;
  let parameters;

  try {
    // execute prepare sh file params: node count, pod count
    // TODO hard coded node and pod count
    parameters = [
      "prepare.sh",
      plannedNodeCount,
      plannedPodCount,
      threadCountPerPod,
      duration,
    ];
    result = await helperService.executeSh(shPath, "sh", parameters);
    console.info("\nprepare.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("prepare.sh failed");
    }

    // execute upTerraform sh file
    parameters = ["upTerraform.sh"];
    result = await helperService.executeSh(shPath, "sh", parameters);
    console.info("\nupTerraform.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("upTerraform.sh failed");
    }

    // execute upCluster sh file
    parameters = ["upCluster.sh"];
    result = await helperService.executeSh(shPath, "sh", parameters);
    console.info("\nupCluster.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("upCluster.sh failed");
    }

    // execute sh runTest sh file
    parameters = ["runTest.sh"];
    result = await helperService.executeSh(shPath, "sh", parameters);
    console.info("\nrunTest.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("runTest.sh failed");
    }

    // execute result sh file
    parameters = ["result.sh"];
    result = await helperService.executeSh(shPath, "sh", parameters);
    console.info("\nresult.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("result.sh failed");
    }

    // execute down sh file
    parameters = ["downTerraform.sh"];
    result = await helperService.executeSh(shPath, "sh", parameters);
    console.info("\ndownTerraform.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("downTerraform.sh failed");
    }
  } catch (error: any) {
    console.error("Error:", error.message);

    // down terraform if there was an error
    parameters = ["downTerraform.sh"];
    result = await helperService.executeSh(shPath, "sh", parameters);
    console.info("\ndownTerraform.sh finished.");
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

  const duration = 300;
  const threadCountPerPod = 100;

  // get pod and node count according to could provider
  const { podPerNode, plannedPodCount, plannedNodeCount } =
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

  // check cloud provider
  if ((await helperService.checkCloudProvider(cloudProvider, res)) === false)
    return;

  // check file
  if ((await helperService.checkFile(uploadedFile, res)) === false) return;

  // place jmx file to related path
  if (
    (await helperService.moveJmxFile(
      "./upload/loadtest.jmx",
      `../Terraform/${cloudProvider}/jmx_Config/loadtest.jmx`,
      res
    )) == false
  )
    return;

  // start sh operations
  runAllSteps(
    req,
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

// ----------------------------------------------------------- Temporary endpoint for frontend trials
app.post("/temp", upload.single("jmxFile"), (req, res) => {
  return helperService.returnPositiveMessage(res, "temp message", null);
});

app.listen(port, () => {
  console.log(`App is running on : http://localhost:${port}`);
});
