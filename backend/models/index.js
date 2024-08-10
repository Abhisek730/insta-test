const sequelize = require("../config/db");
const User = require("./User.js");
const Post = require("./Post.js");
const Like = require("./Like.js");


User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "postedBy" });

Like.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Like, { foreignKey: 'postId' });

Like.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Like, { foreignKey: 'userId' });


module.exports = {
    sequelize,
    Post,
    User,
    Like
}