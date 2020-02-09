const cdk = require("@aws-cdk/core");
const { CfnCluster } = require("@aws-cdk/aws-msk");

class MskStack extends cdk.Stack {
  ClusterName;
  MskRef;
  Cluster;
  constructor(scope, id, props) {
    super(scope, id, props);
    const { networkStack } = props;
    const { CustomVpc, MskSg } = networkStack;
    const cluster = this.createMskCluster(CustomVpc, MskSg);
    this.ClusterName = cluster.clusterName;
    this.MskRef = cluster.ref;
    this.Cluster = cluster;
  }

  createMskCluster(customVpc, mskSg) {
    const clientSubnets = [];
    customVpc.publicSubnets.map((sub) => {
      clientSubnets.push(sub.subnetId);
    });
    return new CfnCluster(this, "msk-cluster", {
      kafkaVersion: "2.2.1",
      numberOfBrokerNodes: 2,
      enhancedMonitoring: "PER_TOPIC_PER_BROKER",
      clusterName: "streaming-neo4j-neptune-cluster",
      brokerNodeGroupInfo: {
        clientSubnets: clientSubnets,
        instanceType: "kafka.m5.large",
        securityGroups: [mskSg.securityGroupId]
      }
    });
  }
}

module.exports = { MskStack };
