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
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL,
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
  FRONTEND_SERVICE_URL: process.env.FRONTEND_SERVICE_URL,
};
