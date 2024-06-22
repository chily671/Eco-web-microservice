
// All API Logic goes here
// All Buisiness Logic goes here
const { UserRepository } = require('../Database-users');
const { ValidateSignature, ComparePassword } = require('../utils');
const { GeneratePassword, GenerateSalt, ValidatePassword, GenerateSignature, FormateData } = require('../utils');

class UserService {

    constructor() {
        this.repository = new UserRepository();
    }

    async Register(UserData) {
        try {
            const { username, email, password } = UserData;
            const salt = await GenerateSalt();
            const hashedPassword = await GeneratePassword(password, salt);
            const user = await this.repository.createUser({ username, email, password: hashedPassword });
            const data = {
                user:{
                    id: user.id,
                }
            }
            const token = await GenerateSignature( data );
            console.log('User Created');
            return { success: true, token };
            
        }
        catch (error) {
            console.log(error);
            return { success: false, message: 'Internal Server Error' };
        }
    }


    async Login(UserInput) {
        try {
            const { email, password } = UserInput;
            
            const User = await this.repository.getUser({ email });

            if (!User) {
                console.log('User not found');
                return { success: false, message: 'User not found' };
            } else {
                const isPassCompare = await ComparePassword(password, User.password);
                if (!isPassCompare) {
                    return { success: false, message: 'Invalid Password' };
                }
                const token = await GenerateSignature({ user: { id: User.id }});
                console.log('User Logged In');
                return {   success: true, token, user: { id: User.id }}; 
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: 'Internal Server Error' }; 
        }
    }

    async AddToCart(userId, productData) {
        try {
            const cart = await this.repository.addToCart(userId, productData);
            return cart;
        } catch (error) {
            console.log(error);
            return { success: false, message: 'Internal Server Error' };
        }
    }

    async GetUserCart(userId) {
        try {
            const cart = await this.repository.getUserCart(userId);
            return cart;
        } catch (error) {
            console.log(error);
            return { success: false, message: 'Internal Server Error' };
        }
    }

    async GetAllUsers(req, res) {
        try {
            const users = await User.find();
            return res.status(200).json(FormateData(users));
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async GetUser(req, res) {
        try {
            const { email } = req.user;
            const user = await User.findOne({ email });
            return res.status(200).json(FormateData(user));
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async UpdateUser(req, res) {
        try {
            const { email } = req.user;
            const { password } = req.body;
            const salt = await GenerateSalt();
            const hashedPassword = await GeneratePassword(password, salt);
            await User.findOneAndUpdate({ email }, { password: hashedPassword, salt });
            return res.status(200).json({ message: 'User Updated' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = UserService;