const express = require("express");

const loginUser = require("./auth.login.api");
const registerUser = require("./auth.register.api");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
