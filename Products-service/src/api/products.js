const ProductService = require('../services/product-service');
const { PublishMessage } = require('../utils');
const express = require('express');
const UserAuth = require('./middlewares/auth');
const { USER_SERVICE } = require('../config');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const path = require('path');
const multer = require('multer');
// UID Generation
function generateID() {
    return uuid.v4();
}
module.exports = async (app, channel) => {

    const service = new ProductService();

    // Creating middleware for user authentication
    const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({
            errors: "Please authenticate using a valid token",
        });
    }
    else
        try {
            const data = jwt.verify(token, "secret_ecom");
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({
                errors: "Please authenticate using a valid token",
            });
        }
    }
    // Image storage
    const storage = multer.diskStorage({
        destination: "./upload/images/",
        filename:(req, file, cb) => {
            cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
        }
    });

    const upload = multer({
        storage: storage,
    })

    // Creating Upload Endpoint for images
    app.use("/images", express.static("upload/images"));

    app.post("/upload", upload.single("product"), (req, res) => {
    res.json({
        success: 1,
        image_url: `/images/${req.file.filename}`
        });
    });


    app.post('/addproduct', async (req, res) => {
    const { name, image, brand, model, price, sex, size, year, available } = req.body;

    // Kiểm tra và xác nhận các trường bắt buộc
    if (!name || !image || !brand || !model || !price || !sex || !size || !year || available === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const {data} = await service.CreateProduct({
             name, image, brand, model, price, sex, size, year, available
        });
        return res.json(data);
    } catch (error) {
        console.error('Error creating product:', error); // Logging lỗi
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

    // Creating endpoint for getting new collection
    app.get('/newcollection',async(req,res)=>{
        try {
            const { data } = await service.GetNewCollection();
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error in GET /newcollection:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
//creating endpoint for getting all products
app.get("/allproduct", async (req, res, next) => {
    try {
      const { data } = await service.GetAllProducts();
      return res.status(200).json(data);
    } catch (error) {
        console.error('Error in GET /products:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
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
        const brand = "Audemars Piguet" ;
        const { data } = await service.GetProductPopular(brand);
        return res.status(200).json(data);
        } catch (error) {
            console.error('Error in GET /popularinbrands:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } );


   // creating endpoint for adding products in cartdata
    app.post('/addtocart',fetchUser,async(req,res)=>{
        console.log("added",req.body.itemId);
        let userData = await Users.findOne({_id:req.user.id});
        userData.cartData[req.body.itemId] += 1;
        await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData})
        res.send("Added")
    })
   
   // Creating endpoint to remove product from cartdata
   app.post('/removefromcart',fetchUser,async(req,res)=>{
       console.log("removed",req.body.itemId);
       let userData = await Users.findOne({_id:req.user.id});
       if(userData.cartData[req.body.itemId]>0)
       userData.cartData[req.body.itemId] -=1;
       await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData})
       res.send("Removed")
   })
   




// creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"})
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})
}
