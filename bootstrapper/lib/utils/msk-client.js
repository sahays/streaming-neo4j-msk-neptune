const AWS = require("aws-sdk");
const MskClient = (region) => {
  const kafka = new AWS.Kafka({ apiVersion: "2018-11-14", region });
  const getZookeeperConnections = async (mskClusterArn) => {
    try {
      const result = await kafka
        .describeCluster({
          ClusterArn: mskClusterArn
        })
        .promise();
      if (result && result.ClusterInfo)
        return result.ClusterInfo.ZookeeperConnectString;
    } catch (err) {
      console.log(err);
    }
    return;
  };
  const getBootstrapServers = async (mskClusterArn) => {
    try {
      const result = await kafka
        .getBootstrapBrokers({
          ClusterArn: mskClusterArn
        })
        .promise();
      if (result) return result.BootstrapBrokerStringTls;
    } catch (err) {
      console.log(err);
    }
    return;
  };

  return { getZookeeperConnections, getBootstrapServers };
};

module.exports = { MskClient };
