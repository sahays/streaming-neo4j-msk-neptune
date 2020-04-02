const { MskClient } = require("../utils/msk-client");

const getMskConnectionString = async ({ mskCluster, region }) => {
  try {
    const { getZookeeperConnections, getBootstrapServers } = MskClient(region);

    const broker = await getBootstrapServers(mskCluster);
    const zookeeper = await getZookeeperConnections(mskCluster);
    return { broker, zookeeper };
  } catch (e) {
    console.log(e);
  }
};

const createConfiguration = async () => {
  const config = [
    "auto.create.topics.enable = true",
    "zookeeper.connection.timeout.ms = 1000",
    "log.roll.ms = 604800000"
  ];
  return await MskClient.createConfiguration(
    "auto-create-topic",
    config.join("\n")
  );
};

module.exports = { getMskConnectionString, createConfiguration };
