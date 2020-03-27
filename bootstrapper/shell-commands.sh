## setting up the instance
yum update -y
rpm --import https://debian.neo4j.com/neotechnology.gpg.key
echo "[neo4j]" >> /etc/yum.repos.d/neo4j.repo
echo "name=Neo4j RPM Repository" >> /etc/yum.repos.d/neo4j.repo
echo "baseurl=https://yum.neo4j.com/stable" >> /etc/yum.repos.d/neo4j.repo
echo "enabled=1" >> /etc/yum.repos.d/neo4j.repo
echo "gpgcheck=1" >> /etc/yum.repos.d/neo4j.repo

## enable java-openjdk11
amazon-linux-extras enable java-openjdk11

## install neo4j
yum install neo4j-4.0.0 -y
systemctl enable neo4j
systemctl stop neo4j

## configure neo4j
echo "apoc.export.file.enabled=true" >> /etc/neo4j/neo4j.conf
echo "dbms.security.procedures.unrestricted=apoc.*" >> /etc/neo4j/neo4j.conf
echo "NEO4J_ULIMIT_NOFILE=60000" >> /etc/default/neo4j

## set neo4j password
neo4j-admin set-initial-password  $$neo4jPwd

## install poc plugin
wget --directory-prefix /var/lib/neo4j/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar
systemctl start neo4j

## copy ca cert
cp /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.222.b10-0.amzn2.0.1.x86_64/jre/lib/security/cacerts /tmp/kafka.client.truststore.jks

## installing gremlin
cd /
yum install unzip
wget http://apache.mirrors.spacedump.net/tinkerpop/3.4.5/apache-tinkerpop-gremlin-console-3.4.5-bin.zip
unzip apache-tinkerpop-gremlin-console-3.4.5-bin.zip
cd apache-tinkerpop-gremlin-console-3.4.5/
wget https://www.amazontrust.com/repository/SFSRootCAG2.pem

## configuring gremlin for neptune
cd conf/
touch neptune-remote.yaml
echo "hosts:$$neptuneEndpoint" >> neptune-remote.yaml
echo "port:$$neptunePort" +  >> neptune-remote.yaml
echo "connectionPool: { enableSsl: true trustCertChainFile: SFSRootCAG2.pem}" >> neptune-remote.yaml
echo "serializer: { className: org.apache.tinkerpop.gremlin.driver.ser.GryoMessageSerializerV3d0 config: { serializeResultToString: true }}" >> neptune-remote.yaml

## configure neo4j for kafka
echo "apoc.trigger.enabled=true" >> /etc/default/neo4j
echo "kafka.acks=all" >> /etc/default/neo4j
echo "kafka.security.protocol=SSL" >> /etc/default/neo4j
echo "kafka.ssl.truststore.location=/tmp/kafka.client.truststore.jks" >> /etc/default/neo4j
echo "streams.sink.enabled=false" >> /etc/default/neo4j
echo "streams.source.topic.nodes. + nodeTopic + =Person{*}" >> /etc/default/neo4j
echo "streams.source.topic.relationships. + relsTopic + =ACTED_IN{*}" >> /etc/default/neo4j
echo "streams.source.enabled=true" >> /etc/default/neo4j
echo "streams.source.schema.polling.interval=10000" >> /etc/default/neo4j
echo "streams.procedures.enabled=true" >> /etc/default/neo4j
echo "dbms.jvm.additional=-Djavax.net.debug=ssl:handshake" >> /etc/default/neo4j

## restarting neo4j
systemctl restart neo4j

## setup kafka-consumer-app
cd /streaming-neo4j-msk-neptune/kafka-consumer-app/
npm install