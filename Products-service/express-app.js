const express = require("express");
const cors = require("cors");
const { productapi } = require("./api/api");
const { CreateChannel } = require("./utils");

module.exports = async (app) => {
    app.use(express.json());
    app.use(cors());

    const channel = await CreateChannel();
    productapi(app, channel);

};