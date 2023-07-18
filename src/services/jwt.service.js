const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Create a JWT with a particular payload and configured secret
 * @param {any} payload the payload data for the token
 * @returns {string}
 */
function createToken(payload) {
  const token = jwt.sign(payload, config.JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT to get the payload
 * @param {string} token the token to decode
 * @returns {any} the token payload
 */
function decodeToken(token) {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    console.log("Token Invalid", token);
    return null;
  }
}

module.exports = {
  createToken,
  decodeToken,
};
