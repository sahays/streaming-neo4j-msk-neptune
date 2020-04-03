FROM neo4j:4.0.0

RUN cp ${JAVA_HOME}/lib/security/cacerts /tmp/kafka.client.truststore.jks
RUN wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar 
RUN wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-streams/releases/download/4.0.0/neo4j-streams-4.0.0.jar