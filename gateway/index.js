const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", proxy("http://localhost:5001"));
app.use("/order", proxy("http://localhost:5002"));
app.use("/", proxy("http://localhost:5000")); // products

app.listen(5555, () => {
  console.log("Gateway is Listening to Port 5555");
});
