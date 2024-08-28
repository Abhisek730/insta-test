// GoogleLoginButton.js
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        const API_URL = window.location.origin.replace("3000", "5000");
        try {
            const token = credentialResponse.credential;
            const user = jwtDecode(token); // Decoding Google ID token to extract user info
            console.log(user);

            // Extract data for backend
            const { email, name, sub: googleId, picture: Photo } = user;

            // Send user data to backend
            const res = await fetch(`${API_URL}/api/users/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email_verified: true, // Assuming email is verified since Google handles that
                    email,
                    name,
                    googleId,
                    Photo,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token); // Save JWT token

                // If the profile needs completion, navigate to complete profile
                if (data.message.includes("complete your profile")) {
                    localStorage.setItem("userId", data.id)
                    navigate("/complete-profile");
                } else {
                    navigate("/home"); // Navigate to homepage
                }
            } else {
                console.error("Login failed:", data.message);
            }
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

    const handleGoogleFailure = (error) => {
        console.error("Google login failed:", error);
    };

    return (
        <GoogleLogin

            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
        />
    );
};

export default GoogleLoginButton;
