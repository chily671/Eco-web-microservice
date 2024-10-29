const express = require("express");
const cors = require("cors");
const path = require("path");
const { payment } = require("./src/api");
const app = express();

module.exports = async (app) => {
  app.use(express.json());
  app.use(cors());

  // Create channel and pass it to the products API
  payment(app);

  // error handling
};
