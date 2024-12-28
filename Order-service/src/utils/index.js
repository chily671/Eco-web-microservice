const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const {
  APP_SECRET,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
  ORDER_SERVICE,
} = require("../config");

//Utility function to hash password
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};

//Utility function to hash password
module.exports.HashPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

//Utility function to compare password
module.exports.ComparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

//Utility function to generate token
module.exports.GenerateToken = async (payload) => {
  return await jwt.sign(payload, "user");
};

//Utility function to verify token
module.exports.VerifyToken = async (token) => {
  return await jwt.verify(token, "user");
};

// FormateData function to format data
module.exports.FormatData = (data) => {
  if (data) {
    return JSON.parse(JSON.stringify(data));
  }
  return null;
};

//Message Broker
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    console.log("amqp Connected");
    const channel = await connection.createChannel();
    console.log("channel Created");
    await channel.assertQueue(EXCHANGE_NAME, { durable: true });
    return channel;
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err.message);
    // Cân nhắc hành động thay thế, ví dụ: sử dụng dịch vụ giả mạo hoặc tiếp tục mà không có RabbitMQ
    global.rabbitmqConnectionFailed = true; // Đánh dấu rằng kết nối RabbitMQ đã thất bại
    return null; // Hoặc trả về một đối tượng thay thế phù hợp
  }
};
//Utility function to publish message
module.exports.PublishToQueue = async (channel, queueName, data) => {
  try {
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

//Utility function to consume message
module.exports.ConsumeFromQueue = async (channel, queueName, callback) => {
  try {
    await channel.assertQueue(queueName, { durable: false });
    await channel.bindQueue(queueName, EXCHANGE_NAME, ORDER_SERVICE);
    await channel.consume(queueName, (message) => {
      callback(message);
      channel.ack(message);
    });
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports.SubscribeMessage = async (channel, service) => {
  try {
    if (rabbitmqConnectionFailed) {
      console.error(
        "RabbitMQ connection failed. Cannot subscribe to messages."
      );
      return;
    }

    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    console.log(`Waiting for messages in queue: ${q.queue}`);

    await channel.bindQueue(q.queue, EXCHANGE_NAME, USER_SERVICE);

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          console.log("The message is:", msg.content.toString());
          service.SubscribeEvents(msg.content.toString());
        }
        console.log("[X] received");
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("Failed to subscribe to messages:", error);
  }
};

//Utility function to close channel
module.exports.CloseChannel = async (channel) => {
  await channel.close();
};

//Utility function to close connection
module.exports.CloseConnection = async (connection) => {
  await connection.close();
};
