# set region
yum install -y jq && \
export AWS_REGION=`curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq .region -r` && \
# tear down if setup already
docker-compose -f 02-docker-compose.yml down && \
docker-compose -f 01-docker-compose.yml down && \
docker volume rm -f streaming-neo4j-msk-neptune_shared-folder && \
# export neptune and msk endpoints
docker-compose -f 01-docker-compose.yml up --build --force-recreate --remove-orphans && \
export DOCKER_VOL_PATH=`docker volume inspect --format '{{ .Mountpoint }}' streaming-neo4j-msk-neptune_shared-folder` && \
# persist exports
cat $DOCKER_VOL_PATH/setup-env.sh > /etc/profile.d/setup-env.sh && \
source /etc/profile.d/setup-env.sh && \
# setup neo4j and consumer app
docker-compose -f 02-docker-compose.yml up -d --build --force-recreate --remove-orphans && \
# create new topic in msk
wget https://archive.apache.org/dist/kafka/2.2.1/kafka_2.12-2.2.1.tgz && \
tar -xzf kafka_2.12-2.2.1.tgz && \
kafka_2.12-2.2.1/bin/kafka-topics.sh --create --zookeeper $ZOOKEEPER_CONNECT --replication-factor 2 --partitions 1 --topic $KAFKA_TOPIC