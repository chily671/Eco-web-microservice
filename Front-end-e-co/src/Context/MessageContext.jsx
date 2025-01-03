import React, { createContext, useState, useRef, useContext } from "react";
import { useEffect } from "react";
import io from "socket.io-client";
import dotenv from "dotenv";
import { AuthenticationContext } from "./AuthenticationContext";

export const MessageContext = createContext(null);

const MessageContextProvider = (props) => {
  const { isAdmin, isLoggedIn, authToken } = useContext(AuthenticationContext);

  const [socket, setNewSocket] = useState(null);

  const [allMessages, setAllMessages] = useState({});

  const [adminAllMessages, setAdminAllMessages] = useState([]);

  const [allUsers, setAllUsers] = useState([]);

  const [currentMessage, setCurrentMessage] = useState([]);

  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.CHAT_SERVICE_URL, {
      path: "/socket-chat", // Phải khớp với đường dẫn proxy tại Gateway
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("auth-token"),
      },
    });

    setNewSocket(newSocket);

    return () => {
      // Ngắt kết nối khi component unmount
      if (socket) {
        console.log("Disconnect from server");
        socket.disconnect();
      }
    };
  }, [authToken]);

  useEffect(() => {
    if (socket === null) return;

    console.log("test context");

    async function getMessage() {
      await fetch("/chat/getmessages", {
        method: "GET",
        headers: {
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setAllMessages(data));
      console.log("All Messages: ", allMessages);
    }

    async function getAdminMessages() {
      await fetch("/chat/getadminmessages", {
        method: "GET",
        headers: {
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setAdminAllMessages(data));
    }

    async function getAllUsers() {
      try {
        await fetch("/user/allusers", {
          method: "GET",
          headers: {
            "auth-token": `${localStorage.getItem("auth-token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setAllUsers(data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    console.log("test context 2");

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.on("userTyping", (data) => {
        // Phát sự kiện "userTyping" tới admin
        io.emit("adminUserTyping", { user_id: data.user_id });
      } );
      // Lắng nghe tin nhắn từ server
      socket.on("message", (data) => {
        console.log(data);
      });

      // Gửi tin nhắn đến server
      socket.emit("message", "Hello from the client!");
    });

    if (!isAdmin && authToken) {
      getMessage();
      console.log("isAdmin: ", isAdmin);
      // Kết nối đến WebSocket server
      socket.on("getMessage", () => {
        getMessage();
        console.log("Get Message");
      });
    }
    // Get all messages from database

    if (isAdmin && authToken) {
      console.log("isAdmin: ", isAdmin);
      getAllUsers();
      getAdminMessages();
      socket.on("adminGetMessage", () => {
        getAdminMessages();
        console.log("Admin Get Message");
      });
    }
  }, [socket, authToken, isAdmin]);

  const addMessage = (message, myMessage, mytoken) => {
    console.log(message);
    // Add message to database
    if (localStorage.getItem("auth-token")) {
      socket.emit(
        "addMessage",
        {
          content: message,
          userMessage: myMessage,
          user_id: mytoken,
        },
        (data) => {
          console.log(data);
        }
      );
    }
  };

  useEffect(() => {
    if (currentUserId) {
      setCurrentMessage(
        adminAllMessages.filter((e) => e.user_id === currentUserId)[0].messages
      );
    }
    console.log("currentMessage: ", currentMessage);
  }, [currentUserId, adminAllMessages]);

  const adminAddMessage = (message, myMessage, currentUserId) => {
    console.log(message);
    // Add message to database
    if (localStorage.getItem("auth-token")) {
      socket.emit(
        "adminAddMessage",
        { content: message, userMessage: myMessage, user_id: currentUserId },
        (data) => {
          console.log(data);
        }
      );
    }
  };
  const contextValue = {
    allMessages,
    addMessage,
    setCurrentUserId,
    allUsers,
    currentUserId,
    currentMessage,
    adminAddMessage,
  };
  return (
    <MessageContext.Provider value={contextValue}>
      {props.children}
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;
