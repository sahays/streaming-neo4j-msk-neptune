const AWS = require("aws-sdk");

const addNeptuneIamRole = ({
  neptuneClusterIdentifier,
  neptuneIamRoleArn,
  region
}) => {
  try {
    const neptune = new AWS.Neptune({
      apiVersion: "2014-10-31",
      region: region
    });
    const args = {
      DBClusterIdentifier: neptuneClusterIdentifier,
      RoleArn: neptuneIamRoleArn
    };
    console.log(args);
    neptune.addRoleToDBCluster(args, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
    });
  } catch (e) {
    console.log("failed to addRoleToDBCluster: ", e);
  }
};

module.exports = { addNeptuneIamRole };
