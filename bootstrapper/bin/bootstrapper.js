#!/usr/bin/env node

const cdk = require("@aws-cdk/core");
const { NeptuneStack } = require("../lib/neptune-stack");
const { NetworkStack } = require("../lib/network-stack");
const { MskStack } = require("../lib/msk-stack");
const { Ec2Stack } = require("../lib/ec2-stack");
const { overwriteFile } = require("../lib/utils/write-file");

// steps
// deploy all stacks except ec2
// run neptune-add-role and msk-get-servers
// deploy ec2 stack
// share state using .env files because each command runs in a different context

// const fs = require("fs");
process.env.CONSTANTS = JSON.stringify({
  username: "neo4j",
  password: "pass@word1",
  neptunePort: 8182,
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
});

const app = new cdk.App();
const defaultEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};
const networkStack = new NetworkStack(app, "streaming-blog-network-stack", {
  env: defaultEnv
});
const neptuneStack = new NeptuneStack(app, "streaming-blog-neptune-stack", {
  env: defaultEnv,
  customVpc: networkStack.CustomVpc
});
const mskStack = new MskStack(app, "streaming-blog-msk-stack", {
  env: defaultEnv,
  networkStack: networkStack
});
const ec2Stack = new Ec2Stack(app, "streaming-blog-ec2-stack", {
  env: defaultEnv,
  neptuneStack: neptuneStack,
  networkStack: networkStack,
  mskStack: mskStack
});

overwriteFile("StackInfo.json.env", JSON.stringify(defaultEnv));

// "deploy": "cdk deploy streaming-blog-network-stack && cdk deploy streaming-blog-neptune-stack && cdk deploy streaming-blog-msk-stack && node ./lib/direct/before-ec2-deploy.js && cdk deploy streaming-blog-ec2-stack",