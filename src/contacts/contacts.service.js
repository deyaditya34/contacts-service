const database = require("../services/database.service");
const { COLLECTION_NAMES } = require("../config");
const { ObjectId } = require("mongodb");

/**
 * Get all contacts belonging to a user
 * @param {{username: string}} user the authorized user
 * @returns {{name: string, phone: string}[]}
 */

function getAllContactsForUser(user) {
  return database
    .getCollection(COLLECTION_NAMES.CONTACTS)
    .find({ "user.username": user.username })
    .project({ user: false })
    .toArray();
}

function getContactForUser(id, user) {
  return database
    .getCollection(COLLECTION_NAMES.CONTACTS)
    .findOne({_id: new ObjectId(id), "user.username": user.username})
}

/**
 * Create a new contact against a user
 * @param {{name: string, phone: string}} contact the contact details to store
 * @param {{username: string}} user the authorized user
 * @returns {import("mongodb").InsertOneResult} the result of the Database store operation
 */


function createContactForUser(contact, user) {
  return database.getCollection(COLLECTION_NAMES.CONTACTS).insertOne({
    ...contact,
    user,
  });
}

function searchContactsForUser(filter, user) {
  return database
    .getCollection(COLLECTION_NAMES.CONTACTS)
    .find({ ...filter, "user.username": user.username })
    .toArray();
}

function updateContactForUser(id, update, user) {
  return database
    .getCollection(COLLECTION_NAMES.CONTACTS)
    .updateOne(
      { _id: new ObjectId(id), "user.username": user.username },
      { $set: update }
    );
}

function deleteContactForUser(id, user) {
  return database
  .getCollection(COLLECTION_NAMES.CONTACTS)
  .deleteOne({_id : new ObjectId(id), "user.username": user.username})
} 

module.exports = {
  createContactForUser,
  getAllContactsForUser,
  searchContactsForUser,
  updateContactForUser,
  deleteContactForUser,
  getContactForUser
};

