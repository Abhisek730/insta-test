import React from "react";

const ProfileHeader = ({username,postCount}) => {
    return (
        <div className="flex items-center p-4">
            <img src="https://via.placeholder.com/150" alt="" className="w-24 h-24 rounded-full" />
            <div className="ml-6">
                <div className="text-2xl font-semibold">{username}</div>
                <div className="flex flex-wrap mt-2">
                    <span className="mr-4"> <strong>{postCount}</strong> posts</span>
                    <span className="mr-4"> <strong>200k</strong> likes</span>
                    <span className="mr-4"> <strong>100k</strong> following</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader