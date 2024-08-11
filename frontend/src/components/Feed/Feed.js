import React, { useState, useEffect } from "react";
import FeedCard from "./FeedCard/FeedCard";

const Feed = ({ newPost, handleNewPost }) => {
    const API_URL = window.location.origin.replace("3000", "4000");
    const [feeds, setFeeds] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    console.log(handleNewPost);

    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                const response = await fetch(`${API_URL}/api/posts/getAll`);
                if (!response.ok) {
                    throw new Error("Network response is not OK");
                }
                const data = await response.json();
                console.log(data);
                setFeeds(data);
            } catch (error) {
                console.error("Error fetching feeds:", error);
            }
        };


        const fetchUserId = () => {
            const userId = localStorage.getItem("id");

            console.log("userId", userId)
            setCurrentUserId(userId);
        };

        fetchFeeds();
        fetchUserId();
    }, [newPost]);

    const likePost = async (id) => {

  

        try {
            const response = await fetch(`${API_URL}/api/posts/like`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({ postId: id }),
            });
            const result = await response.json();

            const newData = feeds.map((post) => (post.id === result.id ? result : post));
            // setFeeds(newData);
            handleNewPost()

            console.log("feeds", feeds);

            console.log("result", result);


        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const unlikePost = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/posts/unlike`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({ postId: id }),
            });
            const result = await response.json();
            const newData = feeds.map((post) => (post.id === result.id ? result : post));
            // setFeeds(newData);
            handleNewPost()
            console.log(result);

            console.log("feeds", feeds);
        } catch (error) {
            console.error("Error unliking post:", error);
        }
    };

    return (
        <div className="w-full min-h-screen lg:py-7 sm:py-3 flex flex-col lg:flex-row items-start gap-x-20 mt-5 pt-5 mb-5">
            <div className="w-full lg:w-[70%] h-auto relative">
                <div className="w-full h-auto flex items-center justify-center mt-6 mb-6">
                    <div className="w-full lg:w-[73%] md:w-[73%] sm:w-[80%]">
                        {feeds && feeds.map((feed) => (
                            <FeedCard key={feed.id} feed={feed} onLike={likePost} onUnlike={unlikePost} currentUserId={currentUserId}></FeedCard>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-[25%] h-auto lg:block hidden"></div>
        </div>
    );
};

export default Feed;

























// import React, { useState, useEffect } from "react";
// import FeedCard from "./FeedCard/FeedCard";

// const Feed = () => {
//     const API_URL = window.location.origin.replace("3000", "4000")
//     const [feeds, setFeeds] = useState([])
//     useEffect(() => {
//         const fetchFeeds = async () => {
//             try {
//                 const response = await fetch(`${API_URL}/api/posts/getAll`);
//                 if (!response.ok) {
//                     throw new Error("Networt Response is not Ok")
//                 };
//                 const data = await response.json();
//                 console.log(data);
//                 setFeeds(data)

//             } catch (error) {

//             }
//         }
//         fetchFeeds()
//     }, [])

//     return (
//         <div className="w-full min-h-screen lg:py-7 sm:py-3 flex flex-col lg:flex-row items-start gap-x-20 mt-5 pt-5 mb-5">
//             <div className="w-full lg:w-[70%] h-auto relative">
//                 <div className="w-full h-auto flex items-center justify-center mt-6 mb-6">
//                     <div className="w-full lg:w-[73%] md:w-[73%] sm:w-[80%]">
//                         {feeds && feeds.map((feed) => (
//                             <FeedCard key={feed.id} feed={feed}></FeedCard>
//                         ))

//                         }


//                     </div>

//                 </div>

//             </div>
//             <div className="w-full lg:w-[25%] h-auto lg:block hidden"></div>
//         </div>
//     )
// }
// export default Feed