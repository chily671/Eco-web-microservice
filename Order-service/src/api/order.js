const OrderService = require("../services/order-service");
const { PublishCustomerEvent, SubscribeMessage } = require("../utils");
const { USER_SERVICE } = require('../config');
const { PublishMessage } = require('../utils');
const { application } = require("express");
const jwt = require('jsonwebtoken');
const user = require("../../../Users-Service/src/api/user");
const { APP_SECRET } = require('../config');
const uuid = require('uuid');

function generateID() {
    return uuid.v4();
}

module.exports = (app, channel) => {

    
    const service = new OrderService();

    // Subscribe to the channel
    SubscribeMessage(channel, service);

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
            const data = jwt.verify(token, APP_SECRET);
            console.log('data:', data);
            req.user = data.user;
            console.log('req.user fetch:', data.user);
            next();
        } catch (error) {
            res.status(401).send({
                errors: "Please authenticate using a valid token",
            });
            console.log(error);
        }
    }

    // Creating Creat Order Endpoint
    app.post('/order', fetchUser, async (req, res) => {
        try {
            // const response = await fetch ('http://localhost:5001/user', 
            //     {
            //         method: 'POST',
            //         headers: {
            //             'auth-token': req.header('auth-token'),
            //             'Content-Type': 'application/json',
            //             application: 'application/json'
            //         },

            //     }
            // )

            const UserId = req.user.id;
            console.log('data:', req.body);
            const order = await service.CreateOrder({ 
                id: generateID(),
                userId: UserId, 
                ...req.body,
                status: 'pending'
            });
            console.log('order:', order);
            return res.status(200).json({ message: 'Order Created', order , success: true });

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });

    // Creating Get Order Endpoint
    app.get('/order', fetchUser, async (req, res) => {
        try {
            const UserId = req.user.id;
            const order = await service.GetUserOrder(UserId);
            return res.status(200).json(order);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });


}