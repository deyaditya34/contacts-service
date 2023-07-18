const MONGO_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "contacts-service";

const APP_PORT = 3000;
const COLLECTION_NAMES = {
  CONTACTS: "contacts",
  USERS: "users",
};

const JWT_SECRET = "some-unknown-secret";
const AUTH_TOKEN_HEADER_FIELD = "token";

const PASSWORD_SALT = "some-secret-password-salt-for-encryption";

module.exports = {
  MONGO_URI,
  DB_NAME,
  APP_PORT,
  COLLECTION_NAMES,
  JWT_SECRET,
  AUTH_TOKEN_HEADER_FIELD,
  PASSWORD_SALT,
};
