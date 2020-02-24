FROM neo4j:4.0.0

# RUN wget --directory-prefix /var/lib/neo4j/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar
RUN wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar \
    && echo "apoc.export.file.enabled=true" >> ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "dbms.security.procedures.unrestricted=apoc.*" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "apoc.trigger.enabled=true" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "kafka.acks=all" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "kafka.security.protocol=SSL" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "kafka.ssl.truststore.location=/tmp/kafka.client.truststore.jks" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.sink.enabled=false" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.source.topic.nodes.PersonTopic=Person{*}" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.source.topic.relationships.RelsTopic=ACTED_IN{*}" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.source.enabled=true" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.source.schema.polling.interval=10000" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "streams.procedures.enabled=true" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && echo "dbms.jvm.additional=-Djavax.net.debug=ssl:handshake" >>  ${NEO4J_HOME}/conf/neo4j.conf \
    && neo4j-admin set-initial-password pass@word1 \
    && cp ${JAVA_HOME}/lib/security/cacerts /tmp/kafka.client.truststore.jks 

EXPOSE 7473 7474 7687

VOLUME [/data /logs]

WORKDIR /var/lib/neo4j

CMD ["neo4j"]