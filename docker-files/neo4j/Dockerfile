FROM neo4j:3.5
ENV NEO4J_AUTH=none
RUN mkdir -p temp &&  cp ${JAVA_HOME}/lib/security/cacerts ./temp/kafka.client.truststore.jks