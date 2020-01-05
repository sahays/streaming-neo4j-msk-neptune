const { Kafka } = require("kafkajs");
const gremlin = require("gremlin");
const config = require("./config");

const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;

const makeG = () => {
  return traversal().withRemote(
    new DriverRemoteConnection("http://" + config.neptuneEndpoint + "/gremlin")
  );
};

const brokers = config.brokers;

const kafka = new Kafka({
  clientId: config.clientId,
  ssl: config.ssl,
  brokers: brokers
});

const consumer = kafka.consumer({ groupId: config.groupId });

console.log(config);

const run = async () => {
  // Consuming
  await consumer.connect();

  config.topics.map(async topic => {
    await consumer.subscribe({ topic: topic, fromBeginning: true });
  });

  const g = makeG();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message && message.value) {
        console.log(topic, partition);
        const result = JSON.parse(message.value.toString());
        console.log(result);

        if (result.meta && result.payload) {
          const payload = result.payload;
          if (payload && payload.type === "node") {
            console.log("processing node", payload);
            const id = payload.id;
            if (payload.before && payload.after) {
              // edited
              console.log("edited", id, payload.before, payload.after);
              g.V(id)
                .properties(payload.after)
                .next();
            } else if (payload.after) {
              // inserted
              console.log("inserted", id, payload.after);
              payload.after.labels.map(label => {
                const inserted = payload.after.properties;
                g.V()
                  .addV(label)
                  .properties(inserted)
                  .next();
              });
            } else if (payload.before) {
              // deleted
              console.log("deleted", id, payload.before);
              g.V(id).drop();
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
    }
  });
};

try {
  run().catch(console.error);
} catch (e) {
  console.log(e);
}
