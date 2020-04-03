const { MskClient } = require("../utils/msk-client");

const {
  getZookeeperConnections,
  getBootstrapServers,
  createKafkaConfiguration
} = MskClient(region);

const getMskConnectionString = async ({ mskCluster, region }) => {
  try {
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
  return await createKafkaConfiguration("auto-create-topic", config.join("\n"));
};

module.exports = { getMskConnectionString, createConfiguration };
