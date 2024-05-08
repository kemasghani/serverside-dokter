const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");

// Define user routes
router.post("/login", userController.loginUser);
router.post("/email", userController.sendEmail);

module.exports = router;
