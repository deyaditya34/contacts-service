const express = require("express");

const getAllContacts = require("./get-all-contacts.api");
const createContact = require("./create-contact.api");
const searchContacts = require("./search-contacts.api");
const updateContact = require("./update-contact.api.js");
const deleteContact = require("./delete-contact.api")
const getContact = require("./get-contact.api")

const router = express.Router();

router.get("/", getAllContacts);
router.get("/id", getContact);
router.post("/", createContact);
router.put("/id", updateContact);
router.post("/search", searchContacts);
router.delete("/", deleteContact);

module.exports = router;
