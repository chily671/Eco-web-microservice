const ChatService = require("../services/chat-service");
const jwt = require("jsonwebtoken");

module.exports = async (app, channel) => {
  const service = new ChatService();

  const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");

    // Kiểm tra nếu không có token trong header
    if (!token) {
      return res.status(401).send({
        errors: "Please authenticate using a valid token",
      });
    }

    try {
      let data;

      // Thử xác thực với secret key dành cho admin
      try {
        data = jwt.verify(token, "admin"); // Thay bằng secret key cho admin
        console.log("Admin authenticated:", data);
        req.user = data.user; // Gán thông tin admin cho req
        req.role = "admin"; // Gán vai trò admin
      } catch (err) {
        // Nếu xác thực với admin thất bại, thử với user
        data = jwt.verify(token, "user"); // Thay bằng secret key cho user
        console.log("User authenticated:", data);
        req.user = data.user; // Gán thông tin user cho req
        req.role = "user"; // Gán vai trò user
      }

      // Tiếp tục đến middleware tiếp theo
      next();
    } catch (error) {
      // Nếu cả hai xác thực đều thất bại
      console.error("Authentication error:", error);
      res.status(401).send({
        errors:
          "Invalid or expired token. Please authenticate using a valid token",
      });
    }
  };

  const fetchAdmin = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
      res.send({
        isAdmin: false,
        errors: "Please authenticate using a valid token",
      });
    } else
      try {
        const data = jwt.verify(token, "admin");
        req.user = data.user;
        next();
      } catch (error) {
        res.send({
          isAdmin: false,
          errors: "This is not an admin account",
        });
      }
  };

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from Chat-Service" });
  });

  app.get("/isadmin", fetchAdmin, async (req, res) => {
    res.json({ isAdmin: true });
  });
  // Creating enpoint for getting chat messages
  app.get("/getmessages", fetchUser, async (req, res) => {
    try {
      const userid = req.user.id;
      console.log(userid, "in getmessages");
      let message = await service.userGetMessages(userid);
      if (!message) {
        return res.status(404).json({ message: "No messages found" });
      }
      console.log("user get ingetmessage: ", message);

      res.json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Creating endpoint for sending chat messages
  app.post("/sendmessage", async (req, res) => {
    const message = req.body.messages;
    console.log(message + "in sendmessage");
    let chat = await service.userSendMessages(
      { user_id: req.user.id },
      message
    );
    res.json({ message: "Message sent" });
  });

  // Creating endpoint for getting chat messages for admin
  app.get("/getadminmessages", fetchAdmin, async (req, res) => {
    let messages = await service.getmessage();
    res.json(messages);
  });

  // Creating endpoint for getting admin
  app.get("/admin", fetchUser, async (req, res) => {
    let getAdmin = await service.getAdmin();
  });
};
