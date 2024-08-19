const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController.js");
const profileController = require("../controllers/profileController.js")
const authorizeUser = require("../middlewares/authorizeUser.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/profile", authorizeUser, profileController.getProfile);
// router.get("/profile/:username", authorizeUser, profileController.getUserProfileById);
router.get("/profile/:username", profileController.getUserProfileByUsername);


module.exports = router