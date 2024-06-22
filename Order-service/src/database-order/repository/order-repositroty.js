const mongoose = require('mongoose');
const { OrderModel } = require('../models');
const { v4: uuidv4 } = require('uuid');

//deal witt data base operations
class OrderRepository {

    async Order(userID) {
        const orders = await OrderModel.find({ user_id: userID });
        return orders;
    }

    async CreateNewOrder(customerId, txnId){

        //required to verify payment through TxnId

        const cart = await CartModel.findOne({ customerId: customerId })

        if(cart){         
            
            let amount = 0;   

            let cartItems = cart.items;

            if(cartItems.length > 0){
                //process Order
                
                cartItems.map(item => {
                    amount += parseInt(item.product.price) *  parseInt(item.unit);   
                });
    
                const orderId = uuidv4();
    
                const order = new OrderModel({
                    orderId,
                    customerId,
                    amount,
                    status: 'received',
                    items: cartItems
                })
    
                cart.items = [];
                
                const orderResult = await order.save();
                await cart.save();
                return orderResult;


            }

 

        }

        return {}
    }

    async CreateOrder(data) {
        try {
            const order = new OrderModel(data);
            const response = await order.save();
            return response;
        } catch (error) {
            return error;
        }
    }
}

module.exports = OrderRepository