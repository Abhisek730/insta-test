const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController.js");
const profileController = require("../controllers/profileController.js")
const authorizeUser = require("../middlewares/authorizeUser.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post("/googleLogin", userController.userGoogleLogin);

router.get("/profile", authorizeUser, profileController.getProfile)

router.get("/profile/:username", profileController.getProfileByUsername)
router.post("/follow/:followeeId", authorizeUser, profileController.followUser)
router.post("/unfollow/:followeeId", authorizeUser, profileController.unfollowUser)

router.put("/profile/photo", authorizeUser, profileController.updateProfilePhoto)
router.delete("/profile/photo", authorizeUser, profileController.deleteProfilePhoto)

module.exports = router