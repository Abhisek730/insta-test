import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns"
import { FaHeart, FaRegHeart, FaRegComment, FaRegPaperPlane, FaRegBookmark, FaRegSmile } from "react-icons/fa";
import PostDetailModal from "../PostDetailPage/PostDetailPage";

const FeedCard = ({ feed, onLike, onUnlike, currentUserId, updateNewPost }) => {
    const [newComment, setNewComment] = useState('')
    const timeAgo = formatDistanceToNow(new Date(feed.time), { addSuffix: true });
    const isLikedByCurrentUser = feed.likedByUserIds.includes(currentUserId);
    const API_URL = window.location.origin.replace("3000", "5000");
    const [isPostDetailModal, setIsPostDetailModal] = useState(false);
    const [getComments, setGetComments] = useState(true);
    function updateComments() {
        setGetComments((prev) => !prev)
    }
    const handleModalOpen = () => {
        setIsPostDetailModal(true);
    };

    const handleModalClose = () => {
        setIsPostDetailModal(false);
    };

    const handleAddComment = async () => {

        if (!newComment.trim()) return;

        try {
            const response = await fetch(`${API_URL}/api/posts/addComments`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    postId: feed.id,
                    comment: newComment

                })
            })

            if (!response.ok) {
                throw new Error(response.statusText)
            }

            const data = await response.json()
            console.log(data);
            updateNewPost()
            updateComments()
            setNewComment('')




        } catch (err) {
            console.log(err)
        }

    }
    return (
        <div className="w-full mx-auto mb-6 bg-white p-4 rounded-lg">
            {/* Profile Picture , Username , Time  */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-x-3">
                    <a href="" className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                            <img src={feed.profileImg} alt={feed.username} className="w-full h-full object-cover" />
                        </div>
                    </a>
                    <div className="flex items-center gap-x-2">
                        <p className="text-black text-sm font-medium">{feed.username}</p>
                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        <p className="text-black text-sm">{timeAgo}</p>
                    </div>
                </div>
            </div>
            {/* Post Image */}
            <div className="w-full max-h-[75vh] overflow-hidden rounder-lg mb-3">
                <img src={feed.postImg} alt={feed.caption} className="w-full h-full object-cover" />
            </div>

            {/* User Actions - Like, comment share and save  */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-x-3">
                    <button className="text-black" data-testid="like-button" onClick={() => { isLikedByCurrentUser ? onUnlike(feed.id) : onLike(feed.id) }}>
                        {isLikedByCurrentUser ? (<FaHeart data-testid="filled-heart" className="text-red-500"></FaHeart>) : (<FaRegHeart data-testid="empty-heart"></FaRegHeart>)

                        }
                    </button>
                    <button className="text-black">
                        <FaRegComment></FaRegComment>
                    </button>
                    <button className="text-black">
                        <FaRegPaperPlane></FaRegPaperPlane>
                    </button>
                </div>

                <button className="text-black">
                    <FaRegBookmark></FaRegBookmark>
                </button>

            </div>
            {/* Like Count */}
            <div className="flex items-center gap-x-2 text-base text-black font-medium my-2">
                {feed.likeCount} likes
            </div>

            {/* Caption */}
            <div className="w-full text-sm text-black font-thin mb-2">
                <a href="" className="text-black font-medium">{feed.username} </a> {feed.caption}
            </div>

            {/* Comment Count */}
            <div className="w-full text-sm text-gray-600 font-thin mb-2">
                <a onClick={() => setIsPostDetailModal(true)} className="text-gray-600 font-normal">View all {feed.commentCount} comments</a>
            </div>

            {/* Add Comment  */}
            <div className="w-full flex iteme-center justify-between border-b border-gray-300 pt-2">
                <input type="text" value={newComment} onChange={(e) => { setNewComment(e.target.value) }} className="w-full bg-transparent border-none outline-none text-sm text-gray-600 py-2" placeholder="Add a Comment ...." />
                <div className="text-black">
                    <button onClick={handleAddComment} className="bg-blue-500 text-white py-1 px-1 text-sm rounded">Post</button>
                </div>
            </div>

            {isPostDetailModal && <PostDetailModal
                isOpen={isPostDetailModal}
                onClose={handleModalClose}
                feed={feed}
                currentUserId={currentUserId}
                handleAddComment={handleAddComment}
                newComment={newComment}
                setNewComment={setNewComment}
                getComments={getComments}

            />

            }

        </div>
    )
}
export default FeedCard