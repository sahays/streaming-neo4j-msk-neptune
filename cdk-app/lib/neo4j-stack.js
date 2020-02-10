const cdk = require("@aws-cdk/core");
const {
  Instance,
  InstanceType,
  AmazonLinuxImage,
  AmazonLinuxGeneration,
  EbsDeviceVolumeType
} = require("@aws-cdk/aws-ec2");
const {
  Policy,
  PolicyStatement,
  Effect,
  ManagedPolicy
} = require("@aws-cdk/aws-iam");
const { StartupScript } = require("./shared/startup-script");
const { EmitOutput } = require("./shared/emit-output");

class Neo4jStack extends cdk.Stack {
  S3Bucket;
  S3bucketPolicy;
  Neo4jEc2;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { setStartupScript } = StartupScript();
    const { emit } = EmitOutput();
    const { neptuneStack, networkStack, mskStack } = props;
    const { CustomVpc, InstanceSg } = networkStack;
    const { NeptuneDBCluster } = neptuneStack;
    const { MskRef } = mskStack;

    const neo4jEc2 = this.createEc2(CustomVpc, InstanceSg);

    const neptunePolicy = this.makeNeptunePolicy();
    const mskInlinePolicy = this.makeMskInlinePolicy(MskRef);
    this.attachIamPolicies(neo4jEc2, neptunePolicy, mskInlinePolicy);

    setStartupScript({
      neo4jEc2: neo4jEc2,
      neptuneCluster: NeptuneDBCluster,
      neo4jPwd: this.node.tryGetContext("neo4j_pwd"),
      neptunePort: this.node.tryGetContext("neptune_port"),
      nodeTopic: this.node.tryGetContext("node_topic"),
      relsTopic: this.node.tryGetContext("rels_topic"),
      mskCluster: MskRef,
      region: process.env.CDK_DEFAULT_REGION
    });
    this.Neo4jEc2 = neo4jEc2;

    emit(this, this.Neo4jEc2, neptuneStack, mskStack, networkStack);
  }

  attachIamPolicies(neo4jEc2, neptunePolicy, mskInlinePolicy) {
    neo4jEc2.role.attachInlinePolicy(neptunePolicy.inlinePolicy);
    neo4jEc2.role.addManagedPolicy(neptunePolicy.managedPolicy);
    neo4jEc2.role.attachInlinePolicy(mskInlinePolicy);
  }

  makeMskInlinePolicy(mskClusterArn) {
    const ec2MskPolicy = new PolicyStatement({
      effect: Effect.ALLOW
    });
    ec2MskPolicy.addActions("kafka:DescribeCluster");
    ec2MskPolicy.addActions("kafka:GetBootstrapBrokers");
    ec2MskPolicy.addResources(mskClusterArn);

    return new Policy(this, "ec2Msk", {
      statements: [ec2MskPolicy]
    });
  }

  makeNeptunePolicy() {
    const neptunePolicy = new PolicyStatement({
      effect: Effect.ALLOW
    });
    neptunePolicy.addActions("neptune-db:*");
    neptunePolicy.addResources("arn:aws:neptune-db:*:*:*/database");

    return {
      inlinePolicy: new Policy(this, "ec2Neptune", {
        statements: [neptunePolicy]
      }),
      managedPolicy: ManagedPolicy.fromAwsManagedPolicyName(
        "NeptuneReadOnlyAccess"
      )
    };
  }

  createEc2(customVpc, instanceSg) {
    const neo4jEc2 = new Instance(this, "neo4j", {
      vpc: customVpc,
      instanceType: InstanceType.of(
        this.node.tryGetContext("ec2_class"),
        this.node.tryGetContext("ec2_type")
      ),
      machineImage: new AmazonLinuxImage({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
      blockDevices: [
        {
          deviceName: "/dev/xvda",
          volume: {
            ebsDevice: {
              deleteOnTermination: true,
              volumeSize: 50,
              volumeType: EbsDeviceVolumeType.GP2
            }
          }
        }
      ],
      vpcSubnets: {
        subnets: customVpc.publicSubnets
      },
      securityGroup: instanceSg,
      keyName: this.node.tryGetContext("ec2_key_pair")
    });
    return neo4jEc2;
  }
}

module.exports = { Neo4jStack };
