const mongoose = require("mongoose");
const { UserModel } = require("../models");

class UserRepository {
  async createUser({ username, email, password }) {
    try {
      let cart = {};
      let order = [];
      const newUser = new UserModel({
        username,
        email,
        password,
        cartData: cart,
        orderData: order,
      });
      const response = await newUser.save();
      console.log("User Created and Saved");
      return newUser;
    } catch (error) {
      return error;
    }
  }

  async createAdmin(data) {
    try {
      let cart = {};
      let order = [];
      cart["0"] = 0;
      order.push("0");
      const newAdmin = new UserModel({
        username: data.username,
        email: data.email,
        password: data.password,
        cartData: cart,
        orderData: order,
        role: "admin",
      });
      const response = await newAdmin.save();
      console.log("Admin Created and Saved");
      return newAdmin;
    } catch (error) {
      return error;
    }
  }

  async getUserCart(userId) {
    try {
      const response = await UserModel.findById(userId);
      console.log("User Cart Data:", response.cartData);
      return response.cartData;
    } catch (error) {
      return error;
    }
  }

  async checkAdmin(data) {
    try {
      const response = await UserModel.findOne(data);
      return response;
    } catch (error) {
      return error;
    }
  }

  async addToCart(userId, productData) {
    try {
      console.log("User ID in repo:", userId);
      const user = await UserModel.findById(userId);
      const cart = user.cartData;
      const order = user.orderData;
      if (cart[productData]) {
        cart[productData] += 1;
      } else {
        cart[productData] = 1;
        order.push(productData);
      }
      await UserModel.findByIdAndUpdate(userId, {
        cartData: cart,
        orderData: order,
      });
      console.log("Product Added to Cart");
      return {
        success: true,
        message: "Product Added to Cart",
        userID: userId,
        product: order,
      };
    } catch (error) {
      return error;
    }
  }

  async DecreaseQuantity(userId, productData) {
    try {
      const user = await UserModel.findById(userId);
      const cart = user.cartData;
      if (cart[productData] > 1) {
        cart[productData] -= 1;
      } else {
        delete cart[productData];
      }
      await UserModel.findByIdAndUpdate(userId, { cartData: cart });
      console.log("Product Removed from Cart");
      return {
        success: true,
      };
    } catch (error) {
      return error;
    }
  }

  async removeFromCart(userId, productData) {
    try {
      const user = await UserModel.findById(userId);
      const cart = user.cartData;
      delete cart[productData];
      await UserModel.findByIdAndUpdate(userId, { cartData: cart });
      console.log("Product Removed from Cart");
      return {
        success: true,
        message: "Product Removed from Cart",
        userID: userId,
        product: productData,
      };
    } catch (error) {
      return error;
    }
  }

  async UpdateInteraction(userId, productId, interaction) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.interactionHistory) {
        user.interactionHistory = new Map();
      }

      // Kiểm tra và khởi tạo dữ liệu cho productId
      if (!user.interactionHistory.has(productId)) {
        user.interactionHistory.set(productId, {
          quantity: 0,
          likes: 0,
          views: 0,
          purchases: 0,
        });
      }

      // Lấy dữ liệu hiện tại
      const productData = user.interactionHistory.get(productId);

      // Cập nhật dữ liệu dựa trên hành động
      switch (interaction) {
        case "addToCart":
          productData.quantity += 1;
          break;
        case "removeFromCart":
          productData.quantity = Math.max(0, productData.quantity - 1);
          break;
        case "likes":
          productData.likes += 1;
          break;
        case "views":
          productData.views += 1;
          break;
        case "purchases":
          productData.purchases += 1;
          break;
        default:
          throw new Error("Invalid interaction type");
      }

      // Ghi dữ liệu đã cập nhật
      user.interactionHistory.set(productId, productData);

      // Đánh dấu đã thay đổi và lưu
      user.markModified("interactionHistory");
      await user.save();

      return {
        success: true,
        message: "Interaction Updated",
        cart: Array.from(user.interactionHistory.entries()),
      };
    } catch (error) {
      console.error("Error updating interaction:", error);
      return { success: false, message: error.message };
    }
  }

  async clearCart(userId) {
    try {
      const user = await UserModel.findById(userId);
      let cart = user.cartData;
      let order = user.orderData;
      const userUpdate = await UserModel.findByIdAndUpdate(userId, {
        cartData: {},
        orderData: [],
      });
      console.log("Cart Cleared");
      return {
        success: true,
        message: "Cart Cleared",
        userID: userId,
        cart: cart,
        order: order,
      };
    } catch (error) {
      return error;
    }
  }

  async getUser({ email }) {
    try {
      const response = await UserModel.findOne({ email });
      return response;
    } catch (error) {
      return error;
    }
  }

  async getAllUsers() {
    try {
      const response = await UserModel.find({ email: { $ne: "admin" } });
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUserbyID(userID) {
    try {
      const response = await UserModel.findById(userID);
      return response;
    } catch (error) {
      return error;
    }
  }

  async updateUser(data) {
    try {
      const response = await user.findOneAndUpdate(data);
      return { response };
    } catch (error) {
      return error;
    }
  }

  async deleteUser(data) {
    try {
      const response = await user.findOneAndDelete(data);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = UserRepository;
