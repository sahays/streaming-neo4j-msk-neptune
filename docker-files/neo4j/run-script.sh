#!/bin/sh
{
    mkdir -p temp
    wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar 
    wget --directory-prefix ${NEO4J_HOME}/plugins/ https://github.com/neo4j-contrib/neo4j-streams/releases/download/4.0.0/neo4j-streams-4.0.0.jar
    cp ${JAVA_HOME}/lib/security/cacerts ${NEO4J_HOME}/temp/kafka.client.truststore.jks
    neo4j-admin set-initial-password "${NEO4J_PWD}"
    neo4j console
} 2>&1 | tee run-script.log