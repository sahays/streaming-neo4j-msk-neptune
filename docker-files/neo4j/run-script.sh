#!/bin/sh
{
    cp ${JAVA_HOME}/lib/security/cacerts /tmp/kafka.client.truststore.jks
    neo4j console
} 2>&1 | tee run-script.log