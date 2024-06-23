const mongoose = require('mongoose');
const { OrderModel } = require('../models');
const { v4: uuidv4 } = require('uuid');

//deal witt data base operations
class OrderRepository {

    async Order(userID) {
        const orders = await OrderModel.find({ user_id: userID });
        return orders;
    }

    //create order by data from subcribe event
    async CreateOrder(data) {
        try {
            const order = new OrderModel(data);
            console.log('Order Created: ', order);
            const response = await order.save();
            return response;
        } catch (error) {
            return error;
        }
    }

    async GetUserOrder(data) {
        console.log('Data:', data);
        const orders = await OrderModel.find({userId: data});
        console.log('User Orders:', orders);
        return orders;
    }
}
module.exports = OrderRepository