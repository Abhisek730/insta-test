const express = require("express");
const router = express.Router();
const { createPost, validateCreatePost, getAllPost,likePost,unlikePost} = require("../controllers/postController.js");
const authorizeUser = require("../middlewares/authorizeUser.js");

router.post("/create", authorizeUser, validateCreatePost, createPost);
router.get("/getAll", getAllPost);
router.post("/like", authorizeUser, likePost);
router.post("/unlike", authorizeUser, unlikePost);


module.exports = router