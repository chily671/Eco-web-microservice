const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.dev";
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT || 5008,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL ,
  FRONTEND_SERVICE_URL: process.env.FRONTEND_SERVICE_URL || "http://frontend-service:3000",
};
