const { User, Follow } = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

const registerUser = async (req, res) => {
    const { username, email, password, fullname } = req.body;

    try {
        const existingUserByEmail = await User.findOne({ where: { email } });
        if (existingUserByEmail) {
            return res.status(422).json({ error: "User already exists with that email" })
        }
        const existingUserByUsername = await User.findOne({ where: { username } });
        if (existingUserByUsername) {
            return res.status(422).json({ error: "User already exists with that username" })
        }

        const hashPassword = await bcryptjs.hash(password, 10)

        const newUser = await User.create({
            username,
            fullname,
            email,
            password: hashPassword
        })
        res.status(200).json({ user: newUser, message: "Registered Successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        //find user with email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "User Not Found with Given email" })
        }
        // compare the password with the stored passowd 
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" })
        }
        // create a jwt token 
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        )

        const {id,username}=user

        res.status(200).json({id,username, token, message: "Login Successfully" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const followUser = async (req, res) => {
    try {
        const { followeeId } = req.body;
        const followerId = req.user.id;

        if (followerId === followeeId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const existingFollow = await Follow.findOne({
            where: { followerId, followeeId }
        });

        if (existingFollow) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        await Follow.create({ followerId, followeeId });
        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        console.error("Error following user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const { followeeId } = req.body;
        const followerId = req.user.id;

        const existingFollow = await Follow.findOne({
            where: { followerId, followeeId }
        });

        if (!existingFollow) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        await existingFollow.destroy();
        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId, {
            include: {
                model: User,
                as: "Followers",
                attributes: ["id", "username", "fullname"],
                through: { attributes: [] }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.Followers);
    } catch (error) {
        console.error("Error fetching followers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId, {
            include: {
                model: User,
                as: "Following",
                attributes: ["id", "username", "fullname"],
                through: { attributes: [] }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.Following);
    } catch (error) {
        console.error("Error fetching following:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { registerUser, loginUser, followUser, unfollowUser, getFollowers, getFollowing }