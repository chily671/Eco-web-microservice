const mongoose = require('mongoose');

module.exports.databaseConnection = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Products');
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
        process.exit();
    }
}