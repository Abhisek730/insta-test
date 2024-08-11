const { Post, User, Like } = require("../models");
const { body, validationResult, Result } = require("express-validator");

const validateCreatePost = [
    body('caption').notEmpty().withMessage("Caption is required"),
    body('image').notEmpty().withMessage("Image is required")
]

const createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { caption, image, hashtag } = req.body;
    const userId = req.user.id;
    try {
        const newPost = await Post.create({ caption, image, hashtag, userId });
        res.status(201).json(newPost)

    } catch (error) {
        console.error('Error creating posts:', error);
        res.status(500).json({ message: "Internal server error" })

    }
}




const getAllPost = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    as: "postedBy",
                    attributes: ["username"]
                },
                {
                    model: Like,
                    as: "likes", // This should match the alias used in the association
                    attributes: ["userId"]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedPosts = posts.map((post) => ({
            id: post.id,
            profileImg: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
            username: post.postedBy.username,
            time: post.createdAt,
            postImg: post.image,
            likeCount: post.likes.length,
            commentCount: 20, 
            caption: post.caption,
            likedByUserIds: post.likes.map(like => like.userId) 
        }));

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.log("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




const likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user.id;

        // Find the post
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        const existingLike = await Like.findOne({ where: { postId, userId } });

        if (existingLike) {
            return res.status(400).json({ message: "User already liked the post" })
        }

        await Like.create({ postId, userId })

        res.status(200).json({ message: "Post liked successfully" })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })

    }
}

const unlikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user.id;

        // Find the post
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        const existingLike = await Like.findOne({ where: { postId, userId } });

        if (!existingLike) {
            return res.status(400).json({ message: "User not liked the post" })
        }


        await existingLike.destroy()

        res.status(200).json({ message: "Post unliked successfully" })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })

    }
}
module.exports = { createPost, validateCreatePost, getAllPost, likePost, unlikePost }







// const getAllPost = async (req, res) => {
//     try {
//         const posts = await Post.findAll({
//             include: [
//                 {
//                     model: User,
//                     as: "postedBy",
//                     attributes: ["username"]
//                 }
//             ],
//             order: [['createdAt', 'DESC']]
//         });
//         const formattedPosts = posts.map((post) => ({
//             id: post.id,
//             profileImg: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
//             username: post.postedBy.username,
//             time: post.createdAt,
//             postImg: post.image,
//             likeCount: 150,
//             commentCount: 20,
//             caption: post.caption

//         }));
//         res.status(200).json(formattedPosts)
//     } catch (error) {
//         console.log("Error fetching posts :" + error);
//         res.status(500).json({ message: "Internal Server Error" })
//     }
// }













// const getAllPost = async (req, res) => {
//     try {
//         const userId = req.user ? req.user.id : null; // Handle the case where req.user might be undefined

//         const posts = await Post.findAll({
//             include: [
//                 {
//                     model: User,
//                     as: "postedBy",
//                     attributes: ["username"]
//                 }
//             ],
//             order: [['createdAt', 'DESC']]
//         });

//         const formattedPosts = await Promise.all(posts.map(async (post) => {
//             let userLike = null;

//             if (userId) {
//                 try {
//                     userLike = await Like.findOne({
//                         where: {
//                             postId: post.id,
//                             userId: userId
//                         }
//                     });
//                 } catch (likeError) {
//                     console.log("Error fetching like status: " + likeError);
//                     return res.status(500).json({ message: "Error fetching like status" });
//                 }
//             }

//             return {
//                 id: post.id,
//                 profileImg: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
//                 username: post.postedBy.username,
//                 time: post.createdAt,
//                 postImg: post.image,
//                 likeCount: 150, // Replace with dynamic like count if available
//                 commentCount: 20, // Replace with dynamic comment count if available
//                 caption: post.caption,
//                 liked: !!userLike // true if user has liked the post, otherwise false
//             };
//         }));

//         res.status(200).json(formattedPosts);
//     } catch (error) {
//         console.log("Error fetching posts: " + error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
