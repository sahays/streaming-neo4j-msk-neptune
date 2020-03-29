#!/bin/sh
{
    sed -i "s/REPLACE_ZOOKEEPER_CONNECT/${ZOOKEEPER_CONNECT}/g" ${NEO4J_HOME}/conf/neo4j.conf
    sed -i "s/REPLACE_BOOTSTRAP_SERVERS/${BOOTSTRAP_SERVERS}/g" ${NEO4J_HOME}/conf/neo4j.conf
} 2>&1 | tee update-conf.log