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

module.exports = { getMskConnectionString };
