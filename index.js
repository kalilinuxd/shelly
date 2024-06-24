const { spawn } = require("child_process");
const logger = require("./utils/log");

const express = require("express");
const app = express();

const port = process.env.PORT || 44949;

app.listen(port, () =>
  logger(`Your app is listening at port :${port}`, "[ ONLINE ]"),
);

function startBot(message) {
  message ? logger(message, "[ Starting ]") : "";

  const child = spawn(
    "node",
    ["--trace-warnings", "--async-stack-traces", "Shelly.js"],
    {
      cwd: __dirname,
      stdio: "inherit",
      shell: true,
    },
  );

  child.on("close", (codeExit) => {
    if (codeExit != 0 || (global.countRestart && global.countRestart < 5)) {
      startBot("Starting up...");
      global.countRestart += 1;
      return;
    } else return;
  });

  child.on("error", function (error) {
    logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
  });
}

startBot();
app.get("/", (req, res) => res.send("Hi From Shelly"));
