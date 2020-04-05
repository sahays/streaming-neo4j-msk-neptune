// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const cdk = require("@aws-cdk/core");

const EmitOutput = () => {
  const emitNetworkStackOutputs = (scope, networkStack) => {
    new cdk.CfnOutput(scope, "VpcId", {
      value: networkStack.CustomVpc.vpcId,
      description: "VPC Id"
    });
  };

  const emitMskStackOutputs = (scope, mskStack) => {
    new cdk.CfnOutput(scope, "MSKCluster", {
      value: mskStack.MskRef,
      description: "MSK Cluster"
    });
  };

  const emitNeptuneStackOutputs = (scope, neptuneStack) => {
    new cdk.CfnOutput(scope, "NeptuneDbClusterIdentifier", {
      value: neptuneStack.NeptuneDBClusterIdentifier,
      description: "Neptune cluster"
    });
    new cdk.CfnOutput(scope, "NeptuneClusterEndpoint", {
      value: neptuneStack.NeptuneDBCluster.attrEndpoint,
      description: "Neptune cluster"
    });
    new cdk.CfnOutput(scope, "NeptuneTrustedRole", {
      value: neptuneStack.NeptuneTrustedRoleArn,
      description: "Neptune cluster IAM role"
    });
  };

  const emitNeo4jStackOutputs = (scope, neo4jEc2) => {
    new cdk.CfnOutput(scope, "Neo4jEc2Instance", {
      value: neo4jEc2.instanceId,
      description: "EC2 instance for Neo4j"
    });
  };

  const emit = (scope, neo4jEc2, neptuneStack, mskStack, networkStack) => {
    emitNeo4jStackOutputs(scope, neo4jEc2);
    emitNeptuneStackOutputs(scope, neptuneStack);
    emitMskStackOutputs(scope, mskStack);
    emitNetworkStackOutputs(scope, networkStack);
  };

  return { emit };
};

module.exports = { EmitOutput };
