const user = require('./model');

class UserRepository {

    async createUser(data){
        try {
            const newUser = new user(data);
            const response = await newUser.save();
            return response;
        } catch (error) {
            return error;
        }
    }

    async getUser(data){
        try {
            const response = await user.findOne(data);
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