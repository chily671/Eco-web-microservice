const UserService = require("../services/user-service");
const UserAuth = require("./middlewares/auth");
const { SubscribeMessage, PublishMessage } = require("../utils");
const jwt = require("jsonwebtoken");
const { APP_SECRET, ORDER_SERVICE } = require("../config");

module.exports = async (app, channel) => {
  const service = new UserService();

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
  // Subscribe to the channel
  SubscribeMessage(channel, service);

  app.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const user = await service.Register({ username, email, password });
      await fetch("http://localhost:1357/loaddata", {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("User Created");
      console.log(user);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Admin signup
  app.post("/adminsignup", async (req, res) => {
    try {
      let check = await service.CheckAdmin({ email: "admin" });
      if (check) {
        res.json({ success: false, message: "Admin already exists" });
        return;
      }
      const administrator = await service.RegisterAdmin({
        username: "admin",
        email: "admin",
        password: "admin",
      });
      return res.status(200).json({ message: "Admin Created" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.post("/decodetoken", async (req, res) => {
    try {
      const token = req.header("auth-token");
      const decoded = jwt.verify(token, "user");
      console.log(decoded);
      return res.status(200).json(decoded);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.post("/decodetokenuser", async (req, res) => {
    try {
      const token = req.header("auth-token");
      const decoded = jwt.verify(token, "user");
      console.log(decoded + "in decode token user");
      return res.status(200).json(decoded[0]);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Creating Clear Cart Endpoint
  app.post("/cart", fetchUser, async (req, res) => {
    try {
      const userId = req.user;
      console.log("userId on post:", userId);
      const cart = await service.ClearCart(userId.id);
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.get("/cart", fetchUser, async (req, res) => {
    try {
      const userId = req.user;
      console.log("userId on get cart:", userId);
      const cart = await service.GetUserCart(userId.id);
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.post("/user", fetchUser, async (req, res) => {
    try {
      const userId = req.user;
      console.log("userId on get info:", userId);
      const user = await service.GetUserById(userId.id);
      console.log(user);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.post("/addtocart", fetchUser, async (req, res) => {
    try {
      const userId = req.user;
      const productId = req.body.itemId;
      console.log("userId:", userId);
      console.log("productId:", productId);
      const cart = await service.AddToCart(userId.id, productId);
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.post("/updateInteraction", fetchUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = req.body.itemId;
      const interaction = req.body.action;

      if (!productId || !interaction) {
        return res.status(400).json({ message: "Invalid request body" });
      }

      const updated = await service.UpdateInteraction(
        userId,
        productId,
        interaction
      );
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!password || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const user = await service.Login({ email, password });
      console.log(user);
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  });

  app.get("/isadmin", fetchAdmin, async (req, res) => {
    res.json({ isAdmin: true });
  });

  app.get("/allusers", async (req, res) => {
    try {
      const users = await service.GetAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });
};
