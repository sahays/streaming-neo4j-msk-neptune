const cdk = require("@aws-cdk/core");
const { Bucket } = require("@aws-cdk/aws-s3");

class BucketStack extends cdk.Stack {
  S3Bucket;
  constructor(scope, id, props) {
    super(scope, id, props);
    this.S3Bucket = new Bucket(
      this,
      this.node.tryGetContext("bucket_identifier")
    );
  }
}

module.exports = { BucketStack };
