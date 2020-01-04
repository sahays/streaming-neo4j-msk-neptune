bin/kafka-console-consumer.sh \
--bootstrap-server b-1.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:9094,b-2.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:9094 \
--consumer.config client.properties \
--topic Neo4jPersonTopic \
--from-beginning