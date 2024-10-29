const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.dev";
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  PAYPAL_API: process.env.PAYPAL_API,
};
