const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports.databaseConnection = async() => {
    try {
        await mongoose.connect(DB_URL);
        console.log(DB_URL);
        console.log('Db Connected');
        
    } catch (error) {
        console.log('Error ============')
        console.log(error);
    }
 
};

 
