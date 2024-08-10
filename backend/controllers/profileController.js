
const {Post} = require("../models")


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

module.exports = { getProfile }