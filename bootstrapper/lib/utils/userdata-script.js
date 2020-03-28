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

    const runAfterDeploy = [""];
    neo4jEc2.addUserData(runAfterDeploy.join("\n"));
  };

  return { setupDockerScript };
};

module.exports = { UserDataScript };
