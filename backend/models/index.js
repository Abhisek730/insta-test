const sequelize = require("../config/db");
const User = require("./User.js");
const Post = require("./Post.js");
const Like = require("./Like.js");
const Comment = require("./comment.js")


User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "postedBy" })

Like.belongsTo(Post,{foreignKey:"postId",as:"post"}),
Post.hasMany(Like,{foreignKey:'postId',as:"likes"})

Like.belongsTo(User,{foreignKey:"userId",as:"likedBy"})
User.hasMany(Like,{foreignKey:"userId",as:"like"})

User.hasMany(Comment,{foreignKey:"userId",as:"comments"});
Comment.belongsTo(User,{foreignKey:"userId",as:"postedBy"})

Post.hasMany(Comment,{foreignKey:"postId",as:"comments"})
Comment.belongsTo(Post,{foreignKey:"postId",as:"post"})

module.exports = {
    sequelize,
    Post,
    User,
    Like,
    Comment
}