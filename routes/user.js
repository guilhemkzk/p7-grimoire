const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

// [POST] API AUTH SIGNUP
router.post("/signup", userCtrl.signup);

// [POST] API AUTH LOGIN
router.post("/login", userCtrl.login);

module.exports = router;
