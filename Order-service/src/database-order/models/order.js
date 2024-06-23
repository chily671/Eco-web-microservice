const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    id: {type: String, required: true, unique: true},
  userId:  String,
  products: Object,
  total: Number,
  fullname: String,
  email: String,
  phone: String,
  address: String,
  province: String,
  city: String,
  ward: String,
  time: String,
  status: String,
},
{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports =  mongoose.model('order', OrderSchema);
