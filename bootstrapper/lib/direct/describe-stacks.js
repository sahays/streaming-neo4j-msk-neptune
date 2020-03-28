const { execShell } = require("../utils/shell-exec");

execShell(
  "aws cloudformation describe-stacks --stack-name streaming-blog-neptune-stack > streaming-blog-neptune-stack.json"
);
execShell(
  "aws cloudformation describe-stacks --stack-name streaming-blog-msk-stack > streaming-blog-msk-stack.json"
);
