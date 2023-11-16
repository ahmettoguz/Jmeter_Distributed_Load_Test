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
        console.info(`child process closed with success (code ${code})`);
        resolve({ success: true, output });
      } else {
        console.error(`child process closed with error (code ${code})`);
        reject({ success: false, output });
      }
    });
    proc.on("exit", (data) => {
      resolve(output);
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
  // const nodeCount = req.body.nodeCount;

  const shPath = "../Terraform/Azure/script";
  let result;
  let parameters;

  // execute prepare sh file params: node count, pod count
  // TODO hard coded node and pod count
  parameters = ["prepare.sh", "2", "5"];
  result = await executeSh(shPath, "sh", parameters);
  console.info("\nprepare.sh finished.");

  if (!result.success) {
    console.info("Process is Failed!");
    process.exit(1);
  }

  // execute upTerraform sh file
  parameters = ["upTerraform.sh"];
  result = await executeSh(shPath, "sh", parameters);
  console.info("\nupTerraform.sh finished.");

  if (!result.success) {
    console.info("Process is Failed!");
    process.exit(1);
  }

  // execute upCluster sh file
  parameters = ["upCluster.sh"];
  await executeSh(shPath, "sh", parameters);
  console.info("\nupCluster.sh finished.");

  if (!result.success) {
    console.info("Process is Failed!");
    process.exit(1);
  }

  // execute sh runTest sh file
  parameters = ["runTest.sh"];
  await executeSh(shPath, "sh", parameters);
  console.info("\nrunTest.sh finished.");

  if (!result.success) {
    console.info("Process is Failed!");
    process.exit(1);
  }

  // execute result sh file
  parameters = ["result.sh"];
  await executeSh(shPath, "sh", parameters);
  console.info("\nresult.sh finished.");

  if (!result.success) {
    console.info("Process is Failed!");
    process.exit(1);
  }

  // execute down sh file
  parameters = ["downTerraform.sh"];
  await executeSh(shPath, "sh", parameters);
  console.info("\ndownTerraform.sh finished.");

  if (!result.success) {
    console.info("Process is Failed!");
    process.exit(1);
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

app.post("/dotf", async (req, res) => {
  console.info(
    `---\nIncoming request to: ${req.url}\nMethod: ${req.method}\nIp: ${req.connection.remoteAddress}\n---\n`
  );

  runDigitalOceanTerraform(req);

  const response = {
    status: 200,
    state: true,
    message: "Operations started.",
    data: ["no data yet."],
  };
  res.status(200).json(response);
});

app.get("/aztf", async (req, res) => {
  console.info(
    `---\nIncoming request to: ${req.url}\nMethod: ${req.method}\nIp: ${req.connection.remoteAddress}\n---\n`
  );

  runAzureTerraform(req);

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
