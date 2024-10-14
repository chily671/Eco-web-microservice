const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  messages: [
    {
      content: String,
      timeStamp: Date,
      userMessage: Boolean,
    },
  ],
});

const ChatModel = mongoose.model("message", chatSchema);
module.exports = ChatModel;
