const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const { username, email, password, fullname } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res
        .status(422)
        .json({ error: "User already exists with that email" });
    }
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res
        .status(422)
        .json({ error: "User already exists with that username" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      fullname,
      email,
      password: hashPassword,
    });
    res.status(200).json({ user: newUser, message: "Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //find user with email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "User Not Found with Given email" });
    }
    // compare the password with the stored passowd
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // create a jwt token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { id, username } = user;

    res
      .status(200)
      .json({ id, username, token, message: "Login Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userGoogleLogin = async (req, res) => {
    const { email_verified, email, name, clientId, username, Photo } = req.body;
  
    try {
      if (email_verified) {
        // Find user with email
        let user = await User.findOne({ where: { email } });
        
        if (user) {
          // User exists, create a JWT token
          const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
          );
  
          const { id, username } = user;
  
          return res.status(200).json({ id, username, token, message: "Login Successfully" });
        } else {
          // User does not exist, create new user
          const password = email + clientId;
  
          // Hash the generated password
          const hashPassword = await bcryptjs.hash(password, 10);
  
          user = await User.create({
            username,
            fullname: name,
            email,
            password: hashPassword,
            Photo,
          });
  
          // Create a JWT token for the new user
          const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
          );
  
          return res.status(200).json({ user, token, message: "Registered and Logged in Successfully" });
        }
      } else {
        return res.status(400).json({ error: "Email not verified" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

module.exports = { registerUser, loginUser, userGoogleLogin };
