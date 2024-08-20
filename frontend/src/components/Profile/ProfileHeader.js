

import React, { useState } from "react";

const ProfileHeader = ({ username, userId, postCount }) => {
    const currentUsername = localStorage.getItem("username");
    const [isFollowing, setIsFollowing] = useState(false);
    

    const handleFollow = () => {
        // Logic to follow the user
        setIsFollowing(true);
    };

    const handleUnfollow = () => {
        // Logic to unfollow the user
        setIsFollowing(false);
    };

    return (
        <div className="flex items-center p-4">
            <img src="https://via.placeholder.com/150" alt="" className="w-24 h-24 rounded-full" />
            <div className="ml-6">
                <div className="text-2xl font-semibold">{username}</div>
                <div className="flex flex-wrap mt-2">
                    <span className="mr-4"><strong>{postCount}</strong> posts</span>
                    <span className="mr-4"><strong>200k</strong> followers</span>
                    <span className="mr-4"><strong>100k</strong> following</span>

                    {username !== currentUsername && (
                        <button 
                            className={`ml-4 px-4 py-2 rounded ${isFollowing ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'}`}
                            onClick={isFollowing ? handleUnfollow : handleFollow}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;





// import React from "react";

// const ProfileHeader = ({username, userId, postCount}) => {
//     const currentUserId = localStorage.getItem("id");
    
//     return (
//         <div className="flex items-center p-4">
//             <img src="https://via.placeholder.com/150" alt="" className="w-24 h-24 rounded-full" />
//             <div className="ml-6">
//                 <div className="text-2xl font-semibold">{username}</div>
//                 <div className="flex flex-wrap mt-2">

//                 <span className="mr-4"> <strong>{postCount}</strong> posts</span>
//                     <span className="mr-4"> <strong>200k</strong> followers</span>
//                     <span className="mr-4"> <strong>100k</strong> following</span>

                
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ProfileHeader
