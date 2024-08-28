import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CompleteProfile = () => {
    const API_URL = window.location.origin.replace("3000", "5000")

    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/api/users/complete-profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: parseInt(localStorage.getItem("userId")), // ID passed from previous page
                    username,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                navigate("/"); // After completing the profile, navigate to homepage
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Choose a Username
                </h2>
                <form className="space-y-4 w-full" onSubmit={handleSubmit}>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-md focus:outline-none focus:ring focus:borde-blue=300"
                        >
                            Complete Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
