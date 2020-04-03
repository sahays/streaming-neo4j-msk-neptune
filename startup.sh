#!/bin/bash
{
    docker-compose -f 01-docker-compose.yml down
    docker-compose -f 02-docker-compose.yml down
    docker-compose -f 01-docker-compose.yml up
    export DOCKER_VOL_PATH=`docker volume inspect --format '{{ .Mountpoint }}' streaming-neo4j-msk-neptune_shared-folder`
    . /$DOCKER_VOL_PATH/setup-env.sh
    docker-compose -f 02-docker-compose.yml up
} 2>&1 | tee startup.log