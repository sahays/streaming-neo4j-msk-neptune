const { Kafka } = require("kafkajs");
const config = require("./config");

const brokers = config.brokers.split(",");
console.log("connecting to", brokers);

const kafka = new Kafka({
  clientId: "kafka-consumer-app",
  ssl: true,
  brokers: brokers
});

const consumer = kafka.consumer({ groupId: "neo4j" });

const run = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: config.topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString()
      });
    }
  });
};

run().catch(console.error);
