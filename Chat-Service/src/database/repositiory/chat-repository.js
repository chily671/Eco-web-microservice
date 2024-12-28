const mongoose = require("mongoose");
const ChatModel = require("../models/chat");

class ChatRepository {
  async GetAllMessage() {
    try {
      const messages = await ChatModel.find({});
      console.log(messages);
      return messages;
    } catch (error) {
      return error;
    }
  }

  async createMessage(message) {
    try {
      let checkchat = await ChatModel.findOne({ user_id: message.user_id });
      //   checkchat = checkchat[0];
      if (!checkchat) {
        checkchat = new ChatModel({
          user_id: req.user.id,
          messages: [],
          timeStamp: new Date(),
        });
      }
      console.log("checkchat:", message.message);
      checkchat.messages.push(message.message);
      await checkchat.save();
      return checkchat;
    } catch (error) {
      return error;
    }
  }

  async updateMessage(condition, update) {
    try {
      const response = await ChatModel.findOne(condition);
      if (!response) {
        return "No user found";
      }
      console.log("update value:", update);
      response.messages.push(update.messages);
      await response.save();
      return response;
    } catch (error) {
      return error;
    }
  }

  async findUserMessages(userId) {
    try {
      let messages = await ChatModel.findOne({ user_id: userId });
      if (!messages) {
        messages = new ChatModel({
          user_id: userId,
          messages: [],
          timeStamp: new Date(),
        });
      }
      await messages.save();
      return messages.messages;
    } catch (error) {
      return error;
    }
  }

  async createMessage(message) {
    try {
      const newMessage = new ChatModel({
        message,
        timeStamp: new Date(),
      });
      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (error) {
      return error;
    }
  }

  async findAdmin() {
    try {
      const admin = await ChatModel.find({ email: { $ne: "admin" } });
      return admin;
    } catch (error) {
      return error;
    }
  }
}

module.exports = ChatRepository;
