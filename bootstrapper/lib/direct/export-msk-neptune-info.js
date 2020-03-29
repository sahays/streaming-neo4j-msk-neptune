const { fileToJson } = require("../utils/read-file");
const { overwriteFile } = require("../utils/write-file");
const { addNeptuneIamRole } = require("./neptune-add-role");
const { getMskConnectionString } = require("./msk-connection-string");

const describeNeptuneStack = fileToJson(
  "streaming-blog-neptune-stack.json.env"
);
const describeMskStack = fileToJson("streaming-blog-msk-stack.json.env");
const neptuneStack = describeNeptuneStack.Stacks[0];
const mskStack = describeMskStack.Stacks[0];
const neptuneClusterEnpoint = neptuneStack.Outputs[0].OutputValue;
const neptuneClusterIdentifier = neptuneStack.Outputs[1].OutputValue;
const neptuneIamRoleArn = neptuneStack.Outputs[2].OutputValue;
const mskCluster = mskStack.Outputs[0].OutputValue;
const awsRegion = process.env.AWS_REGION;
const outputPath = process.env.CONFIG_OUTPUT_PATH || "";

addNeptuneIamRole({
  neptuneClusterIdentifier,
  neptuneIamRoleArn,
  region: awsRegion
});

const getConnectionStrings = async () => {
  try {
    const connectionStrings = await getMskConnectionString({
      mskCluster,
      region: awsRegion
    });
    const output = [
      "#!/bin/bash",
      "export BOOTSTRAP_SERVERS=" + connectionStrings.broker,
      "export ZOOKEEPER_CONNECT=" + connectionStrings.zookeeper
    ];
    overwriteFile(outputPath + "ec2-configuration.sh", output.join("\n"));
  } catch (e) {
    console.log(e);
  }
};

getConnectionStrings();
