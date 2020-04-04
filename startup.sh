docker-compose -f 02-docker-compose.yml down && \
docker-compose -f 01-docker-compose.yml down && \
docker volume rm streaming-neo4j-msk-neptune_shared-folder && \
rm -rf neo4j && mkdir neo4j && mkdir neo4j/plugins && \
wget --directory-prefix ./neo4j/plugins/ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.5.0.8/apoc-3.5.0.8-all.jar && \
wget --directory-prefix ./neo4j/plugins/ https://github.com/neo4j-contrib/neo4j-streams/releases/download/3.5.4/neo4j-streams-3.5.4.jar && \
docker-compose -f 01-docker-compose.yml up --build --force-recreate --remove-orphans && \
export DOCKER_VOL_PATH=`docker volume inspect --format '{{ .Mountpoint }}' streaming-neo4j-msk-neptune_shared-folder` && \
cat $DOCKER_VOL_PATH/setup-env.sh > /etc/profile.d/setup-env.sh && \
source /etc/profile.d/setup-env.sh && \
docker-compose -f 02-docker-compose.yml up -d --build --force-recreate --remove-orphans && \
wget https://archive.apache.org/dist/kafka/2.2.1/kafka_2.12-2.2.1.tgz && \
tar -xzf kafka_2.12-2.2.1.tgz && \
kafka_2.12-2.2.1/bin/kafka-topics.sh --create --zookeeper $ZOOKEEPER_CONNECT --replication-factor 2 --partitions 1 --topic $KAFKA_TOPIC