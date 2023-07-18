const mongodb = require("mongodb");
const config = require("../config");

const client = new mongodb.MongoClient(config.MONGO_URI);

let database = null;

async function Initialize() {
  await client.connect();

  database = client.db(config.DB_NAME);
}

/**
 * Get reference to a collection
 * @param {string} collectionName the name of the collection
 * @returns {mongodb.Collection}
 */
function getCollection(collectionName) {
  return database.collection(collectionName);
}

module.exports = {
  Initialize,
  getCollection,
};
