const mongoose = require('mongoose');

module.exports.databaseConnection = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Users');
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
        process.exit();
    }
}