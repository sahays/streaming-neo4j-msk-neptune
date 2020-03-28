const { executeShell } = require("../utils/shell-exec");

executeShell(
  "aws cloudformation describe-stacks --stack-name streaming-blog-neptune-stack > streaming-blog-neptune-stack.json"
);
executeShell(
  "aws cloudformation describe-stacks --stack-name streaming-blog-msk-stack > streaming-blog-msk-stack.json"
);
