import React, { useState, useEffect, useRef } from "react";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { MessageContext } from "../../Context/MessageContext";

const ChatPopup = () => {
  const { addMessage, allMessages } = useContext(MessageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  function sendMessage(e) {
    // Check for login
    if (!localStorage.getItem("auth-token")) {
      alert("You need to login to chat");
      window.location.href = "/login";
      return;
    }
    console.log(e);
    addMessage(e, true, localStorage.getItem("auth-token"));
    setInputMessage("");
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChat}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Open chat"
      >
        <FiMessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
              <h2 className="text-lg font-semibold">Chat with admin</h2>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close chat"
              >
                <FiX size={24} />
              </button>
            </div>

            <div
              ref={chatContainerRef}
              className="h-64 overflow-y-auto p-4 space-y-4"
            >
              {allMessages.map((e, index) => (
                <div
                  key={index}
                  className={`flex ${
                    e.userMessage == true ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      e.userMessage == true
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm font-semibold">{e.sender}</p>
                    <p>{e.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{e.timestamp}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                    <p className="text-sm">you is typing...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyPress={(e) =>
                    e.key === "Enter" && sendMessage(inputMessage)
                  }
                />
                <button
                  onClick={(e) => sendMessage(inputMessage)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Send message"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPopup;
