// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const StartupScript = () => {
  const setupDockerScript = (info) => {
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

    const setEnvVars = [
      "export NODE_TOPIC=",
      "export RELS_TOPIC=",
      "export ZOOKEEPER_CONNECT=",
      "export BOOTSTRAP_SERVERS="
    ];
    neo4jEc2.addUserData(setEnvVars.join("\n"));

    const runContainers = [
      "docker run -dt sanjeets/neo4j-400-stream-enabled:1",
      "docker run -dt sanjeets/kafka-consumer-app"
    ];
    neo4jEc2.addUserData(runContainers.join("\n"));
  };

  return { setupDockerScript };
};

module.exports = { StartupScript };
