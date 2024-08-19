import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FaRegSmile, FaArrowLeft, FaTimes, FaEllipsisH } from "react-icons/fa";

Modal.setAppElement(document.getElementById("root"))

const PostDetailModal = ({
    isOpen,
    onClose,
    feed,
    handleAddComment,
    newComment,
    setNewComment,
    getComments,
}) => {
    const API_URL = window.location.origin.replace("3000", "4000");
    const [comments, setComments] = useState([]);
    const [isActionModalOpen, setActionModalOpen] = useState(false); 
    const currentUserId = localStorage.getItem("id"); 

    useEffect(() => {
        const fetchComments = async () => {
            if (isOpen) {
                try {
                    const response = await fetch(
                        `${API_URL}/api/posts/getComments/${feed.id}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setComments(data);
                    }
                } catch (error) {
                    console.error("Error fetching comments:", error);
                }
            }
        };

        fetchComments();
    }, [getComments]);


    // Function to handle post deletion
    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/posts/delete/${postId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in local storage
                    },
                }
            );

            if (response.ok) {
                onClose(); // Close the modal after deletion
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("An error occurred while deleting the post.");
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                className="flex items-center justify-center h-full w-full"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 w-11/12 md:w-4/5 mx-4 relative flex flex-col md:flex-row">
                    {/* Mobile Navbar */}
                    <div className="md:hidden flex items-center border-b border-gray-300 pb-2 mb-2 relative">
                        <button
                            onClick={onClose}
                            className="absolute left-0 text-gray-500 hover:text-gray-700 text-2xl ml-4"
                        >
                            <FaArrowLeft />
                        </button>
                        <p className="text-lg font-semibold mx-auto">Comments</p>
                    </div>

                    {/* Desktop Close Icon */}
                    <button
                        onClick={onClose}
                        className="hidden md:block absolute top-0 right-2 text-gray-500 hover:text-gray-700 text-3xl font-medium"
                    >
                        <FaTimes />
                    </button>

                    {/* Post Image */}
                    <div className="hidden md:flex w-full md:w-1/2 h-full justify-center items-center bg-gray-100 p-4 rounded-lg">
                        <img
                            src={feed.postImg}
                            alt={feed.caption}
                            className="max-h-[75vh] object-cover rounded-lg"
                        />
                    </div>

                    {/* Post Details and Comments */}
                    <div className="w-full md:w-1/2 h-full flex flex-col px-4">
                        {/* Post Details */}
                        <div>
                            {/* Profile Picture, Username, Time, and Three-Dot Button */}
                            <div className="flex items-center justify-between mb-2 border-b-2 border-gray-300 py-2">
                                <div className="flex items-center gap-x-3">
                                    <a href="" className="flex items-center">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                                            <img
                                                src={feed.profileImg}
                                                alt={feed.username}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </a>
                                    <div className="flex items-center gap-x-2">
                                        <p className="text-black text-sm font-medium">
                                            {feed.username}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActionModalOpen(true)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaEllipsisH />
                                </button>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto mb-4" style={{ maxHeight: "300px" }}>
                            {comments.map((comment) => (
                                <div key={comment.id} className="mb-2 flex items-center gap-3">
                                    <p className="font-bold">{comment.postedBy.username}</p>
                                    <p>{comment.comment}</p>
                                </div>
                            ))}
                        </div>

                        {/* Add Comment */}
                        <div className="w-full flex items-center border-t border-gray-300 pt-2">
                            <button className="text-black mr-2">
                                <FaRegSmile />
                            </button>
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-600 py-2"
                                placeholder="Add a Comment ...."
                            />
                            <button
                                onClick={handleAddComment}
                                className="ml-2 bg-blue-500 text-white py-1 px-4 rounded"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Action Modal */}
            <Modal
                isOpen={isActionModalOpen}
                onRequestClose={() => setActionModalOpen(false)}
                className="bg-white rounded-lg p-4 w-11/12 md:w-1/3 mx-4 absolute inset-x-0 top-1/3"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div>
                    {/* Delete Button (Visible only to post owner) */}
                    {currentUserId === feed.userId && (
                        <button
                            onClick={() => {
                                handleDeletePost(feed.id);
                                setActionModalOpen(false);
                                onClose();
                            }}
                            className="w-full text-red-600 py-2 border-b border-gray-300"
                        >
                            Delete
                        </button>
                    )}
                    {/* Other Options */}
                    <button className="w-full py-2 border-b border-gray-300">
                        Report
                    </button>
                    <button className="w-full py-2 border-b border-gray-300">
                        Go to Post
                    </button>
                    <button className="w-full py-2 border-b border-gray-300">
                        Share to...
                    </button>
                    <button className="w-full py-2 border-b border-gray-300">
                        Copy Link
                    </button>
                    <button className="w-full py-2" onClick={() => {
                                setActionModalOpen(false);
                            }}>
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default PostDetailModal;






















// import React, { useEffect, useState } from "react";
// import Modal from "react-modal";
// import { FaRegSmile, FaArrowLeft, FaTimes } from "react-icons/fa";

// Modal.setAppElement(document.getElementById("root"))

// const PostDetailModal = ({
//     isOpen,
//     onClose,
//     feed,
//     handleAddComment,
//     newComment,
//     setNewComment,
//     getComments
// }) => {
//     const API_URL = window.location.origin.replace("3000", "4000");
//     const [comments, setComments] = useState([]);
 

//     useEffect(() => {
//         const fetchComments = async () => {
//             if (isOpen) {
//                 try {
//                     const response = await fetch(
//                         `${API_URL}/api/posts/getComments/${feed.id}`
//                     );
//                     if (response.ok) {
//                         const data = await response.json();
//                         setComments(data);
//                     }
//                 } catch (error) {
//                     console.error("Error fetching comments:", error);
//                 }
//             }
//         };

//         fetchComments();
//     }, [getComments]);

//     return (
//         <Modal
//             isOpen={isOpen}
//             onRequestClose={onClose}
//             className="flex items-center justify-center h-full w-full"
//             overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//         >
//             <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 w-11/12 md:w-4/5 mx-4 relative flex flex-col md:flex-row">
//                 {/* Mobile Navbar */}
//                 <div className="md:hidden flex items-center border-b border-gray-300 pb-2 mb-2 relative">
//                     <button
//                         onClick={onClose}
//                         className="absolute left-0 text-gray-500 hover:text-gray-700 text-2xl ml-4"
//                     >
//                         <FaArrowLeft />
//                     </button>
//                     <p className="text-lg font-semibold mx-auto">Comments</p>
//                 </div>

//                 {/* Desktop Close Icon */}
//                 <button
//                     onClick={onClose}
//                     className="hidden md:block absolute top-0 right-2 text-gray-500 hover:text-gray-700 text-3xl font-medium"
//                 >
//                     <FaTimes />
//                 </button>

//                 {/* Post Image */}
//                 <div className="hidden md:flex w-full md:w-1/2 h-full justify-center items-center bg-gray-100 p-4 rounded-lg">
//                     <img
//                         src={feed.postImg}
//                         alt={feed.caption}
//                         className="max-h-[75vh] object-cover rounded-lg"
//                     />
//                 </div>

//                 {/* Post Details and Comments */}
//                 <div className="w-full md:w-1/2 h-full flex flex-col px-4">
//                     {/* Post Details */}
//                     <div>
//                         {/* Profile Picture, Username, Time */}
//                         <div className="flex items-center justify-between mb-2 border-b-2 border-gray-300 py-2">
//                             <div className="flex items-center gap-x-3">
//                                 <a href="" className="flex items-center">
//                                     <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
//                                         <img
//                                             src={feed.profileImg}
//                                             alt={feed.username}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>
//                                 </a>
//                                 <div className="flex items-center gap-x-2">
//                                     <p className="text-black text-sm font-medium">
//                                         {feed.username}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Comments List */}
//                     <div className="flex-1 overflow-y-auto mb-4" style={{ maxHeight: "300px" }}>
//                         {comments.map((comment) => (
//                             <div key={comment.id} className="mb-2 flex items-center gap-3">
//                                 <p className="font-bold">{comment.postedBy.username}</p>
//                                 <p>{comment.comment}</p>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Add Comment */}
//                     <div className="w-full flex items-center border-t border-gray-300 pt-2">
//                         <button className="text-black mr-2">
//                             <FaRegSmile />
//                         </button>
//                         <input
//                             type="text"
//                             value={newComment}
//                             onChange={(e) => setNewComment(e.target.value)}

//                             className="w-full bg-transparent border-none outline-none text-sm text-gray-600 py-2"
//                             placeholder="Add a Comment ...."
//                         />
//                         <button
//                             onClick={handleAddComment}
//                             className="ml-2 bg-blue-500 text-white py-1 px-4 rounded"
//                         >
//                             Post
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default PostDetailModal;
