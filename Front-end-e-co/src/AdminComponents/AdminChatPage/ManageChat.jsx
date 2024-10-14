import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip, FaSmile, FaPaperPlane, FaUsers } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { useContext } from "react";
import { MessageContext } from "../../Context/MessageContext";

const ChatPage = () => {
  const {
    currentMessage,
    adminAddMessage,
    allUsers,
    currentUserId,
    setCurrentUserId,
  } = useContext(MessageContext);

  const [currenUsername, setCurrentUsername] = useState("");

  const handleConversationClick = (e) => {
    setCurrentUserId(e._id);
    setCurrentUsername(e.username);
  };

  useEffect(() => {
    console.log(currentMessage);
    console.log(currentUserId);
  }, []);

  function sendMessage(e) {
    if (currentUserId && e) {
      console.log(e);
      adminAddMessage(e, false, currentUserId);
    }
  }
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    console.log(currentMessage);
    console.log(currentUserId);
  }, []);
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (message) => {
    if (message) {
      sendMessage(message);
      setInputMessage("");
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    setIsTyping(true);
  };

  const handleEmojiClick = (emojiObject) => {
    setInputMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  const handleFileAttachment = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file attachment logic here
      console.log("File attached:", file.name);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio("/notification-sound.mp3");
    audio.play();
  };

  return (
    <div className="flex h-screen bg-gray-100 h-72">
      <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FaUsers className="mr-2" /> Online Users
        </h2>
        <ul>
          {allUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center mb-3"
              onClick={() => handleConversationClick(user)}
            >
              {/* <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full mr-2"
              /> */}
              <span>{user.username}</span>
              <BsCircleFill className="w-2 h-2 ml-auto text-green-500" />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4" ref={chatWindowRef}>
          {currentMessage.map((message) => (
            <div
              key={message.id}
              className={`flex items-start mb-4 ${
                message.userMessage == false ? "justify-end" : "justify-start"
              }`}
            >
              {/* {message.sender.id !== 0 && (
                <img
                  src={message.sender.avatar}
                  alt={message.sender.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )} */}
              <div
                className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                  message.userMessage == false
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                <p className="text-sm font-semibold mb-1">{message.username}</p>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timeStamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 border rounded-full py-2 px-4 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) =>
                e.key === "Enter" &&
                handleSendMessage(inputMessage) &&
                setInputMessage("")
              }
              aria-label="Type a message"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-gray-700 mr-2"
              aria-label="Add emoji"
            >
              <FaSmile className="w-6 h-6" />
            </button>
            <label htmlFor="file-input" className="cursor-pointer">
              <FaPaperclip className="w-6 h-6 text-gray-500 hover:text-gray-700" />
            </label>
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={handleFileAttachment}
              aria-label="Attach file"
            />
            <button
              onClick={(e) => handleSendMessage(inputMessage)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 ml-2"
              aria-label="Send message"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-16 right-4">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          {isTyping && (
            <p className="text-sm text-gray-500 mt-1">Someone is typing...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
