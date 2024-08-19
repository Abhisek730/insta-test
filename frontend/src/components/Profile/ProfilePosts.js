import React, { useState } from "react";
import PostDetailModal from "./PostDetailModal"; // Adjust the path as necessary

const ProfilePosts = ({ posts }) => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleImageClick = (post) => {
        setSelectedPost(post);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedPost(null);
    };

    return (
        <>
            <div className="p-4 grid grid-cols-3 gap-1">
                {posts.map((item) => (
                    <img
                        key={item.id}
                        src={item.image}
                        alt={`Post ${item.id}`}
                        className="w-full cursor-pointer"
                        onClick={() => handleImageClick(item)}
                    />
                ))}
            </div>

            {selectedPost && (
                <PostDetailModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    feed={selectedPost}
                    // Add other necessary props here, e.g., handleAddComment, newComment, setNewComment, getComments
                />
            )}
        </>
    );
};

export default ProfilePosts;












// import React from "react";

// const ProfilePosts = ({ posts }) => {
//     // const posts = [
//     //     {id:1, src:"https://via.placeholder.com/150"},
//     //     {id:2, src:"https://via.placeholder.com/150"},
//     //     {id:3, src:"https://via.placeholder.com/150"}
//     // ]
//     return (
//         <div className="p-4 grid grid-cols-3 gap-1">
//             {posts.map((item) => (
//                 <img key={item.id} src={item.image} alt={`Post ${item.id}`} className="w-full" />
//             ))}
//         </div>
//     )
// }

// export default ProfilePosts