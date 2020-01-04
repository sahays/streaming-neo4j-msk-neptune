# go to kafka install dir then bin
./kafka-topics.sh --create \
--zookeeper z-3.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:2181,z-1.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:2181,z-2.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:2181 \
--replication-factor 2 \
--partitions 1 \
--topic Neo4jPersonTopic

./kafka-topics.sh --create \
--zookeeper z-3.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:2181,z-1.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:2181,z-2.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:2181 \
--replication-factor 2 \
--partitions 1 \
--topic Neo4jRelsTopic