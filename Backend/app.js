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
let shFileName;
let parameters;

async function executeShell(shPath, shFileName, parameters) {
  return new Promise((resolve, reject) => {
    let output = [];
    const proc = cp.spawn("sh", [shPath + "/" + shFileName, ...parameters], {
      shell: true,
    });

    proc.stdout.on("data", (data) => {
      output.push(data.toString());
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

  // execute prepare sh file
  shFileName = "prepare.sh";
  parameters = ["-n", "50", "-p", "1", "-t", "10"];
  const out = await executeShell(shPath, shFileName, parameters);

  console.info(out);
  res.status(200).json(out);
});

app.listen(port, () => {
  console.log(`App is running on : http://localhost:${port}`);
});
