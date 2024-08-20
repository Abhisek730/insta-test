
const { Post, User, Follow, Like, Comment } = require("../models")


const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                success: false,
                message: "User information is missing or incomplete"
            })
        }

        const { id, fullname, username } = req.user

        const posts = await Post.findAll({
            where: { userId: id },
            attributes: ['image', 'id']
        })

        res.status(200).json({
            success: true,
            user: { id, username, fullname },
            posts
        })


    } catch (err) {
        console.log("Error fething profile details :", err)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getUserProfileByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        // Find user by username and include posts, likes, followers, and following
        const user = await User.findOne({
            where: { username },
            include: [
                {
                    model: Post,
                    as: "posts",
                    include: [
                        {
                            model: Like,
                            as: "likes", // Include likes for each post
                        }
                    ]
                },
                {
                    model: User,
                    as: "Followers", // Followers list
                    attributes: ['id', 'username', 'fullname']
                },
                {
                    model: User,
                    as: "Following", // Following list
                    attributes: ['id', 'username', 'fullname']
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Respond with user, posts, likes, followers, and following data
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                followers: user.Followers, // Followers list
                following: user.Following // Following list
            },
            posts: user.posts // Posts including likes
        });
    } catch (err) {
        console.log("Error fetching user profile by username:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Follow a user
const followUser = async (req, res) => {
    const { followeeId } = req.params; // The ID of the user to follow
    const followerId = req.user.id; // The ID of the currently authenticated user (follower)
    console.log(followeeId, followerId);
    try {
        // Check if the followee user exists
        const followee = await User.findByPk(followeeId);
        if (!followee) {
            return res.status(404).json({
                success: false,
                message: "User to follow not found"
            });
        }

        // Check if the user is trying to follow themselves
        if (followerId === followeeId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        const existingFollow = await Follow.findOne({
            where: { followerId, followeeId }
        });

        if (existingFollow) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        await Follow.create({ followerId, followeeId });

        return res.status(201).json({
            success: true,
            message: "Successfully followed the user",

        });
    } catch (err) {
        console.log("Error following user:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
    const { followeeId } = req.params; // The ID of the user to unfollow
    const followerId = req.user.id; // The ID of the currently authenticated user (follower)

    try {
        // Check if the follow relationship exists
        const follow = await Follow.findOne({
            where: { followerId, followeeId }
        });

        if (!follow) {
            return res.status(404).json({
                success: false,
                message: "You are not following this user"
            });
        }

        // Remove the follow relationship
        await follow.destroy();

        return res.status(200).json({
            success: true,
            message: "Successfully unfollowed the user"
        });
    } catch (err) {
        console.log("Error unfollowing user:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};




module.exports = { getProfile, getUserProfileByUsername, unfollowUser, followUser }