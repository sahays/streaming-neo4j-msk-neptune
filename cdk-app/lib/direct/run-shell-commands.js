const shell = require("shelljs");
const source = "./shell-commands.sh";
const vars = "./stream-blog-data.json";
const fs = require("fs");
const log = (message) =>
  fs.appendFileSync("run-shell-commands.log", message + "\n");

const run = () => {
  let inputs;

  if (fs.existsSync(vars)) {
    inputs = JSON.parse(fs.readFileSync(vars));
    console.log(inputs);
  } else {
    console.log(vars + " doesn't exist");
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
    const content = fs.readFileSync(source, "utf-8");
    const lines = content.split("\n");
    const runLine = (line) => {
      try {
        if (line.length === 0) {
          log("<empty line/>");
        } else if (line.startsWith("##")) {
          log(line);
        } else if (line.indexOf("$$") > -1) {
          line = transformLine(line);
          shell.exec(line);
          log("transformed " + line);
        } else {
          shell.exec(line);
          log("executed " + line);
        }
      } catch (e) {
        log("[ERROR] executing: " + line);
      }
    };

    lines.map((line) => runLine(line));
  } else {
    log("[ERROR] source: " + source + " doesn't exist");
  }
};

const main = async () => {
  try {
    run();
    log("complete");
  } catch (e) {
    log("[Error]: " + JSON.stringify(e));
  }
};

main();
