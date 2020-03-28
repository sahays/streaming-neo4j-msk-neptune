const AWS = require("aws-sdk");

const describeStack = async () => {
  const cfn = new AWS.CloudFormation();
  const neptuneStackJson = await cfn
    .describeStacks({ StackName: "streaming-blog-neptune-stack" })
    .promise();
  const mskStackJson = await cfn
    .describeStacks({ StackName: "streaming-blog-msk-stack" })
    .promise();
  console.log(neptuneStackJson);
  console.log(mskStackJson);
};

describeStack();
