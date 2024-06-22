const express = require('express');
const cors  = require('cors');
const path = require('path');
const { order, appEvents } = require('./api');
const { CreateChannel } = require('./src/utils')

module.exports = async (app) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
 
    //api
    // appEvents(app);

    const channel = await CreateChannel()

    order(app, channel);
    // error handling
    
}
