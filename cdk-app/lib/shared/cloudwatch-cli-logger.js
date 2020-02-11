const argv = require("minimist")(process.argv.slice(2));
// const { CwLogger } = require("./cloudwatch-logger");
// const { initLogger, debugLog, errorLog } = CwLogger(
//   "stream-neo4j-neptune-blog",
//   "neo4j-config-msk-" + Date.now()
// );
// await initLogger();
const CwCliLogger = () => {
  debugLog(argv);
};

try {
  CwCliLogger();
} catch (e) {
  console.log(e);
}
