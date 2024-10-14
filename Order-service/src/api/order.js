const OrderService = require("../services/order-service");
const { PublishCustomerEvent, SubscribeMessage } = require("../utils");
const { USER_SERVICE } = require("../config");
const { PublishMessage } = require("../utils");
const { application } = require("express");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../config");
const uuid = require("uuid");

function generateID() {
  return uuid.v4();
}

module.exports = (app, channel) => {
  const service = new OrderService();

  // Subscribe to the channel
  SubscribeMessage(channel, service);

  // Creating middleware for user authentication
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

  // Creating Creat Order Endpoint
  app.post("/order", fetchUser, async (req, res) => {
    try {
      // const response = await fetch ('http://localhost:5001/user',
      //     {
      //         method: 'POST',
      //         headers: {
      //             'auth-token': req.header('auth-token'),
      //             'Content-Type': 'application/json',
      //             application: 'application/json'
      //         },

      //     }
      // )

      const UserId = req.user.id;
      console.log("data:", req.body);
      const order = await service.CreateOrder({
        id: generateID(),
        userId: UserId,
        ...req.body,
        status: "pending",
      });
      console.log("order:", order);
      return res
        .status(200)
        .json({ message: "Order Created", order, success: true });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Creating Get Order Endpoint
  app.get("/order", fetchUser, async (req, res) => {
    try {
      const UserId = req.user.id;
      const order = await service.GetUserOrder(UserId);
      return res.status(200).json(order);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Creating Get All Order Endpoint
  app.get("/allorder", async (req, res) => {
    try {
      const order = await service.GetAllOrder();
      return res.status(200).json(order);
      console.log(order);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });
};
