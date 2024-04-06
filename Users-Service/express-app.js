const express = require("express");
const cors = require("cors");
const path = require("path");
const { CreateChannel } = require("./utils");
const { userapi } = require("./api/api");

module.exports = async (app) => {
  app.use(express.json());
  app.use(cors());

  //api
  // appEvents(app);
  // Create channel and pass it to the products API
  const channel = await CreateChannel();
  userapi(app, channel);

  // error handling


};
