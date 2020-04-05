// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const { fileToJson } = require("../utils/read-file");
const { overwriteFile } = require("../utils/write-file");
const { addNeptuneIamRole } = require("./neptune-add-role");
const { getMskConnectionString, createConfiguration } = require("./msk-setup");
const sharedFolder = process.env.SHARED_FOLDER || "/data";

const describeNeptuneStack = fileToJson(
  sharedFolder + "/streaming-blog-neptune-stack.json"
);
const describeMskStack = fileToJson(
  sharedFolder + "/streaming-blog-msk-stack.json"
);
const neptuneStack = describeNeptuneStack.Stacks[0];
const mskStack = describeMskStack.Stacks[0];
const neptuneClusterEnpoint = neptuneStack.Outputs[0].OutputValue;
const neptuneClusterIdentifier = neptuneStack.Outputs[1].OutputValue;
const neptuneIamRoleArn = neptuneStack.Outputs[2].OutputValue;
const mskCluster = mskStack.Outputs[0].OutputValue;
const awsRegion = process.env.AWS_REGION;
// const outputPath = process.env.CONFIG_OUTPUT_PATH || "";

addNeptuneIamRole({
  neptuneClusterIdentifier,
  neptuneIamRoleArn,
  region: awsRegion
});

const asyncGetConnectionStrings = async () => {
  try {
    const connectionStrings = await getMskConnectionString({
      mskCluster
    });
    const output = [
      "export AWS_REGION=" + awsRegion,
      "export BOOTSTRAP_SERVERS=" + connectionStrings.broker,
      "export ZOOKEEPER_CONNECT=" + connectionStrings.zookeeper,
      "export KAFKA_TOPIC=neo4j",
      "export NEPTUNE_HOST=" + neptuneClusterEnpoint // for docker gremlin
    ];
    overwriteFile(sharedFolder + "/setup-env.sh", output.join("\n"));
  } catch (e) {
    console.log(e);
  }
};

const asyncCreateConfiguration = async () => {
  try {
    await createConfiguration();
  } catch (e) {
    console.log(e);
  }
};

asyncGetConnectionStrings();
asyncCreateConfiguration();
