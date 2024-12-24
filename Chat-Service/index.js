const express = require("express");
const http = require("http");
const Server = require("socket.io").Server;
const { databaseConnection } = require("./src/database/connection");
const Chat = require("./src/database/models/chat");
const { chat } = require("./src/api");
const httpProxy = require("http-proxy");
const jwt = require("jsonwebtoken");
const { timeStamp } = require("console");
const ChatService = require("./src/services/chat-service");
const { USER_SERVICE_URL, RS_SERVICE_URL, SEARCH_SERVICE_URL } = require("../config");
const app = express();
chat(app);
app.use(express.json());
databaseConnection();
const service = new ChatService();

const server = http.createServer(app);
// const io = require('socket.io')(server, {
//   path: '/socket-chat', // Định nghĩa một path riêng cho Socket.IO
// });
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket-chat",
});

// io.on("connection", (socket) => {
//   console.log("User Connected");

//   const loadMessages = async () => {
//     try {
//       const messages = await Chat.find().sort({ timeStamp: 1 }).exec();
//       socket.emit("loadMessages", messages);
//     } catch (error) {
//       console.log(error);
//     }
//   };

io.on("connection", async (socket) => {
  console.log("Socket.id: " + socket.id);
  const token = socket.handshake.auth.token;
  // console.log("Token in connection: ", token);
  try {
    const decoded = await fetch(`${USER_SERVICE_URL}/decodetoken`, {
      method: "POST",
      headers: {
        "auth-token": token,
      },
    }).then((response) => response.json());
    console.log("User ID: ", decoded);
    socket.join(decoded);
    console.log("User connected to user: ", decoded);
    // Get all users from database and join their rooms by their id
    const users = await fetch(`${USER_SERVICE_URL}/allusers`, {
      method: "GET",
      headers: {
        "auth-token": token,
      },
    }).then((response) => response.json());
    console.log("Users: ", users);

    // get _id from all users

    users.forEach((user) => {
      console.log("User._id: ", user._id);
      socket.join(user._id);
      console.log("Admin connected to user: ", user._id);
    });
  } catch (error) {
    console.error("Error Admin connecting to the server:", error);
  }

  // Hello from the server
  socket.emit("message", "Hello from the server");

  socket.on("message", (data) => {
    console.log(data);
  });

  // Admin add message with user id
  socket.on("adminAddMessage", async (data, callback) => {
    try {
      console.log("data in adminaddmessgae:", data);
      let updatemessage = await service.updatemessage(
        { user_id: data.user_id }, // Điều kiện tìm kiếm
        {
          messages: {
            content: data.content,
            timeStamp: Date.now(),
            userMessage: data.userMessage,
          },
        }
      );
      // await Message.updateOne(
      //   { user_id: data.user_id }, // Điều kiện tìm kiếm
      //   {
      //     $push: {
      //       messages: {
      //         content: data.content,
      //         timeStamp: Date.now(),
      //         userMessage: data.userMessage,
      //       },
      //     },
      //   }
      // );
      io.emit("getMessage");
      io.emit("adminGetMessage");
      callback("Message sent");
      console.log("Đã thêm tin nhắn admin thành công!");
    } catch (error) {
      console.error("Lỗi khi admin thêm tin nhắn:", error);
    }
  });

  // Add Message Event
  socket.on("addMessage", async (data, callback) => {
    // Add message to database
    try {
      // Giai mã token
      console.log("User ID - token in addmessage: ", data.user_id);
      let token = data.user_id;
      const userid = await fetch(`${USER_SERVICE_URL}/decodetoken`, {
        method: "POST",
        headers: {
          "auth-token": token,
        },
      }).then((response) => response.json());
      console.log("User ID in addmessage: ", userid.user.id);
      //  let message = await Message.findOne({ user_id: decoded.user.id });
      let updatemessage = await service.updatemessage(
        { user_id: userid.user.id }, // Điều kiện tìm kiếm
        {
          messages: {
            content: data.content,
            timeStamp: Date.now(),
            userMessage: data.userMessage,
          },
        }
      );

      console.log("Đã thêm tin nhắn thành công!");
      callback("Message sent");
      io.emit("adminGetMessage");
      io.emit("getMessage");
    } catch (error) {
      console.error("Lỗi khi thêm tin nhắn:", error);
    }
  });
});

server.listen(5008, () => {
  console.log("Chat Service is Listening to Port 5008");
});
