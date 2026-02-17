import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "rules-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

export const sendMessage = async (labelData: any) => {
  try {
    await producer.connect();
    console.log("Producer connected");
    await producer.send({
      topic: "rule-topic",
      messages: [{ value: JSON.stringify(labelData) }],
    });
    console.log("Message sent successfully");
  } catch (err) {
    console.error("Error sending message:", err);
  } finally {
    await producer.disconnect();
  }
};
