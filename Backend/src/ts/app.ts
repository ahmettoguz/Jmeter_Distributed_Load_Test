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

// ----------------------------------------------------------------------------

async function executeSh(shPath, shCommand, parameters) {
  return new Promise((resolve, reject) => {
    let output: string[] = [];
    const proc = cp.spawn(shCommand, parameters, {
      cwd: shPath,
      shell: "/bin/bash",
      env: process.env,
    });
    proc.stdout.on("data", (data) => {
      // console.info(data.toString());
      output.push(data.toString());
    });
    proc.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    proc.on("close", (code) => {
      if (code != 0)
        console.info(`child process close all stdio with code ${code}`);
    });
    proc.on("exit", (data) => {
      resolve(output);
    });
  });
}

app.get("/", async (req, res) => {
  res.status(200).send("Service is up");
});

app.get("/digitalOceanTerraform", async (req, res) => {
  // http://142.93.164.127/digitalOceanTerraform?apiToken=<...>&nodeCount=3&podCount=3&threadCount=20
  const nodeCount = req.query.nodeCount;
  const podCount = req.query.podCount;
  const threadCount = req.query.threadCount;
  const apiToken = req.query.threadCount;

  const shPath = "../Terraform/DigitalOcean/script";

  let parameters;
  let out;

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
  ];
  out = await executeSh(shPath, "sh", parameters);
  // out = out.map((str) => str.replaceAll("\n", ""));
  console.info(out, "\nprepare.sh çalıştırıldı.");

  // execute up sh file
  parameters = ["up.sh"];
  out = await executeSh(shPath, "sh", parameters);
  console.info(out, "\nup.sh çalıştırıldı.");

  // execute result sh file
  parameters = ["result.sh"];
  out = await executeSh(shPath, "sh", parameters);
  console.info(out, "\nresult.sh çalıştırıldı.");

  // execute down sh file
  parameters = ["down.sh"];
  out = await executeSh(shPath, "sh", parameters);
  console.info(out, "\ndown.sh çalıştırıldı.");

  // res.status(200).json(out);
});

app.listen(port, () => {
  console.log(`App is running on : http://localhost:${port}`);
});
