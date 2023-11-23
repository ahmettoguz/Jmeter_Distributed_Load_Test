const express = require("express");
const cp = require("child_process");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 80;

// import HelperService from "./services/HelperService";
// const helperService = new HelperService("Toyota", "Corolla");

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
function moveJmxFile(currentPath, targetPath, res) {
  fs.rename(currentPath, targetPath, function (err) {
    if (err) {
      returnNegativeMessage(res, 502, "Cannot move file!");
      return false;
    }
  });
  return true;
}

async function executeSh(shPath, shCommand, parameters) {
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

async function returnPositiveMessage(res, message, data) {
  const jsResult = {
    status: 200,
    state: true,
    message: message,
  };
  if (data != null) jsResult["data"] = data;
  res.status(200).json(jsResult);
}

async function returnNegativeMessage(res, statusCode, errorMessage) {
  const jsResult = {
    status: statusCode,
    state: false,
    errorMessage: errorMessage,
  };
  res.status(statusCode).json(jsResult);
}

async function calculateResources(
  cloudProvider,
  virtualUser,
  threadCountPerPod
) {
  let podPerNode;

  const plannedPodCount = Math.ceil(virtualUser / threadCountPerPod);

  // Your logic to calculate the values
  if (cloudProvider == "AWS") podPerNode = 1;
  else podPerNode = 5;

  const plannedNodeCount = Math.ceil(plannedPodCount / podPerNode);

  // Return an object with properties
  return { podPerNode, plannedPodCount, plannedNodeCount };
}

async function checkNodeCount(cloudProvider, plannedNodeCount, res) {
  let message;
  let status = true;

  if (cloudProvider == "Azure" && plannedNodeCount > 2) {
    message = `Azure could provider, do not offer more than 4 cpu in free tier. Current: ${
      plannedNodeCount * 2
    }`;
    status = false;
  } else if (cloudProvider == "DigitalOcean" && plannedNodeCount > 8) {
    message = `Digital Ocean could provider, do not offer more than 8 node in 1 node group with free tier. Current: ${plannedNodeCount}`;
    status = false;
  }

  if (status) return true;
  else {
    returnNegativeMessage(res, 502, message);
    return false;
  }
}

async function checkCloudProvider(cloudProvider, res) {
  if (
    cloudProvider != "DigitalOcean" &&
    cloudProvider != "Azure" &&
    cloudProvider != "AWS"
  ) {
    returnNegativeMessage(res, 400, "Cloud provider is invalid!");
    return false;
  }
  return true;
}

async function checkFile(uploadedFile, res) {
  if (uploadedFile == undefined) {
    returnNegativeMessage(res, 400, "Jmx file is not provided!");
    return false;
  }
  return true;
}

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
    result = await executeSh(shPath, "sh", parameters);
    console.info("\nprepare.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("prepare.sh failed");
    }

    // execute upTerraform sh file
    parameters = ["upTerraform.sh"];
    result = await executeSh(shPath, "sh", parameters);
    console.info("\nupTerraform.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("upTerraform.sh failed");
    }

    // execute upCluster sh file
    parameters = ["upCluster.sh"];
    result = await executeSh(shPath, "sh", parameters);
    console.info("\nupCluster.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("upCluster.sh failed");
    }

    // execute sh runTest sh file
    parameters = ["runTest.sh"];
    result = await executeSh(shPath, "sh", parameters);
    console.info("\nrunTest.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("runTest.sh failed");
    }

    // execute result sh file
    parameters = ["result.sh"];
    result = await executeSh(shPath, "sh", parameters);
    console.info("\nresult.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("result.sh failed");
    }

    // execute down sh file
    parameters = ["downTerraform.sh"];
    result = await executeSh(shPath, "sh", parameters);
    console.info("\ndownTerraform.sh finished.");

    if (!result.success) {
      console.info("Process is Failed!");
      throw new Error("downTerraform.sh failed");
    }
  } catch (error: any) {
    console.error("Error:", error.message);

    // down terraform if there was an error
    parameters = ["downTerraform.sh"];
    result = await executeSh(shPath, "sh", parameters);
    console.info("\ndownTerraform.sh finished.");
  }
}

// ------------------------------------------------- End Points
app.get("/", async (req, res) => {
  console.info(
    `---\nIncoming request to: ${req.url}\nMethod: ${req.method}\nIp: ${req.connection.remoteAddress}\n---\n`
  );

  return returnPositiveMessage(res, "Service is up", null);
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
    await calculateResources(cloudProvider, virtualUser, threadCountPerPod);

  // check free tier node counts
  if ((await checkNodeCount(cloudProvider, plannedNodeCount, res)) === false)
    return;

  // check cloud provider
  if ((await checkCloudProvider(cloudProvider, res)) === false) return;

  // check file
  if ((await checkFile(uploadedFile, res)) === false) return;

  // place jmx file to related path
  if (
    (await moveJmxFile(
      "./upload/loadtest.jmx",
      `../Terraform/${cloudProvider}/jmx_Config/loadtest.jmx`,
      res
    )) == false
  )
    return;

  // start sh operations
  // runAllSteps(
  //   req,
  //   cloudProvider,
  //   plannedNodeCount,
  //   plannedPodCount,
  //   threadCountPerPod,
  //   duration
  // );

  return returnPositiveMessage(res, "Operations started.", [
    `Planned node count : ${plannedNodeCount}`,
    `Planned pod count : ${plannedPodCount}`,
    `Thread count for each pod: ${threadCountPerPod}`,
    `Cloud Provider : ${cloudProvider}`,
  ]);
});

// ----------------------------------------------------------- Temporary endpoint for frontend trials
app.post("/temp", upload.single("jmxFile"), (req, res) => {
  return returnPositiveMessage(res, "temp message", null);
});

app.listen(port, () => {
  console.log(`App is running on : http://localhost:${port}`);
});
