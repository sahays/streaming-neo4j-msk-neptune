#!/bin/sh
{
    mkdir -p temp
    cp ${JAVA_HOME}/lib/security/cacerts ./temp/kafka.client.truststore.jks
    neo4j console
} 2>&1 | tee run-script.log