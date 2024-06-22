const OrderService = require("../services/order-service");
const { PublishCustomerEvent, SubscribeMessage } = require("../utils");
const  UserAuth = require('./middlewares/auth');
const { USER_SERVICE } = require('../config');
const { PublishMessage } = require('../utils')

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
                req.user = data.user;
                next();
            } catch (error) {
                res.status(401).send({
                    errors: "Please authenticate using a valid token",
                });
            }
    }

    // Creating Order Endpoint
    app.post('/order', fetchUser, async (req, res) => {
        try {
            const { product, quantity, amount } = req.body;
            const userId = req.user.id;
            const order = await service.CreateOrder({ product, quantity, amount, userId });

            // Publish Customer Event
            PublishCustomerEvent(channel, USER_SERVICE, { product, quantity, amount, userId });
            return res.status(200).json(order);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });

    // Creating Get Order Endpoint
    app.get('/getorder', fetchUser, async (req, res) => {
        try {
            const userId = req.user.id;
            const order = await service.GetUserOrder(userId);
            return res.status(200).json(order);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });


}