module.exports = {
  topics: ["Neo4jPersonTopic", "Neo4jRelsTopic"],
  clientId: "kafka-consumer-app",
  ssl: true,
  groupId: "neo4j",
  kafkaBrokers: [
    "b-1.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:9094",
    "b-2.neo4j-kafka.wqfvy4.c3.kafka.us-west-2.amazonaws.com:9094"
  ],
  neptuneEndpoint:
    "neptunedbcluster.cluster-cwtrcbvtfrn8.us-west-2.neptune.amazonaws.com"
};
