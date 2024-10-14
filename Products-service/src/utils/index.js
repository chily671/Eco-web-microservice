const amqplib = require("amqplib");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();
const { MSG_QUEUE_URL, EXCHANGE_NAME, APP_SECRET } = require("../config");

// Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], "user");
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

module.exports.PublishUserEvent = async (payload) => {
  axios.post("http://localhost:5001/app-events", { payload });
};

module.exports.PublishOrderEvent = async (payload) => {
  axios.post("http://localhost:5002/app-events", { payload });
};

// Message Broker
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

module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};
