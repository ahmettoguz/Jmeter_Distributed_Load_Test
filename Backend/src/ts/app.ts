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
let parameters;

async function executeSh(shPath, shCommand, parameters) {
  return new Promise((resolve, reject) => {
    let output: string[] = [];
    const proc = cp.spawn(shCommand, parameters, {
      cwd: shPath,
      shell: true,
    });

    proc.stdout.on("data", (data) => {
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
  const shPath = "../Terraform/DigitalOcean/script";
  let out;
  
  // execute ls
  out = await executeSh(shPath, "ls", parameters);
  console.info(out);

  const apiToken = req.query.apiToken;
  parameters = ["token.sh", apiToken];
  out = await executeSh(shPath, "source", parameters);
  out = out.map((str) => str.replaceAll("\n", ""));
  console.info(out);

  // execute prepare sh file
  // parameters = ["prepare.sh", "-n", "2", "-p", "1", "-t", "10"];
  // out = await executeSh(shPath, "sh", parameters);
  // out = out.map((str) => str.replaceAll("\n", ""));
  // console.info(out);

  res.status(200).json(out);
});

app.listen(port, () => {
  console.log(`App is running on : http://localhost:${port}`);
});
