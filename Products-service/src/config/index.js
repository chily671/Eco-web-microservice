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
  SEARCH_SERVICE_URL: process.env.SEARCH_SERVICE_URL,
  RS_SERVICE_URL: process.env.RS_SERVICE_URL,
};
