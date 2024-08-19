const {Post, User} = require("../models")

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
            where: { userId: id }
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
        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find all posts by the user
        const posts = await Post.findAll({
            where: { userId: user.id }
        });

        // Respond with user and posts data
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                fullname: user.fullname
            },
            posts
        });
    } catch (err) {
        console.log("Error fetching user profile by username:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = { getProfile, getUserProfileByUsername}