const express = require("express");
const cp = require("child_process");

const app = express();
const port = 80;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
  res.header("X-Content-Type-Options", "nosniff");
  next();
});

app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------- Functions
async function executeSh(shPath, shCommand, parameters) {
  return new Promise((resolve, reject) => {
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
        reject({ success: false, output });
      }
    });
    proc.on("exit", (code) => {
      if (code !== 0) {
        console.error(`child process exited with non-zero code: ${code}`);
        reject({ success: false, output });
      }
    });
  });
}

async function runDigitalOceanTerraform(req) {
  const nodeCount = req.body.nodeCount;
  const podCount = req.body.podCount;
  const threadCount = req.body.threadCount;
  const apiToken = req.body.apiToken;
  const targetUrl = req.body.targetUrl;
  const duration = req.body.duration;

  const shPath = "../Terraform/DigitalOcean/script";

  let parameters;

  // set token without file because node env is using
  process.env.TF_VAR_do_token = apiToken;

  // execute prepare sh file
  parameters = [
    "prepare.sh",
    "-n",
    nodeCount,
    "-p",
    podCount,
    "-t",
    threadCount,
    "-d",
    duration,
    "-u",
    targetUrl,
  ];
  await executeSh(shPath, "sh", parameters);
  // out = out.map((str) => str.replaceAll("\n", ""));
  console.info("\nprepare.sh finished.");

  // execute up sh file
  parameters = ["up.sh"];
  await executeSh(shPath, "sh", parameters);
  console.info("\nup.sh finished.");

  // execute result sh file
  parameters = ["result.sh"];
  await executeSh(shPath, "sh", parameters);
  console.info("\nresult.sh finished.");

  // execute down sh file
  parameters = ["down.sh"];
  await executeSh(shPath, "sh", parameters);
  console.info("\ndown.sh finished.");
}

async function runAzureTerraform(req) {
  const shPath = "../Terraform/Azure/script";
  let result;
  let parameters;

  try {
    // execute prepare sh file params: node count, pod count
    // TODO hard coded node and pod count
    parameters = ["prepare.sh", "2", "5"];
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
  }
}
// ------------------------------------------------- End Points
app.get("/", async (req, res) => {
  console.info(
    `---\nIncoming request to: ${req.url}\nMethod: ${req.method}\nIp: ${req.connection.remoteAddress}\n---\n`
  );

  const response = {
    status: 200,
    state: true,
    message: "Service is up.",
  };
  res.status(200).json(response);
});

app.post("/runTest", async (req, res) => {
  console.info(
    `---\nIncoming request to: ${req.url}\nMethod: ${req.method}\nIp: ${req.connection.remoteAddress}\n---\n`
  );

  const cloudProvider = req.body.cloudProvider;

  switch (cloudProvider) {
    case "DigitalOcean":
      runDigitalOceanTerraform(req);
      break;

    case "Azure":
      runAzureTerraform(req);
      break;

    default:
      const response = {
        status: 400,
        state: false,
        message: "Cloud provided is invalid!",
      };
      res.status(400).json(response);
      break;
  }

  const response = {
    status: 200,
    state: true,
    message: "Operations started.",
    data: ["no data yet."],
  };
  res.status(200).json(response);
});

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
