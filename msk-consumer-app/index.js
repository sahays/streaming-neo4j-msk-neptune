const { Kafka } = require("kafkajs");
const gremlin = require("gremlin");

const config = {
  neptuneEndpoint: process.env.NEPTUNE_HOST,
  clientId: "msk-consumer-app",
  ssl: true,
  kafkaBrokers: (process.env.ZOOKEEPER_CONNECT || ",").split(","),
  groupId: "neo4j"
};

const makeG = () => {
  const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
  const Graph = gremlin.structure.Graph;

  dc = new DriverRemoteConnection(
    "wss://" + config.neptuneEndpoint + ":8182/gremlin"
  );

  const graph = new Graph();
  const g = graph.traversal().withRemote(dc);
  return g;
};

const kafka = new Kafka({
  clientId: config.clientId,
  ssl: config.ssl,
  brokers: config.kafkaBrokers
});

const consumer = kafka.consumer({ groupId: config.groupId });

console.log(config);

const run = async () => {
  // Consuming
  await consumer.connect();

  config.kafkaTopics.map(async (topic) => {
    await consumer.subscribe({ topic: topic, fromBeginning: true });
  });

  const g = makeG();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message && message.value) {
        const result = JSON.parse(message.value.toString());
        if (result.meta && result.payload) {
          const payload = result.payload;
          const {
            t: { id }
          } = gremlin.process;
          if (payload && payload.type === "node") {
            console.log("processing node", payload);
            const payloadId = payload.id;
            if (payload.before && payload.after) {
              // edited
              const edited = payload.after.properties;
              console.log("edited", payloadId, payload.before, payload.after);
              g.V(payloadId)
                .properties(edited)
                .next();
            } else if (payload.after) {
              // inserted
              console.log("inserted", payloadId, payload.after);
              payload.after.labels.map(async (label) => {
                const inserted = payload.after.properties;
                console.log(label);
                const v = g.addV(label);
                const keys = Object.keys(inserted);
                keys.map((key) => {
                  const val = inserted[key];
                  v.property(key, val);
                });
                v.property(id, payloadId);
                await v.next();
              });
            } else if (payload.before) {
              // deleted
              console.log("deleted", payloadId, payload.before);
              g.V(payloadId).drop();
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
