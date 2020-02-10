// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const StartupScript = () => {
  const setStartupScript = ({
    neo4jEc2,
    neptuneCluster,
    neo4jPwd,
    neptunePort,
    mskCluster,
    nodeTopic,
    relsTopic,
    region
  }) => {
    const setupNeo4j = [
      "sudo su #",
      "yum update -y",
      "rpm --import https://debian.neo4j.com/neotechnology.gpg.key",
      'echo "[neo4j]" >> /etc/yum.repos.d/neo4j.repo',
      'echo "name=Neo4j RPM Repository" >> /etc/yum.repos.d/neo4j.repo',
      'echo "baseurl=https://yum.neo4j.com/stable" >> /etc/yum.repos.d/neo4j.repo',
      'echo "enabled=1" >> /etc/yum.repos.d/neo4j.repo',
      'echo "gpgcheck=1" >> /etc/yum.repos.d/neo4j.repo',
      "amazon-linux-extras enable java-openjdk11",
      "yum install neo4j-4.0.0 -y",
      "systemctl enable neo4j",
      "systemctl stop neo4j",
      'echo "apoc.export.file.enabled=true" >> /etc/neo4j/neo4j.conf',
      'echo "dbms.security.procedures.unrestricted=apoc.*" >> /etc/neo4j/neo4j.conf',
      "echo NEO4J_ULIMIT_NOFILE=60000 >> /etc/default/neo4j",
      "neo4j-admin set-initial-password " + neo4jPwd,
      "wget --directory-prefix /var/lib/neo4j/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar",
      "systemctl start neo4j",
      "cp /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.222.b10-0.amzn2.0.1.x86_64/jre/lib/security/cacerts /tmp/kafka.client.truststore.jks"
    ];
    neo4jEc2.addUserData(setupNeo4j.join("\n"));

    const setupGremlin = [
      "cd /",
      "yum install unzip",
      "wget http://apache.mirrors.spacedump.net/tinkerpop/3.4.5/apache-tinkerpop-gremlin-console-3.4.5-bin.zip",
      "unzip apache-tinkerpop-gremlin-console-3.4.5-bin.zip",
      "cd apache-tinkerpop-gremlin-console-3.4.5/",
      "wget https://www.amazontrust.com/repository/SFSRootCAG2.pem",
      "cd conf/",
      "touch neptune-remote.yaml",
      'echo "hosts: [' +
        neptuneCluster.attrEndpoint +
        ']" >> neptune-remote.yaml',
      'echo "port: ' + neptunePort + '" >> neptune-remote.yaml',
      'echo "connectionPool: { enableSsl: true, trustCertChainFile: "SFSRootCAG2.pem"}" >> neptune-remote.yaml',
      'echo "serializer: { className: org.apache.tinkerpop.gremlin.driver.ser.GryoMessageSerializerV3d0, config: { serializeResultToString: true }}" >> neptune-remote.yaml'
    ];
    neo4jEc2.addUserData(setupGremlin.join("\n"));

    const configureNeo4j = [
      "apoc.trigger.enabled=true",
      "kafka.acks=all",
      "kafka.security.protocol=SSL",
      "kafka.ssl.truststore.location=/tmp/kafka.client.truststore.jks",
      "streams.sink.enabled=false",
      "streams.source.topic.nodes." + nodeTopic + "=Person{*}",
      "streams.source.topic.relationships." + relsTopic + "=ACTED_IN{*}",
      "streams.source.enabled=true",
      "streams.source.schema.polling.interval=10000",
      "streams.procedures.enabled=true",
      "dbms.jvm.additional=-Djavax.net.debug=ssl:handshake"
    ];
    const echoAll =
      "echo '" + configureNeo4j.join("\n") + "'  >> /etc/default/neo4j";
    neo4jEc2.addUserData(echoAll);
    console.log(echoAll);

    const setupDev = [
      "yum install nodejs -y",
      "yum install git -y",
      "git clone https://github.com/sahays/streaming-neo4j-msk-neptune.git",
      "cd streaming-neo4j-msk-neptune/cdk-app",
      "npm install",
      "echo '" +
        JSON.stringify({
          mskCluster,
          neo4jConfig: "/etc/neo4j/neo4j.conf",
          region
        }) +
        "' >> msk-info.json",
      "node neo4j-config-msk.js",
      "cd /",
      "cd streaming-neo4j-msk-neptune/kafka-consumer-app",
      "npm install"
    ];
    neo4jEc2.addUserData(setupDev.join("\n"));

    //restart neo4j
    neo4jEc2.addUserData("systemctl restart neo4j\n");
  };

  const setBootstrapperScript = ({
    neo4jEc2,
    neptuneCluster,
    neo4jPwd,
    neptunePort,
    nodeTopic,
    relsTopic
  }) => {
    const bootstrap = [
      "sudo su #",
      "cd /",
      "yum update -y",
      "yum install nodejs -y",
      "yum install git -y",
      "echo '" +
        JSON.stringify({
          neptuneEndpoint: neptuneCluster.attrEndpoint,
          neo4jPwd,
          neptunePort,
          nodeTopic,
          relsTopic
        }) +
        "' >> stream-blog-data.json",
      "echo '" +
        JSON.stringify({
          repo: "https://github.com/sahays/streaming-neo4j-msk-neptune.git",
          trustStore: "/tmp/kafka.client.truststore.jks",
          gremlinPem: "https://www.amazontrust.com/repository/SFSRootCAG2.pem",
          gremlinConsole:
            "http://apache.mirrors.spacedump.net/tinkerpop/3.4.5/apache-tinkerpop-gremlin-console-3.4.5-bin.zip",
          apoc:
            "https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar",
          javaCaCerts:
            "/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.222.b10-0.amzn2.0.1.x86_64/jre/lib/security/cacerts"
        }) +
        "' >> stream-blog-uris.json",
      "git clone https://github.com/sahays/streaming-neo4j-msk-neptune.git"
    ];
    neo4jEc2.addUserData(bootstrap.join("\n"));
  };

  return { setStartupScript, setBootstrapperScript };
};

module.exports = { StartupScript };
