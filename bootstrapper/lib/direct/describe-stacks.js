const AWS = require("aws-sdk");
const { overwriteFile } = require("../utils/write-file");
const sharedFolder = process.env.SHARED_FOLDER || "/data";

const describeStack = async () => {
  const cfnArgs = {
    apiVersion: "2010-05-15",
    region: process.env.AWS_REGION
  };
  console.log(cfnArgs);
  try {
    const cfn = new AWS.CloudFormation(cfnArgs);
    const neptuneStackJson = await cfn
      .describeStacks({ StackName: "streaming-blog-neptune-stack" })
      .promise();
    const mskStackJson = await cfn
      .describeStacks({ StackName: "streaming-blog-msk-stack" })
      .promise();
    overwriteFile(
      sharedFolder + "/streaming-blog-neptune-stack.json",
      JSON.stringify(neptuneStackJson)
    );
    overwriteFile(
      sharedFolder + "/streaming-blog-msk-stack.json",
      JSON.stringify(mskStackJson)
    );
  } catch (e) {
    console.log(e);
  }
};

describeStack();
