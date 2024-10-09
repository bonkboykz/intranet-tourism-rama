import { useMemo } from "react";
import { useState } from "react";
import axios from "axios";

import { LikeIcon } from "@/Components/Icons/LikeIcon";
import { LikeOutlinedIcon } from "@/Components/Icons/LikeOutlinedIcon";

import LikesPopup from "../../LikesPopup";

import "./Likes.css";

export function Likes({
    likes,
    loggedInUserId,
    postId,
    onLike,
    onUnlike,
    onLikesClick,
}) {
    // Function to handle liking a post
    const handleLike = async (postId) => {
        try {
            const response = await axios.post(
                `/api/posts/posts/${postId}/like`
            );

            if ([200, 201, 204].includes(response.status)) {
                onLike(); // Refetch the data to update the post likes count
            } else {
                console.error("Failed to like the post");
            }
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

    // // Function to handle unliking a post
    const handleUnlike = async (postId) => {
        try {
            const response = await axios.post(
                `/api/posts/posts/${postId}/unlike`
            );

            if ([200, 201, 204].includes(response.status)) {
                onUnlike(); // Refetch the data to update the post likes count
            } else {
                console.error("Failed to unlike the post");
            }
        } catch (error) {
            console.error("Error unliking the post:", error);
        }
    };

    const likesCount = likes.length;
    const isPostLikedByUser = likes && likes.includes(loggedInUserId);

    return (
        <>
            {isPostLikedByUser ? (
                <button
                    className="like-button"
                    onClick={() => handleUnlike(postId)}
                >
                    <LikeIcon className="w-5 h-5 cursor-pointer text-secondary" />
                </button>
            ) : (
                <button
                    className="like-button"
                    onClick={() => handleLike(postId)}
                >
                    <LikeOutlinedIcon className="w-5 h-5 cursor-pointer text-secondary" />
                </button>
            )}
            {likesCount > 0 && (
                <span
                    className="text-sm font-medium cursor-pointer"
                    onClick={onLikesClick}
                >
                    {likesCount}
                </span>
            )}
        </>
    );
}
