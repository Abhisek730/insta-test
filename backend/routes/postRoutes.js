const express = require("express");
const router = express.Router();
const { createPost,getComments,addComment, validateCreatePost, getAllPost,likePost,unlikePost } = require("../controllers/postController.js");
const authorizeUser = require("../middlewares/authorizeUser.js");

router.post("/create", authorizeUser, validateCreatePost, createPost);
router.get("/getAll", getAllPost)
router.post("/like",authorizeUser,likePost)
router.post("/unlike",authorizeUser,unlikePost);
// Fetch comments for a post
router.get("/getComments/:postId", getComments);
// Post a comment
router.post("/addComments", authorizeUser, addComment);



module.exports = router