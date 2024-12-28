const port = process.env.PORT || 5009;
const express = require("express");
const expressApp = require("./express-app");

const StartServer = async () => {
  const app = express();

  await expressApp(app);

  app.listen(port, (error) => {
    if (!error) {
      console.log("server Running on Port" + port);
    } else {
      console.log("Error : " + error);
    }
  });
};

StartServer();
