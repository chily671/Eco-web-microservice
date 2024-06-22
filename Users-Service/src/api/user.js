const UserService = require('../services/user-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage } = require('../utils');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../config');

module.exports = async (app, channel) => {
    
    const service = new UserService();

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
    // Subscribe to the channel
    SubscribeMessage(channel, service);

    app.post('/signup', async (req, res) => {
        try {
            const { username, email, password } = req.body;
            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const user= await service.Register({ username, email, password });
            console.log(user)
            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });

    app.post('/getcart', fetchUser, async (req, res) => {
        try {
            const  userId = req.user;
            console.log('userId on get:', userId);
            const cart = await service.GetUserCart(userId.id);
            return res.status(200).json(cart);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });

    app.post('/addtocart', fetchUser, async (req, res) => {
        try {
            const  userId  = req.user;
            const  productId  = req.body.itemId;
            console.log('userId:', userId);
            console.log('productId:', productId);
            const cart = await service.AddToCart(userId.id, productId);
            return res.status(200).json(cart);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });

    app.post('/login', async (req, res) => {
        try {
            const {  email, password } = req.body;
            if ( !password || !email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const user= await service.Login({ email, password });
            console.log(user)
            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}