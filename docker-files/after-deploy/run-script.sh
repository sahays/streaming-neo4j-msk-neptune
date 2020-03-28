#!/bin/sh
{
    git clone https://github.com/sahays/streaming-neo4j-msk-neptune.git
    cd /streaming-neo4j-msk-neptune/bootstrapper
    npm install
    cd /streaming-neo4j-msk-neptune/bootstrapper/lib/direct/
    node describe-stacks.js && node after-deploy.js
} 2>&1 | tee run-script.log