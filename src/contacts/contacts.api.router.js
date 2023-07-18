const express = require("express");

const getAllContacts = require("./get-all-contacts.api");
const createContact = require("./create-contact.api");
const searchContacts = require("./search-contacts.api");
const updateContact = require("./update-contact.api.js");
const getAllFavorites = require("./get-all-favorites.api");
const getAllUnfavorites = require("./get-all-unfavorites.api");

const router = express.Router();

router.post("/search", searchContacts);
router.put("/id", updateContact);
router.get("/", getAllContacts);
router.post("/", createContact);
router.post("/favorites", getAllFavorites);
router.post("/unfavorites", getAllUnfavorites);
// router.post()

module.exports = router;
