const cdk = require("@aws-cdk/core");
const { CfnCluster } = require("@aws-cdk/aws-msk");
const { SecurityGroup, Protocol, Port, Peer } = require("@aws-cdk/aws-ec2");

class MskStack extends cdk.Stack {
  ClusterName;
  Ref;
  Cluster;
  constructor(scope, id, props) {
    super(scope, id, props);
    const { customVpc, mskSg } = props;
    const cluster = this.createMskCluster(customVpc, mskSg);
    this.ClusterName = cluster.clusterName;
    this.Ref = cluster.ref;
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
