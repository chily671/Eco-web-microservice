const amqplib = require("amqplib");
const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL || "amqp://localhost";
const EXCHANGE_NAME = process.env.EXCHANGE_NAME || "events";
//Message Broker
module.exports.CreateChannel = async () => {
    try {
      const connection = await amqplib.connect(MSG_QUEUE_URL);
      console.log('amqp Connected');
      const channel = await connection.createChannel();
      console.log('Created Channel');
      await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
      return channel;
    } catch (err) {
      throw err;
    }
  };
  
  module.exports.PublishMessage = (channel, service, msg) => {
    channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent: ", msg);
  };
  
  module.exports.SubscribeMessage = async (channel, service) => {
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    console.log(` Waiting for messages in queue: ${q.queue}`);
  
    channel.bindQueue(q.queue, EXCHANGE_NAME, CUSTOMER_SERVICE);
  
    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          console.log("the message is:", msg.content.toString());
          service.SubscribeEvents(msg.content.toString());
        }
        console.log("[X] received");
      },
      {
        noAck: true,
      }
    );
  };