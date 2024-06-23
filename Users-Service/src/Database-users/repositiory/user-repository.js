const mongoose = require('mongoose');
const { UserModel } = require('../models');

class UserRepository {

    async createUser({ username, email, password }) {
        try {
            let cart = {};
            let order = [];
            cart["0"] = 0;
            order.push("0");
            const newUser = new UserModel({ username, email, password, cartData: cart, orderData: order});
            const response = await newUser.save();
            console.log('User Created and Saved');
            return newUser;
        } catch (error) {
            return error;
        }
    }

    async getUserCart(userId) {
        try {
            const response = await UserModel.findById(userId);
            console.log("User Cart Data:" , response.cartData); 
            return response.cartData;
        } catch (error) {
            return error;
        }
    }

    async addToCart(userId, productData) {
        try {
            console.log('User ID in repo:', userId);
            const user = await UserModel.findById(userId);
            const cart = user.cartData;
            const order = user.orderData;
            if (cart[productData]) {
                cart[productData] += 1;
            } else {
                cart[productData] = 1;
                order.push(productData);
            }
            await UserModel.findByIdAndUpdate(userId, { cartData: cart, orderData: order });
            console.log('Product Added to Cart');
            return {   success: true, message: 'Product Added to Cart', userID: userId, product: order};
        } catch (error) {
            return error;
        }
    }

    async clearCart(userId) {
        try { 
            const user = await UserModel.findById(userId);
            let cart = user.cartData;
            let order = user.orderData;
            const userUpdate = await UserModel.findByIdAndUpdate(userId, { cartData: {}, orderData: [] });
            console.log('Cart Cleared');
            return {   success: true, message: 'Cart Cleared', userID: userId, cart: cart, order: order};
        }
        catch (error) {
            return error;
        }
    }

    async getUser({email}){
        try {
            const response = await UserModel.findOne({ email });
            return response;
        } catch (error) {
            return error;
        }
    }

    async getUserbyID(userID){
        try {
            const response = await UserModel.findOne(userID);
            return response;
        } catch (error) {
            return error;
        }
    }

    async updateUser(data){
        try {
            const response = await user.findOneAndUpdate(data);
            return response;
        } catch (error) {
            return error;
        }
    }

    async deleteUser(data){
        try {
            const response = await user.findOneAndDelete(data);
            return response;
        } catch (error) {
            return error;
        }
    }

}

module.exports = UserRepository;