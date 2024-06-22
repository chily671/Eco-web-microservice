const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const amqplib = require('amqplib');

const {
    APP_SECRET,
    EXCHANGE_NAME,
    MSG_QUEUE_URL,
    ORDER_SERVICE
} = require('../config');

//Utility function to hash password
module.exports.GenerateSalt = async() => {
    return await bcrypt.genSalt(10);
}

//Utility function to hash password
module.exports.HashPassword = async(password, salt) => {
    return await bcrypt.hash(password, salt);
}

//Utility function to compare password
module.exports.ComparePassword = async(password, hash) => {
    return await bcrypt.compare(password, hash);
}

//Utility function to generate token
module.exports.GenerateToken = async(payload) => {
    return await jwt.sign(payload, APP_SECRET);
}

//Utility function to verify token
module.exports.VerifyToken = async(token) => {
    return await jwt.verify(token, APP_SECRET);
}

// FormateData function to format data
module.exports.FormatData = (data) => {
    if (data) {
        return JSON.parse(JSON.stringify(data));
    }
    return null;
}

//Utility function to create channel
module.exports.CreateChannel = async() => {
    try {
        const connection = await amqplib.connect(MSG_QUEUE_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
        return channel;
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

//Utility function to publish message
module.exports.PublishToQueue = async(channel, queueName, data) => {
    try {
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

//Utility function to consume message
module.exports.ConsumeFromQueue = async(channel, queueName, callback) => {
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
}

//Utility function to close channel
module.exports.CloseChannel = async(channel) => {
    await channel.close();
}

//Utility function to close connection
module.exports.CloseConnection = async(connection) => {
    await connection.close();
};
