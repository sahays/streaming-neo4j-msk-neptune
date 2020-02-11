const shell = require("shelljs");
const source = "./shell-commands.sh";
const vars = "./stream-blog-data.json";
const fs = require("fs");
const readline = require("readline");
const { CwLogger } = require("./lib/shared/cloudwatch-logger");
const { initLogger, debugLog, errorLog } = CwLogger(
  "stream-neo4j-neptune-blog",
  "run-shell-commands-" + Date.now()
);

const run = async () => {
  let inputs;
  if (fs.existsSync(vars)) {
    inputs = JSON.parse(fs.readFileSync(vars));
  }

  const transformLine = (line) => {
    Object.keys(inputs).map((key) => {
      if (line.indexOf(key) > -1) {
        line = line.replace("$$" + key, inputs[key]);
      }
    });
    return line;
  };

  if (fs.existsSync(source)) {
    await initLogger();
    const readInterface = readline.createInterface({
      input: fs.createReadStream(source),
      console: false
    });
    readInterface.on("line", async (line) => {
      if (line.startsWith("##")) {
        await debugLog(line);
      } else if (line.indexOf("$$") > -1) {
        line = transformLine(line);
        shell.exec(line);
      } else {
        shell.exec(line);
      }
      await debugLog("executed " + line);
    });
  } else {
    errorLog("source: " + source + " doesn't exist");
  }
};

try {
  run();
} catch (e) {
  errorLog("unhandled exception");
  errorLog(e);
}
