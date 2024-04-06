const mongoose = require("mongoose");
// Schema for Creating Products

const Product = mongoose.model("Product",{
    id:{
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },
})

module.exports = Product;
