import React, { useState, useEffect } from "react";
import ProfileBio from "../components/Profile/ProfileBio";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfilePosts from "../components/Profile/ProfilePosts";
import { useOutletContext } from "react-router-dom";


const Profile = () => {
    const API_URL = window.location.origin.replace("3000", "5000")
    const [profileData, setProfileData] = useState();
    const {newPost,updateNewPost} = useOutletContext()


    useEffect(() => {
        const fetchProfileData = async () => {

            try {
                const response = await fetch(`${API_URL}/api/users/profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Error: " + response.statusText)
                }

                const data = await response.json();
                console.log(data);
                setProfileData(data)

            } catch (err) {
                console.log(err)
            }



        }

        fetchProfileData()
    }, [newPost])


    return (
        <div className="max-w-4xl w-full lg:w-[70%] h-auto mx-auto mt-9 mb-9 pt-9 ">
            {profileData && (
                <>
                    <ProfileHeader username={profileData.user.username} postCount={profileData.posts.length}></ProfileHeader>
                    <ProfileBio fullname={profileData.user.fullname}></ProfileBio>
                    <ProfilePosts posts={profileData.posts} updateNewPost = {updateNewPost}></ProfilePosts>

                    
                </>
            )

            }

        </div>
    )
}

export default Profile