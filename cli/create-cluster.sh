
aws kafka create-cluster \
--cluster-name "Neo4j-Kafka" \
--broker-node-group-info file://brokernodegroupinfo.json \
--kafka-version "2.2.1" \
--number-of-broker-nodes 2 \
--enhanced-monitoring PER_TOPIC_PER_BROKER \
--region us-west-2

