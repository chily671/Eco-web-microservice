const mongoose = require("mongoose");
// Shemo creating for User model

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
    default: {},
  },
  orderData: {
    type: Array,
  },
  viewdProducts: {
    type: Array,
  },
  interactionHistory: {
    type: Map,
    of: {
      quantity: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      purchases: { type: Number, default: 0 },
    },
    default : new Map(),
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
