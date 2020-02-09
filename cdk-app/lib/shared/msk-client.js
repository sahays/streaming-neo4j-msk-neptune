const AWS = require("aws-sdk");
const MskClient = () => {
  const kafka = new AWS.Kafka({ apiVersion: "2018-11-14" });
  const getZookeeperConnections = async (mskClusterArn) => {
    const result = await kafka
      .describeCluster({
        ClusterArn: mskClusterArn
      })
      .promise();
    if (err) {
      console.log(err);
      return;
    }
    if (result.data && result.data.ClusterInfo)
      return result.data.ClusterInfo.ZookeeperConnectString;
    return;
  };
  const getBootstrapServers = async (mskClusterArn) => {
    const result = await kafka
      .getBootstrapBrokers({
        ClusterArn: mskClusterArn
      })
      .promise();
    if (err) {
      console.log(err);
      return;
    }
    if (result.data) return result.data.BootstrapBrokerStringTls;
    return;
  };

  return { getZookeeperConnections, getBootstrapServers };
};

module.exports = { MskClient };
