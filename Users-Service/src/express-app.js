const express = require("express");
const cors = require("cors");
const path = require("path");
const { CreateChannel } = require("./utils");
const { user } = require("./api");
module.exports = async (app) => {
  app.use(express.json());
  app.use(cors());

  //api
  // appEvents(app);
  // Create channel and pass it to the products API
  const channel = await CreateChannel();
  user(app, channel);

  // error handling


};
