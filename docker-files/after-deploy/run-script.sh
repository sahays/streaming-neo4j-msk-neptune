#!/bin/sh
{
    rm -rf /streaming-neo4j-msk-neptune/bootstrapper && \
    git clone https://github.com/sahays/streaming-neo4j-msk-neptune.git && \
    cd /streaming-neo4j-msk-neptune/bootstrapper && \
    npm install && \
    cd / && \
    node /streaming-neo4j-msk-neptune/bootstrapper/lib/direct/describe-stacks.js && \
    node /streaming-neo4j-msk-neptune/bootstrapper/lib/direct/export-msk-neptune-info.js
} 2>&1 | tee run-script.log