#!/bin/sh
{
    rm -rf streaming-neo4j-msk-neptune/
    git clone https://github.com/sahays/streaming-neo4j-msk-neptune.git 
    cd /streaming-neo4j-msk-neptune/msk-consumer-app
    npm install
    node index.js
} 2>&1 | tee run-script.log