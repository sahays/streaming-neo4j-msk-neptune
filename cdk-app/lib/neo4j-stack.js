const cdk = require("@aws-cdk/core");
const {
  Instance,
  InstanceType,
  LookupMachineImage,
  SecurityGroup,
  Protocol,
  Port,
  Peer
} = require("@aws-cdk/aws-ec2");
const {
  Policy,
  PolicyStatement,
  Effect,
  ManagedPolicy
} = require("@aws-cdk/aws-iam");

class Neo4jStack extends cdk.Stack {
  S3Bucket;
  S3bucketPolicy;
  Neo4jEc2;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { customVpc, neptuneCluster, instanceSg } = props;

    const neo4jEc2 = this.createEc2(customVpc, instanceSg);

    const neptunePolicy = this.makeNeptunePolicy();

    this.attachIamPolicies(neo4jEc2, neptunePolicy);

    this.setStartupScript(neo4jEc2, neptuneCluster);

    this.Neo4jEc2 = neo4jEc2;
  }

  attachIamPolicies(neo4jEc2, neptunePolicy) {
    // neo4jEc2.role.attachInlinePolicy(s3Policy);
    neo4jEc2.role.attachInlinePolicy(neptunePolicy.inlinePolicy);
    neo4jEc2.role.addManagedPolicy(neptunePolicy.managedPolicy);
  }

  makeS3InlinePolicy(s3Bucket) {
    const ec2S3Policy = new PolicyStatement({
      effect: Effect.ALLOW
    });
    ec2S3Policy.addActions("s3:*");
    ec2S3Policy.addResources(s3Bucket.bucketArn);

    const ec2S3ObjectPolicy = new PolicyStatement({
      effect: Effect.ALLOW
    });
    ec2S3ObjectPolicy.addActions("s3:*");
    ec2S3ObjectPolicy.addResources(s3Bucket.bucketArn + "/*");

    return new Policy(this, "ec2S3", {
      statements: [ec2S3Policy, ec2S3ObjectPolicy]
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

  setStartupScript(neo4jEc2, neptuneCluster) {
    const output =
      "sudo su root\n" +
      "exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1 \n" +
      "yum update -y\n";
    neo4jEc2.addUserData(output);

    const gremlinInstall =
      "yum install unzip\n" +
      "wget https://archive.apache.org/dist/tinkerpop/3.4.1/apache-tinkerpop-gremlin-console-3.4.1-bin.zip\n" +
      "unzip apache-tinkerpop-gremlin-console-3.4.1-bin.zip\n" +
      "cd apache-tinkerpop-gremlin-console-3.4.1\n" +
      "wget https://www.amazontrust.com/repository/SFSRootCAG2.pem\n";
    neo4jEc2.addUserData(gremlinInstall);

    const neptuneConfig =
      "cd conf\n" +
      "touch neptune-remote.yaml\n" +
      'echo "hosts: [' +
      neptuneCluster.attrEndpoint +
      ']" >> neptune-remote.yaml\n' +
      'echo "port: 8182" >> neptune-remote.yaml\n' +
      'echo "connectionPool: { enableSsl: true, trustCertChainFile: "SFSRootCAG2.pem"}" >> neptune-remote.yaml\n' +
      'echo "serializer: { className: org.apache.tinkerpop.gremlin.driver.ser.GryoMessageSerializerV3d0, config: { serializeResultToString: true }}" >> neptune-remote.yaml\n';
    neo4jEc2.addUserData(neptuneConfig);
  }

  createEc2(customVpc, instanceSg) {
    const neo4jEc2 = new Instance(this, "neo4j", {
      vpc: customVpc,
      instanceType: InstanceType.of(
        this.node.tryGetContext("ec2_class"),
        this.node.tryGetContext("ec2_type")
      ),
      machineImage: new LookupMachineImage({
        name: this.node.tryGetContext("ami_name"),
        owners: [this.node.tryGetContext("ami_owner")]
      }),
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
