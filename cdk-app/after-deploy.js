const AWS = require("aws-sdk");
const fs = require("fs");

try {
  const sharedData = JSON.parse(fs.readFileSync("neptuneStack-shared.json"));
  console.log(sharedData);
  const neptune = new AWS.Neptune({
    apiVersion: "2014-10-31",
    region: sharedData.region
  });
  neptune.addRoleToDBCluster(
    {
      DBClusterIdentifier: sharedData.DBClusterIdentifier,
      RoleArn: sharedData.RoleArn
    },
    (err, data) => {
      if (err) {
        console.log(err.code);
        return;
      }
      console.log(data);
    }
  );
} catch (e) {
  console.log("failed to addRoleToDBCluster");
}
