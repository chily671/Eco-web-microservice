const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports.databaseConnection = async() => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
        process.exit();
    }
}