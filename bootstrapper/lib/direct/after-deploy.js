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

addNeptuneIamRole({
  neptuneClusterIdentifier,
  neptuneIamRoleArn,
  region: process.env.AWS_REGION
});

const getConnectionStrings = async () => {
  const connectionStrings = await getMskConnectionString({
    mskCluster,
    region: process.env.AWS_REGION
  });
  overwriteFile(
    "EC2Configuration.json",
    JSON.stringify({
      connectionStrings,
      neptuneClusterIdentifier,
      neptuneIamRoleArn,
      neptuneClusterEnpoint,
      region: stackInfo.region
    })
  );
};

getConnectionStrings();
