import axios from "axios";
import { useMemo } from "react";
import { useState } from "react";

import "./Likes.css";
import LikesPopup from "../../LikesPopup";

export function Likes({ likes, loggedInUserId, postId, onLike }) {
    const togglePopup = (index) => {
        setIsPopupOpen((prevState) => {
            // If the clicked popup is already open, close it
            if (prevState[index]) {
                return {};
            }
            // Otherwise, open the clicked popup and close all others
            return { [index]: true };
        });
    };

    // Function to handle liking a post
    const handleLike = async (postId) => {
        try {
            const response = await axios.post(
                `/api/posts/posts/${postId}/like`
            );

            if ([200, 201, 204].includes(response.status)) {
                // setLikedPosts((prevLikedPosts) => ({
                //     ...prevLikedPosts,
                //     [postId]: true,
                // }));

                onLike(); // Refetch the data to update the post likes count
            } else {
                console.error("Failed to like the post");
            }
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

    // Function to handle unliking a post
    const handleUnlike = async (postId) => {
        try {
            const response = await axios.post(
                `/api/posts/posts/${postId}/unlike`
            );

            if ([200, 201, 204].includes(response.status)) {
                // setLikedPosts((prevLikedPosts) => ({
                //     ...prevLikedPosts,
                //     [postId]: false,
                // }));

                onLike(); // Refetch the data to update the post likes count
            } else {
                console.error("Failed to unlike the post");
            }
        } catch (error) {
            console.error("Error unliking the post:", error);
        }
    };

    const handleLikesClick = (postId) => {
        // Handle the display of liked users
        // const likedUserNames = likedUsers[postId] ? Object.values(likedUsers[postId]) : [];
        // alert(`Liked by: ${likedUserNames.join(", ")}`);
        setSelectedPostId(postId);
        setShowLikesPopup(true);
    };

    const likesCount = likes.length;
    const isPostLikedByUser = useMemo(() => {
        return likes && likes.includes(loggedInUserId);
    }, [likes]);

    return (
        <>
            {isPostLikedByUser ? (
                <button
                    className="like-button"
                    onClick={() => handleUnlike(postId)}
                >
                    <img
                        src="/assets/Like.svg"
                        alt="Unlike"
                        className="w-5 h-5 cursor-pointer"
                    />
                </button>
            ) : (
                <button
                    className="like-button"
                    onClick={() => handleLike(postId)}
                >
                    <img
                        src="/assets/likeforposting.svg"
                        alt="Like"
                        className="w-5 h-5 cursor-pointer"
                    />
                </button>
            )}
            {likesCount > 0 && (
                <span className="text-sm font-medium">{likesCount}</span>
            )}

            {/* <LikesPopup
                show={showLikesPopup}
                likedUsers={likedUsers}
                onClose={() => setShowLikesPopup(false)}
                commentId={selectedPostId}
            /> */}
        </>
    );
}
