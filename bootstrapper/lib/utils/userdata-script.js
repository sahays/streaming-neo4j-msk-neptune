// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const UserDataScript = () => {
  const setupDockerScript = (neo4jEc2) => {
    const installDocker = [
      "sudo su #",
      "cd /",
      "yum update -y",
      "amazon-linux-extras install docker -y",
      "service docker start",
      "usermod -a -G docker ec2-user",
      "docker info"
    ];
    neo4jEc2.addUserData(installDocker.join("\n"));

    const installDockerCompose = [
      'curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose',
      "chmod +x /usr/local/bin/docker-compose",
      "ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose"
    ];
    neo4jEc2.addUserData(installDockerCompose.join("\n"));

    const runAfterDeploy = [
      "export CONFIG_OUTPUT_PATH=/data/",
      "mkdir data",
      "docker run -t --mount type=bind,src=/data,target=/data sanjeets/streaming-blog-after-deploy:3dbb04b sh ./run-script.sh",
      "chmod +x data/ec2-configuration.sh && . data/ec2-configuration.sh",
      "docker run -d -e ZOOKEEPER_CONNECT -e BOOTSTRAP_SERVERS -e AWS_REGION --name neo4j-400-msk sanjeets/neo4j-400-msk:c9d2143",
      "docker exec -t -e ZOOKEEPER_CONNECT -e BOOTSTRAP_SERVERS -e AWS_REGION neo4j-400-msk sh -c ./update-conf.sh"
    ];
    neo4jEc2.addUserData(runAfterDeploy.join("\n"));
  };

  return { setupDockerScript };
};

module.exports = { UserDataScript };
