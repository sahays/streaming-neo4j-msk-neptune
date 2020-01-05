const { Kafka } = require("kafkajs");
const gremlin = require("gremlin");
const config = require("./config");

const makeG = () => {
  const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
  const Graph = gremlin.structure.Graph;

  dc = new DriverRemoteConnection(
    "wss://" + config.neptuneEndpoint + ":8182/gremlin",
    {}
  );

  const graph = new Graph();
  const g = graph.traversal().withRemote(dc);
  return g;
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
      // console.log(topic, partition, message);
      if (message && message.value) {
        const result = JSON.parse(message.value.toString());
        // console.log(result);

        if (result.meta && result.payload) {
          const payload = result.payload;
          if (payload && payload.type === "node") {
            console.log("processing node", payload);
            const id = payload.id;
            if (payload.before && payload.after) {
              // edited
              const edited = payload.after.properties;
              console.log("edited", id, payload.before, payload.after);
              g.V(id)
                .properties(edited)
                .next();
            } else if (payload.after) {
              // inserted
              console.log("inserted", id, payload.after);
              payload.after.labels.map(label => {
                const inserted = payload.after.properties;
                const v = g.V().addV(label);
                const keys = Object.keys(inserted);
                keys.map(key => {
                  const val = keys[key];
                  console.log(key, val);
                  v.property(key, val);
                });
                v.next();
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
