const {fetchUser} = require('./auth');
const Users = require('../Database-products/models');

module.exports.productapi = async (app) => {

   // creating endpoint for adding products in cartdata
    app.post('/addtocart',fetchUser, async (req,res)=>{
    //check ItemId and id user */   console.log(req.body,req.user);
        console.log("Added",req.body.itemId);
       let userData = await Users.findOne({_id:req.user.id});
       console.log(userData)
       if (req.body.itemId in userData.cartData) {
         userData.cartData[req.body.itemId] += 1;
     }
     else {
         userData.cartData[req.body.itemId] = 1;
     }
     await Users.findOneAndUpdate({ _id: req.user.id }, { cartData:userData.cartData });
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
   
   // Creating endpoint to get cartdata
   app.post('/getcart',fetchUser,async(req,res)=>{
       console.log("GetCart");
       let userData = await Users.findOne({_id:req.user.id});
       res.json(userData.cartData);
   })

// Creating API for getting all products
app.get('/allproducts', async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

//creating endpoint for newcollection data
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Newcollection Fetched");
    res.send(newcollection);
})

// creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"})
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})
}
