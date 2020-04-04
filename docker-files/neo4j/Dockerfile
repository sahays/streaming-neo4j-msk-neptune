FROM neo4j:4.0.0
ENV NEO4J_AUTH neo4j/pass@word1
RUN mkdir -p temp &&  cp ${JAVA_HOME}/lib/security/cacerts ./temp/kafka.client.truststore.jks