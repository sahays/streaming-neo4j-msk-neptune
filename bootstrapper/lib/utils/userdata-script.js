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
      "chkconfig docker on",
      "yum install -y git"
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
      "export AWS_REGION=" + process.env.CDK_DEFAULT_REGION,
      "mkdir data",
      "docker run -t --mount type=bind,src=/data,target=/data sanjeets/streaming-blog-after-deploy:3dbb04b sh ./run-script.sh",
      "chmod +x data/setup-env.sh && . data/setup-env.sh",
      "docker run -d --ulimit nofile=40000:40000 -e ZOOKEEPER_CONNECT -e BOOTSTRAP_SERVERS -e AWS_REGION -e NODE_TOPIC -e RELS_TOPIC  --name neo4j-400-msk sanjeets/neo4j-400-msk:1ff9773",
      "docker exec -t -e ZOOKEEPER_CONNECT -e BOOTSTRAP_SERVERS -e AWS_REGION -e NODE_TOPIC -e RELS_TOPIC  neo4j-400-msk sh -c /run-script.sh"
    ];
    neo4jEc2.addUserData(runAfterDeploy.join("\n"));
  };

  return { setupDockerScript };
};

// docker-compose -f 01-docker-compose.yml
// export DOCKER_VOL_PATH=`docker volume inspect --format '{{ .Mountpoint }}' streaming-neo4j-msk-neptune_shared-folder`
// . /$DOCKER_VOL_PATH/setup-env.sh
// docker-compose -f 02-docker-compose.yml

// git stash && git pull && chmod +x startup.sh && . startup.sh
// docker container exec -it neo4j-service cypher-shell

// create new topic
// wget https://archive.apache.org/dist/kafka/2.2.1/kafka_2.12-2.2.1.tgz
// tar -xzf kafka_2.12-2.2.1.tgz
// cd kafka_2.12-2.2.1/bin
// kafka-topics.sh --create --zookeeper $ZOOKEEPER_CONNECT --replication-factor 2 --partitions 1 --topic $NODE_TOPIC

// test topics
// update-alternatives --config java
// yum --showduplicates list java-1.8.0-openjdk
// ./kafka-console-producer.sh --broker-list $BOOTSTRAP_SERVERS --producer.config client.properties --topic $NODE_TOPIC
// ./kafka-console-consumer.sh --bootstrap-server $BOOTSTRAP_SERVERS --consumer.config client.properties --topic $NODE_TOPIC --from-beginning

// wget --directory-prefix /usr/local/bin/docker-compose https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)
// chmod +x /usr/local/bin/docker-compose
// ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

module.exports = { UserDataScript };
