const { MskClient } = require("../utils/msk-client");
const { CwLogger } = require("../utils/cloudwatch-logger");
const fs = require("fs");

const run = async () => {
  const mskInfo = JSON.parse(fs.readFileSync("msk-info.json"));

  const { mskCluster, neo4jConfig, region } = mskInfo;
  const { getZookeeperConnections, getBootstrapServers } = MskClient(region);
  const { initLogger, debugLog, errorLog } = CwLogger(
    "stream-neo4j-neptune-blog",
    "neo4j-config-msk-" + Date.now()
  );

  await initLogger();

  debugLog(mskInfo);
  const broker = await getBootstrapServers(mskCluster);
  const zookeeper = await getZookeeperConnections(mskCluster);
  debugLog({ broker, zookeeper });
  if (fs.existsSync(neo4jConfig)) {
    try {
      const fd = fs.openSync(neo4jConfig, "a");
      const zookeeperLine = "kafka.zookeeper.connect=" + zookeeper;
      const brokerLine = "kafka.bootstrap.servers=" + broker;
      const updatedFile = "\n" + zookeeperLine + "\n" + brokerLine + "\n";
      await debugLog(updatedFile);
      fs.appendFileSync(fd, updatedFile, "utf8");
      await debugLog(neo4jConfig + " file updated");
    } catch (err) {
      errorLog(err);
    }
  }
};
try {
  run();
} catch (e) {
  errorLog(e);
}
