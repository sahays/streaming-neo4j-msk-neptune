const kafka = require("kafka-node");
const bp = require("body-parser");
const config = require("./config");

try {
  // const Consumer = kafka.HighLevelConsumer;
  const client = new kafka.KafkaClient(config.kafkaHost);
  const kafkaConsumer = kafka.Consumer;
  let consumer = new kafkaConsumer(
    client,
    [{ topic: config.topic, partition: 1 }],
    {
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: "utf8"
    }
  );
  consumer.on("message", async function(message) {
    console.log("here");
    console.log("kafka-> ", message.value);
  });
  consumer.on("error", function(err) {
    console.log("error", err);
  });
} catch (e) {
  console.log(e);
}
