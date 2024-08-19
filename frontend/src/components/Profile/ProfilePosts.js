import React, { cloneElement, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import DeletePost from "../DeletePostModal/DeletePostModal";

const ProfilePosts = ({ posts, updateNewPost }) => {
  const API_URL = window.location.origin.replace("3000", "4000");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState("");
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const currentUserId = localStorage.getItem("id");

  const handleDeleteClick = (postId) => {
    setSelectedPost(postId);
    openDeleteModal();

    console.log("Delete post with ID:", postId);
  };

  const deltePost = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/posts/delete/${selectedPost}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      closeDeleteModal();
      updateNewPost();
    } catch (err) {
      console.log(err);
    }
  };

  console.log("postsssssss", posts);
  console.log("currentUserId", currentUserId);
//   console.log("currentUserId", item.userId === currentUserId);

  return (
    <>
      <div className="p-4 grid grid-cols-3 gap-1">
        {posts.map((item) => (
          <div key={item.id} className="relative group">
            <img
              src={item.image}
              alt={`Post ${item.id}`}
              className="w-full h-auto"
            />
            {item.userId == currentUserId && (
              <div
                className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => handleDeleteClick(item.id)}
              >
                <AiOutlineDelete className="text-white w-6 h-6" />
              </div>
            )}
          </div>
        ))}
      </div>
      {isDeleteModalOpen && (
        <DeletePost
          onClose={closeDeleteModal}
          onConfirm={deltePost}
        ></DeletePost>
      )}
    </>
  );
};

export default ProfilePosts;
