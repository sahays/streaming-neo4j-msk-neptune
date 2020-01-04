const { Kafka } = require("kafkajs");
const gremlin = require("gremlin");
const config = require("./config");

const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;

const g = traversal().withRemote(
  new DriverRemoteConnection("http://" + config.neptune + "/gremlin")
);

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
      const result = JSON.parse(message.value.toString());
      if (result.meta && result.payload) {
        const payload = result.payload;
        if (payload && payload.type === "node") {
          const id = payload.id;
          if (payload.before && payload.after) {
            // edited
          } else if (payload.after) {
            // inserted
            payload.after.labels.map(label => {
              const inserted = payload.after.properties;
              g.V()
                .addV(label)
                .properties(inserted)
                .next();
            });
          } else if (payload.before) {
            // deleted
          }
        } else if (payload && payload.type === "relationship") {
          const type = payload.label; // e.g. KNOWS or ACTED_IN
          const start = payload.start;
          const end = payload.end;
          if (payload.before && payload.after) {
            // edited
          } else if (payload.after) {
            // created
          } else if (payload.before) {
            // deleted
          }
        }
      }
    }
  });
};

run().catch(console.error);
