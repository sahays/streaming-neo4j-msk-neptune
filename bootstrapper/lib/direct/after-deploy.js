const { fileToJson } = require("../utils/read-file");
const { overwriteFile } = require("../utils/write-file");
const { addNeptuneIamRole } = require("./neptune-add-role");
const { getMskConnectionString } = require("./msk-connection-string");

const describeNeptuneStack = fileToJson("streaming-blog-neptune-stack.json");
const describeMskStack = fileToJson("streaming-blog-msk-stack.json");
const neptuneStack = describeNeptuneStack.Stacks[0];
const mskStack = describeMskStack.Stacks[0];
const neptuneClusterEnpoint = neptuneStack.Outputs[0].OutputValue;
const neptuneClusterIdentifier = neptuneStack.Outputs[1].OutputValue;
const neptuneIamRoleArn = neptuneStack.Outputs[2].OutputValue;
const mskCluster = mskStack.Outputs[0].OutputValue;
const awsRegion = process.env.AWS_REGION;

addNeptuneIamRole({
  neptuneClusterIdentifier,
  neptuneIamRoleArn,
  region: awsRegion
});

const getConnectionStrings = async () => {
  const connectionStrings = await getMskConnectionString({
    mskCluster,
    region: awsRegion
  });
  overwriteFile(
    "EC2Configuration.json",
    JSON.stringify({
      connectionStrings,
      neptuneClusterIdentifier,
      neptuneIamRoleArn,
      neptuneClusterEnpoint,
      region: awsRegion
    })
  );
};

getConnectionStrings();
