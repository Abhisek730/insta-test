import React from "react";

const ProfilePosts = ({ posts }) => {
    // const posts = [
    //     {id:1, src:"https://via.placeholder.com/150"},
    //     {id:2, src:"https://via.placeholder.com/150"},
    //     {id:3, src:"https://via.placeholder.com/150"}
    // ]
    return (
        <div className="p-4 grid grid-cols-3 gap-1">
            {posts.map((item) => (
                <img key={item.id} src={item.image} alt={`Post ${item.id}`} className="w-full" />
            ))}
        </div>
    )
}

export default ProfilePosts