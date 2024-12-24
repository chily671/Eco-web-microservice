const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
    const configFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.dev";
    dotEnv.config({ path: configFile });
    } else {
    dotEnv.config();
}

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    APP_SECRET: process.env.APP_SECRET,
    BASE_URL: process.env.BASE_URL,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
    USER_SERVICE: "user_service",
    ORDER_SERVICE: "order_service",
    USER_SERVICE_URL: process.env.USER_SERVICE_URL,

};