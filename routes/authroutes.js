const express = require("express");
const { register, login, getMyDetails, searchUsers } = require("../Controller/authController");
const { authMiddleware } = require("../Middelware/authmiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMyDetails);
router.get("/search", searchUsers);

module.exports = router;
