const mongoose = require('mongoose');
// Shemo creating for User model

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    orderData: {
        type: Array,
    },
    date:{
        type:Date,
        default:Date.now,
    }

})

module.exports =  mongoose.model('User', UserSchema);