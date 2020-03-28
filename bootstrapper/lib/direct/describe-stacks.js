const AWS = require("aws-sdk");

const describeStack = async () => {
  const cfn = new AWS.CloudFormation({
    apiVersion: "2010-05-15",
    region: process.env.AWS_REGION
  });
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
