FROM neo4j:4.0.0

ENV NEO4J_AUTH=neo4j/pass@word1
ENV NODE_TOPIC="node_topic"
ENV RELS_TOPIC="rels_topic"
ENV ZOOKEEPER_CONNECT="REPLACE_ZOOKEEPER_CONNECT"
ENV BOOTSTRAP_SERVERS="REPLACE_BOOTSTRAP_SERVERS"

RUN wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar 

RUN echo "apoc.export.file.enabled=true" >> ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "dbms.security.procedures.unrestricted=apoc.*" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "apoc.trigger.enabled=true" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "kafka.acks=all" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "kafka.security.protocol=SSL" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "kafka.zookeeper.connect=`${ZOOKEEPER_CONNECT}`" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "kafka.bootstrap.servers=`${BOOTSTRAP_SERVERS}`" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "kafka.ssl.truststore.location=/tmp/kafka.client.truststore.jks" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.sink.enabled=false" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.source.topic.nodes.`${NODE_TOPIC}`=Person{*}" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.source.topic.relationships.`${RELS_TOPIC}`=ACTED_IN{*}" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.source.enabled=true" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.source.schema.polling.interval=10000" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.procedures.enabled=true" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "dbms.jvm.additional=-Djavax.net.debug=ssl:handshake" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && cp ${JAVA_HOME}/lib/security/cacerts /tmp/kafka.client.truststore.jks 

COPY update-conf.sh ${NEO4J_HOME}/
RUN chmod +x ${NEO4J_HOME}/update-conf.sh

EXPOSE 7473 7474 7687