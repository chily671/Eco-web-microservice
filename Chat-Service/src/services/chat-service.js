const { ChatRepository } = require("../database");

class ChatService {
  constructor() {
    this.repository = new ChatRepository();
  }

  async sendMessage(message) {
    const response = await this.repository.createMessage(message);
    console.log("Message Sent");
    return response;
  }
  async getmessage() {
    const messages = await this.repository.GetAllMessage();
    console.log("All messages fetched");
    return messages;
  }

  async userGetMessages(userId) {
    const messages = await this.repository.findUserMessages(userId);
    console.log("User messages fetched");
    return messages;
  }

  async updatemessage(condition, update) {
    const response = await this.repository.updateMessage(condition, update);
    console.log("Message Updated");
    return response;
  }

  async userSendMessages(message) {
    const response = await this.repository.createMessage(message);
    console.log("Message Sent");
    return response;
  }

  async getAdmin() {
    const response = await this.repository.findAdmin();
    console.log("Admin fetched");
    return response;
  }
}

module.exports = ChatService;
