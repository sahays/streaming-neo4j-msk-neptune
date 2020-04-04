docker-compose -f 02-docker-compose.yml down && \
docker-compose -f 01-docker-compose.yml down && \
wget --directory-prefix ./neo4j/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.2/apoc-4.0.0.2-all.jar && \
wget --directory-prefix ./neo4j/plugins/ https://github.com/neo4j-contrib/neo4j-streams/releases/download/4.0.0/neo4j-streams-4.0.0.jar && \
docker-compose -f 01-docker-compose.yml up --build --force-recreate --remove-orphans && \
export DOCKER_VOL_PATH=`docker volume inspect --format '{{ .Mountpoint }}' streaming-neo4j-msk-neptune_shared-folder` && \
cat $DOCKER_VOL_PATH/setup-env.sh > /etc/profile.d/setup-env.sh
source /etc/profile.d/setup-env.sh
docker-compose -f 02-docker-compose.yml up -d --build --force-recreate --remove-orphans
