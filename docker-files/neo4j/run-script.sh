#!/bin/bash
{
    echo "apoc.export.file.enabled=true" >> ${NEO4J_HOME}/conf/neo4j.conf 
    echo "dbms.security.procedures.unrestricted=apoc.*" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "apoc.trigger.enabled=true" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "kafka.acks=all" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "kafka.security.protocol=SSL" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "kafka.zookeeper.connect=${ZOOKEEPER_CONNECT}" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "kafka.bootstrap.servers=${BOOTSTRAP_SERVERS}" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "kafka.ssl.truststore.location=/tmp/kafka.client.truststore.jks" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "streams.sink.enabled=false" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "streams.source.topic.nodes.${NODE_TOPIC}=Person{*}" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "streams.source.topic.relationships.${RELS_TOPIC}=ACTED_IN{*}" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "streams.source.enabled=true" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "streams.source.schema.polling.interval=10000" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "streams.procedures.enabled=true" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    echo "dbms.jvm.additional=-Djavax.net.debug=ssl:handshake" >>  ${NEO4J_HOME}/conf/neo4j.conf 
    cp ${JAVA_HOME}/lib/security/cacerts /tmp/kafka.client.truststore.jks 
    neo4j restart
} 2>&1 | tee run-script.log