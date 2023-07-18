const { scryptSync } = require("crypto");
const httpError = require("http-errors");
const database = require("../services/database.service");
const jwtService = require("../services/jwt.service");
const { COLLECTION_NAMES, PASSWORD_SALT } = require("../config");

/**
 * Logs in a user
 * @param {string} username the username of the user
 * @param {password} password the password to match
 * @returns {string} the authorization token for the user
 */
async function login(username, password) {
  const user = await database.getCollection(COLLECTION_NAMES.USERS).findOne({
    username,
    password: encryptPassword(password),
  });

  if (!user) {
    throw new httpError.Unauthorized("Username/Password combo incorrect");
  }

  const token = jwtService.createToken({
    username,
  });

  return token;
}

/**
 * Registers a new user
 * @param {string} username the username
 * @param {string} password the password to use
 */
async function register(username, password) {
  const existingUser = await database
    .getCollection(COLLECTION_NAMES.USERS)
    .findOne({
      username,
    });
  if (existingUser) {
    throw new httpError.UnprocessableEntity(
      `Username '${username}' is not available`
    );
  }

  await database.getCollection(COLLECTION_NAMES.USERS).insertOne({
    username,
    password: encryptPassword(password),
  });
}

/**
 * Decodes an authorization token to get the user
 * @param {string} token the authorization token to decode
 * @returns {Promise<{username: string}>} the authorized user
 */
async function getUserFromToken(token) {
  const payload = jwtService.decodeToken(token);
  if (!payload) {
    return null;
  }

  const username = payload.username;
  const user = await database
    .getCollection(COLLECTION_NAMES.USERS)
    .findOne({ username }, { projection: { _id: false, password: false } });

  return user;
}

/**
 * Encrypt a password
 * @param {string} password the original password
 * @returns {string} the encrypted password as HEX string
 */
function encryptPassword(password) {
  return scryptSync(password, PASSWORD_SALT, 64).toString("hex");
}

module.exports = {
  register,
  login,
  getUserFromToken,
};
