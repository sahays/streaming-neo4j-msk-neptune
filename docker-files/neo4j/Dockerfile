FROM neo4j:3.5.6
ENV NEO4J_AUTH=none
RUN wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.5.0.8/apoc-3.5.0.8-all.jar && \
    wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-streams/releases/download/3.5.4/neo4j-streams-3.5.4.jar
RUN mkdir -p temp &&  cp ${JAVA_HOME}/lib/security/cacerts ./temp/kafka.client.truststore.jks