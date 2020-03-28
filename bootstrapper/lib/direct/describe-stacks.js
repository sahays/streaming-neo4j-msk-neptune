const AWS = require("aws-sdk");
const { overwriteFile } = require("../utils/write-file");

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
    overwriteFile("streaming-blog-neptune-stack.json", neptuneStackJson);
    overwriteFile("streaming-blog-msk-stack.json", mskStackJson);
  } catch (e) {
    console.log(e);
  }
};

describeStack();
