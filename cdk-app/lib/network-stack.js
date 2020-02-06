const cdk = require("@aws-cdk/core");
const { SecurityGroup, Protocol, Port, Peer } = require("@aws-cdk/aws-ec2");
const {
  Vpc,
  SubnetType,
  Connections,
  GatewayVpcEndpointAwsService
} = require("@aws-cdk/aws-ec2");

class NetworkStack extends cdk.Stack {
  CustomVpc;
  InstanceSg;
  MskSg;

  constructor(scope, id, props) {
    super(scope, id, props);

    this.CustomVpc = new Vpc(this, "vpc", {
      cidr: this.node.tryGetContext("vpc_cidr"),
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "public",
          subnetType: SubnetType.PUBLIC
        }
      ]
    });

    this.InstanceSg = this.createInstanceSg(this.CustomVpc);
    this.MskSg = this.createMskSg(this.CustomVpc, this.InstanceSg);
  }

  createMskSg(customVpc, instanceSg) {
    const sg = new SecurityGroup(this, "msk-sg", {
      vpc: customVpc,
      allowAllOutbound: true
    });
    sg.connections.allowFrom(
      instanceSg,
      new Port({
        protocol: Protocol.TCP,
        fromPort: 0,
        toPort: 65535,
        stringRepresentation: "all ports from ec2"
      }),
      "from ec2"
    );
    return sg;
  }

  createInstanceSg(customVpc) {
    const instanceSg = new SecurityGroup(this, "neo4j-sg", {
      vpc: customVpc,
      allowAllOutbound: true
    });
    instanceSg.addIngressRule(
      Peer.anyIpv4(),
      new Port({
        protocol: Protocol.TCP,
        stringRepresentation: "ssh",
        fromPort: 22,
        toPort: 22
      })
    );
    return instanceSg;
  }
}

module.exports = { NetworkStack };
