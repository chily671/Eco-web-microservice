const ProductService = require("../services/product-service");
const { PublishMessage } = require("../utils");
const express = require("express");
const UserAuth = require("./middlewares/auth");
const { USER_SERVICE, RS_SERVICE_URL, SEARCH_SERVICE_URL } = require("../config");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
module.exports = async (app, channel) => {
  const service = new ProductService();

  // Creating middleware for user authentication
  const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).send({
        errors: "Please authenticate using a valid token",
      });
    } else
      try {
        const data = jwt.verify(token, "user");
        req.user = data.user;
        next();
      } catch (error) {
        res.status(401).send({
          errors: "Please authenticate using a valid token",
        });
      }
  };
  // Image storage
  const storage = multer.diskStorage({
    destination: "./upload/images/",
    filename: (req, file, cb) => {
      cb(null, file.name + "_" + Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage,
  });

  // Creating Upload Endpoint for images
  app.use("/images", express.static("upload/images"));

  app.post("/upload", upload.single("product"), (req, res) => {
    res.json({
      success: 1,
      image_url: `/product/images/${req.file.filename}`,
    });
  });

  app.get("/product/:id", async (req, res) => {
    const { id } = req.params;
    console.log("id: " + id);
    try {
      const  data  = await service.GetProductById(id);
      console.log("data: " + data);
      return res.json(data);
    } catch (error) {
      console.error("Error getting product by id:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/product/:id", async (req, res) => {
    const { id } = req.params;
    console.log("id: " + id);
    try {
      const  data  = await service.GetProductById(id);
      console.log("data: " + data);
      return res.json(data);
    } catch (error) {
      console.error("Error getting product by id:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Creating endpoint for getting product for payment
  app.get("/productforpayment", async (req, res) => {
    const { id } = req.body;
    console.log("id: " + id);
    try {
      const  data  = await service.GetProductByIdForPayMent(id);
      console.log("data: " + data);
      return res.json(data);
    } catch (error) {
      console.error("Error getting product by id:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });


  // Creating endpoint for rating product
  app.post("/rateproduct", async (req, res) => {
    const { productId, rating } = req.body;
    try {
      const { data } = await service.RateProduct(productId, rating);
      return res.json(data);
    } catch (error) {
      console.error("Error rating product:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/addproduct", async (req, res) => {
    const { name, image, brand, model, price, sex, size, year, available } =
      req.body;

    // Kiểm tra và xác nhận các trường bắt buộc
    if (
      !name ||
      !image ||
      !brand ||
      !model ||
      !price ||
      !sex ||
      !size ||
      !year ||
      available === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const { data } = await service.CreateProduct({
        name,
        image,
        brand,
        model,
        price,
        sex,
        size,
        year,
        available,
      });
      return res.json(data);
    } catch (error) {
      console.error("Error creating product:", error); // Logging lỗi
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Creating endpoint for editing product
  app.put("/editproduct", async (req, res) => {
    const { productId, name, image, brand, model, price } = req.body; 
    try {
      const { data } = await service.EditProduct({
        productId,
        name,
        image,
        brand,
        model,
        price,
      });
      return res.json(data);
    } catch (error) {
      console.error("Error editing product:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Creating endpoint for getting new collection
  app.get("/newcollection", async (req, res) => {
    try {
      const { data } = await service.GetNewCollection();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in GET /newcollection:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //creating endpoint for getting all products
  app.get("/allproduct", async (req, res, next) => {
    try {
      const { data } = await service.GetAllProducts();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in GET /products:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Cấu hình Multer
  const imageSearchStorage = multer.diskStorage({
    destination: "./upload/imageSearch/",
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const imageSearchUpload = multer({
    storage: imageSearchStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn dung lượng file ảnh
  });

  // Creating Upload Endpoint for imageSearch
  app.use("/imagesearchstorage", express.static("upload/imageSearch"));

  app.post(
    "/imagesearch",
    (req, res, next) => {
      imageSearchUpload.single("query_img")(req, res, (err) => {
        if (err) {
          console.error("Multer error:", err);
          return res.status(400).json({ error: err.message });
        }
        next(); // Tiếp tục nếu không có lỗi
      });
    },
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No image was uploaded." });
        }
        console.log("File uploaded successfully:", req.file);
        let imageSearchformData = new FormData();
        // imageSearchformData.append("query_img", req.file.filename);
        imageSearchformData.append("query_img", req.file.filename);
        console.log(imageSearchformData);
        // Gửi formData đến URL khác
        const response = await fetch(`${SEARCH_SERVICE_URL}/imagesearch`, {
          method: "POST",
          body: imageSearchformData,
        }).catch((error) => console.error("Error:", error));
        console.log("Response imagesearch:", response);
        res.json(await response.json());
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  // Midlleware for reatrain model
  app.post("/retrain", async (req, res) => {
    try {
      // Tao formData moi de gui den URL khac
      let formData = new FormData();
      console.log(req.body.image_filename);
      formData.append("image_filename", req.body.image_filename);
      // Gui formData den URL khac
      const response = await fetch(`${SEARCH_SERVICE_URL}/retrain`, {
        method: "POST",
        body: formData,
      });
      res.json(await response.json());
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

  //creating endpoint for getting recommended products
  app.get("/recommended",fetchUser, async (req, res, next) => {
    try {
      let userID = req.user.id;
      console.log(userID);
      const response = await fetch(`${RS_SERVICE_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userID}),
      }).then((response) => response.json());
      const recommendedProducts = await service.GetRecommendedProducts(response);
      return res.status(200).json(recommendedProducts);
    } catch (error) {
      console.error("Error in GET /recommended:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.put("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetProductPayload(
      _id,
      { productId: req.body._id, qty: req.body.qty },
      "ADD_TO_CART"
    );

    // PublishCustomerEvent(data);
    // PublishShoppingEvent(data);

    PublishMessage(channel, USER_SERVICE, JSON.stringify(data));
    PublishMessage(channel, ORDER_SERVICE, JSON.stringify(data));

    const response = { product: data.data.product, unit: data.data.qty };

    res.status(200).json(response);
  });

  //creating endpoint for getting product by brand
  app.get("/popularinbrands", async (req, res, next) => {
    try {
      const brand = "Audemars Piguet";
      const { data } = await service.GetProductPopular(brand);
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in GET /popularinbrands:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // creating endpoint for adding products in cartdata
  app.post("/addtocart", fetchUser, async (req, res) => {
    console.log("added", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Added");
  });

  // Creating endpoint to remove product from cartdata
  app.post("/removefromcart", fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0)
      userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Removed");
  });

  // creating endpoint for popular in women section
  app.get("/popularinwomen", async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
  });

  app.post("/removeproduct", async (req, res) => {
    console.log(req.body);
    const { productId } = req.body;
    try {
      const { data } = await service.RemoveProduct(productId);
      console.log("Product Removed");
      return res
        .status(200)
        .json({ message: "Product Removed", success: true });
    } catch (error) {
      console.error("Error removing product:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};
