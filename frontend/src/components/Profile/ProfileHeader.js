import React, { useState } from "react";

const ProfileHeader = ({ username, userId, postCount }) => {
    const currentUsername = localStorage.getItem("username");
    const API_URL = window.location.origin.replace("3000", "4000");
    const [isFollowing, setIsFollowing] = useState(false); // Default to not following

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem("token");
    
            const response = await fetch(`${API_URL}/api/users/follow/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
    
            console.log('Response Status:', response.status); // Log the status code
    
            const data = await response.json();
            console.log('Response Data:', data); // Log the response data
    
            if (response.ok) {
                setIsFollowing(true);
            } else {
                alert(`Failed to follow user: ${data.message}`);
            }
        } catch (error) {
            console.error('Follow Error:', error); // Log any errors
            alert("An error occurred while following the user.");
        }
    };
    
    const handleUnfollow = async () => {
        try {
            const token = localStorage.getItem("token");
    
            const response = await fetch(`${API_URL}/api/users/unfollow/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
    
            console.log('Response Status:', response.status); // Log the status code
    
            const data = await response.json();
            console.log('Response Data:', data); // Log the response data
    
            if (response.ok) {
                setIsFollowing(false);
            } else {
                alert(`Failed to unfollow user: ${data.message}`);
            }
        } catch (error) {
            console.error('Unfollow Error:', error); // Log any errors
            alert("An error occurred while unfollowing the user.");
        }
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
