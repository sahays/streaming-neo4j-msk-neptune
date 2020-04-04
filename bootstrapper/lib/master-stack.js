const cdk = require("@aws-cdk/core");
class MasterStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { neo4jStack, neptuneStack, networkStack, mskStack } = props;

    // this.emitNeo4jStackOutputs(neo4jStack);
    // this.emitNeptuneStackOutputs(neptuneStack);
    // this.emitNetworkStackOutputs(networkStack);
    // this.emitMskStackOutputs(mskStack);
  }

  emitMskStackOutputs(mskStack) {
    new cdk.CfnOutput(this, "MSKCluster", {
      value: mskStack.Ref,
      description: "MSK Cluster"
    });
  }

  emitNetworkStackOutputs(networkStack) {
    new cdk.CfnOutput(this, "VpcId", {
      value: networkStack.CustomVpc.vpcId,
      description: "VPC Id"
    });
  }

  emitBucketStackOutputs(bucketStack) {
    new cdk.CfnOutput(this, "S3BucketArn", {
      value: bucketStack.S3Bucket.bucketArn,
      description: "Bucket Arn"
    });
    new cdk.CfnOutput(this, "S3BucketName", {
      value: bucketStack.S3Bucket.bucketName,
      description: "Bucket name"
    });
  }

  emitNeptuneStackOutputs(neptuneStack) {
    new cdk.CfnOutput(this, "NeptuneDbClusterIdentifier", {
      value: neptuneStack.NeptuneDBClusterIdentifier,
      description: "Neptune cluster"
    });
    new cdk.CfnOutput(this, "LoaderEndpoint", {
      value:
        "http://" +
        neptuneStack.NeptuneDBCluster.attrEndpoint +
        ":" +
        neptuneStack.NeptunePort +
        "/loader",
      description: "Neptune cluster"
    });
    new cdk.CfnOutput(this, "NeptuneTrustedRole", {
      value: neptuneStack.NeptuneTrustedRoleArn,
      description: "Neptune cluster IAM role"
    });
  }

  emitNeo4jStackOutputs(neo4jStack) {
    new cdk.CfnOutput(this, "Neo4jEc2Instance", {
      value: neo4jStack.Neo4jEc2.instanceId,
      description: "EC2 instance for Neo4j"
    });
    new cdk.CfnOutput(this, "Neo4jBrowser", {
      value: "http://" + neo4jStack.Neo4jEc2.instancePublicDnsName + ":7474",
      description: "neo4jBrowser"
    });
  }
}

module.exports = { MasterStack };
