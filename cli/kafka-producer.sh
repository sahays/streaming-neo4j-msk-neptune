 bin/kafka-console-producer.sh \
 --broker-list b-1.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:9094,b-2.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:9094 \
 --producer.config client.properties \
 --topic Neo4jPersonTopic