import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

import { ShareYourThoughts } from "@/Components/Reusable/WallPosting";
import { useCsrf } from "@/composables";
import { cn } from "@/Utils/cn";
import { formatTimeAgo } from "@/Utils/format";

import LikesPopup from "./LikesPopup";
import MentionedName from "./MentionedName";
import { usePolls } from "./PollPostCard/usePolls";
import PostAttachments from "./PostAttachments";

const Comment = ({ post, onClose, loggedInUserId, currentUser }) => {
    const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const csrfToken = useCsrf();
    const { id } = usePage().props; // Retrieve the user_id from the Inertia view
    const [comments, setComments] = useState([]);
    const [commentedUsers, setCommentedUsers] = useState({});
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [showLikesPopup, setShowLikesPopup] = useState(false);
    const [likedUsers, setLikedUsers] = useState({});

    const fetchComments = () => {
        fetch(`/api/posts/posts/${post.id}?with[]=comments`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then(({ data }) => {
                const sortedComments = data.comments.sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                );
                // console.log("SORTED COMMENTS", sortedComments);

                setComments(sortedComments); // Set the sorted comments

                sortedComments.forEach((comment) => fetchLikedUsers(comment));
            })
            .catch((error) => {
                console.log("Error fetching comments: ", error);
            });
    };

    const fetchLikedUsers = (comment) => {
        if (Array.isArray(comment.likes)) {
            const uniqueUserIds = [...new Set(comment.likes)];

            uniqueUserIds.forEach((user_id) => {
                if (user_id) {
                    fetch(`/api/users/users/${user_id}?with[]=profile`, {
                        method: "GET",
                    })
                        .then((response) => response.json())
                        .then(({ data }) => {
                            setLikedUsers((prevState) => ({
                                ...prevState,
                                [comment.id]: {
                                    ...prevState[comment.id],
                                    [user_id]: {
                                        name: data.name,
                                        image: data.profile?.image, // Assuming `data.profile.image` contains the image URL
                                    },
                                },
                            }));
                        })
                        .catch((error) => {
                            console.error(
                                `Error fetching user data for user_id ${user_id}:`,
                                error
                            );
                        });
                }
            });
        }
    };

    useEffect(() => {
        fetchComments();
    }, [post.id]);

    const loadCommentedUsers = async () => {
        // Fetch user data for each unique user_id in the comments array
        const uniqueUserIds = [
            ...new Set(comments.map((comment) => comment.user_id)),
        ].filter(Boolean);

        const users = await Promise.all(
            uniqueUserIds.map(async (user_id) => {
                const {
                    data: { data: user },
                } = await axios.get(`/api/users/users/${user_id}`, {
                    params: {
                        with: ["profile"],
                    },
                });

                return {
                    userId: user_id,
                    name: user.name,
                    profileImage: user.profile?.image || "",
                };
            })
        );

        const usersMap = users.reduce((acc, user) => {
            acc[user.userId] = {
                name: user.name,
                profileImage: user.profileImage,
            };
            return acc;
        }, {});

        setCommentedUsers(usersMap);
    };

    useEffect(() => {
        loadCommentedUsers();
    }, [comments]);

    const handleClickTreeDots = (commentId) => {
        setIsCommentPopupOpen((prevState) =>
            prevState === commentId ? null : commentId
        );
    };

    const confirmDelete = (comment) => {
        setCommentIdToDelete(comment.pivot.id);
        setPostIdToDelete(comment.pivot.comment_id);
        setShowDeletePopup(true);
        setIsCommentPopupOpen(false);
    };

    const handleDelete = async () => {
        try {
            const postResponse = await fetch(
                `/api/posts/post_comment/${commentIdToDelete}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-Token": csrfToken,
                    },
                }
            );

            if (postResponse.ok) {
                // fetchComments();
                const DeleteInsidePostTable = await fetch(
                    `/api/posts/posts/${postIdToDelete}`,
                    {
                        method: "DELETE",
                        headers: {
                            Accept: "application/json",
                            "X-CSRF-Token": csrfToken,
                        },
                    }
                );
                if (DeleteInsidePostTable.ok) {
                    fetchComments();
                } else {
                    console.error(
                        `Failed to delete post with ID ${postIdToDelete}.`
                    );
                }
            } else {
                console.error(
                    `Failed to delete post with ID ${commentIdToDelete}.`
                );
            }
        } catch (error) {
            console.error(
                `Error deleting post with ID ${commentIdToDelete}:`,
                error
            );
        } finally {
            setShowDeletePopup(false);
            setIsCommentPopupOpen(false);
        }
    };

    // Function to handle liking a post
    const handleLike = async (postId) => {
        try {
            const response = await axios.post(
                `/api/posts/posts/${postId}/like`
            );

            if ([200, 201, 204].includes(response.status)) {
                setLikedPosts((prevLikedPosts) => ({
                    ...prevLikedPosts,
                    [postId]: true,
                }));
                fetchComments();
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
                setLikedPosts((prevLikedPosts) => ({
                    ...prevLikedPosts,
                    [postId]: false,
                }));
                fetchComments();
            } else {
                console.error("Failed to unlike the post");
            }
        } catch (error) {
            console.error("Error unliking the post:", error);
        }
    };

    const isPostLikedByUser = (comment) => {
        return comment.likes && comment.likes.includes(loggedInUserId);
    };

    const handleLikesClick = (commentId) => {
        setSelectedCommentId(commentId);
        setShowLikesPopup(true);
    };

    // Function to render content with tags and mentions
    const renderContentWithTags = (content, mentions) => {
        const mentionData = mentions ? JSON.parse(mentions) : [];
        const mentionNames = mentionData.map((person) => person.name);

        // Regex to match mentions and URLs starting with https
        const tagRegex = new RegExp(
            mentionNames.map((name) => `@${name}`).join("|"),
            "g"
        );
        const urlRegex = /https:\/\/[^\s]+/g;

        // Replace content with mentions and URLs
        const replaceContent = (text) => {
            const combinedRegex = new RegExp(
                `(${urlRegex.source}|${tagRegex.source})`,
                "g"
            );

            const parts = text?.split(combinedRegex).filter(Boolean);

            return parts?.map((part, index) => {
                if (urlRegex.test(part)) {
                    return (
                        <a
                            href={part}
                            key={`url-${index}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                            }}
                        >
                            {part}
                        </a>
                    );
                }

                const mentionMatch = mentionNames.find(
                    (name) => `@${name}` === part
                );
                if (mentionMatch) {
                    const mention = mentionData.find(
                        (person) => `@${person.name}` === part
                    );
                    if (mention) {
                        return (
                            <span key={`mention-${index}`}>
                                <MentionedName
                                    name={mention.name}
                                    userId={mention.id}
                                />
                            </span>
                        );
                    }
                }

                return <span key={`text-${index}`}>{part}</span>;
            });
        };

        return replaceContent(content);
    };

    const { renderPoll, question } = usePolls(post, {
        refetchPost: fetchComments,
        loggedInUserId,
    });

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-[600px] mx-2 overflow-hidden max-h-[90vh] max-w-[90vw] flex flex-col">
                <div className="px-6 py-2 border-b">
                    <div className="flex flex-row w-full justify-between my-4">
                        <div className="w-full flex justify-center">
                            <span className="font-bold ml-14 text-2xl">
                                Post
                            </span>
                        </div>
                        <img
                            src="/assets/cancel.svg"
                            alt="Close icon"
                            className="w-6 h-6"
                            onClick={onClose}
                        />
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto">
                    <div className="my-4 px-6">
                        <header className="flex items-center">
                            <img
                                src={
                                    post.user.profile?.image
                                        ? post.user.profile.image ===
                                          "/assets/dummyStaffPlaceHolder.jpg"
                                            ? post.user.profile.image
                                            : post.user.profile.image.startsWith(
                                                    "avatar/"
                                                )
                                              ? `/storage/${post.user.profile.image}`
                                              : `/avatar/${post.user.profile.image}`
                                        : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
                                              post.user.name
                                          )}&rounded=true`
                                }
                                alt={post.user.name}
                                className="w-[53px] rounded-full"
                            />
                            <div className="relative ml-3 w-full">
                                <div className="flex-col text-lg">
                                    <div className="font-bold">
                                        {post.user.name || "Commenter"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatTimeAgo(post.created_at)}
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div className="mt-4">
                            <div className="text-lg mb-4">
                                <pre className="whitespace-pre-wrap max-w-full overflow-x-auto">
                                    {renderContentWithTags(
                                        post.content,
                                        post.mentions
                                    )}
                                </pre>
                            </div>
                            <PostAttachments attachments={post.attachments} />

                            {/* Poll Section */}
                            {post.type === "poll" && post.poll && (
                                <div className="mt-4 relative pb-[64px]">
                                    <div className="text-lg mb-4">
                                        <pre className="whitespace-pre-wrap max-w-full overflow-x-auto">
                                            {question}
                                        </pre>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {renderPoll()}
                                    </div>
                                </div>
                            )}
                            <hr className="my-6 border-1 border-gray-200" />
                        </div>
                    </div>

                    {/* Comment Section */}
                    <div className="pb-4 px-6">
                        <div className="space-y-4">
                            {comments.map((comment) => {
                                let likesCount = 0;
                                if (Array.isArray(comment.likes)) {
                                    likesCount = comment.likes.length;
                                }

                                const user =
                                    commentedUsers[comment.user_id] || {};

                                return (
                                    <div
                                        key={comment.id}
                                        className="relative flex items-start"
                                    >
                                        <img
                                            src={
                                                user.profileImage
                                                    ? user.profileImage ===
                                                      "/assets/dummyStaffPlaceHolder.jpg"
                                                        ? user.profileImage
                                                        : user.profileImage.startsWith(
                                                                "avatar/"
                                                            )
                                                          ? `/storage/${user.profileImage}`
                                                          : `/avatar/${user.profileImage}`
                                                    : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
                                                          user.name ||
                                                              "Commenter"
                                                      )}&rounded=true`
                                            }
                                            alt={user.name || "Commenter"}
                                            className="w-10 h-10 rounded-full mt-1"
                                        />
                                        <div className="relative ml-3 bg-gray-100 p-2 rounded-lg w-full">
                                            <div className="flex text-sm items-end mx-1">
                                                <span className="font-semibold">
                                                    {user.name || "Commenter"}
                                                </span>
                                                <span className="ml-2 text-xs mb-[1px] text-gray-500">
                                                    {formatTimeAgo(
                                                        comment.created_at
                                                    )}
                                                </span>
                                            </div>
                                            <div className="text-sm mt-1 mx-1">
                                                {renderContentWithTags(
                                                    comment.content,
                                                    comment.mentions
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mx-1 mt-2">
                                                {isPostLikedByUser(comment) ? (
                                                    <img
                                                        src="/assets/Like.svg"
                                                        alt="Unlike"
                                                        className="w-5 h-5 cursor-pointer"
                                                        onClick={() =>
                                                            handleUnlike(
                                                                comment.id
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <img
                                                        src="/assets/likeforposting.svg"
                                                        alt="Like"
                                                        className="w-5 h-5 cursor-pointer"
                                                        onClick={() =>
                                                            handleLike(
                                                                comment.id
                                                            )
                                                        }
                                                    />
                                                )}
                                                {likesCount > 0 && (
                                                    <span
                                                        className="text-sm font-medium cursor-pointer"
                                                        onClick={() =>
                                                            handleLikesClick(
                                                                comment.id
                                                            )
                                                        }
                                                    >
                                                        {likesCount}
                                                    </span>
                                                )}
                                            </div>
                                            <img
                                                loading="lazy"
                                                src="/assets/wallpost-dotbutton.svg"
                                                alt="Options"
                                                className="absolute top-2 right-4 w-5 h-5 cursor-pointer"
                                                onClick={() =>
                                                    handleClickTreeDots(
                                                        comment.id
                                                    )
                                                }
                                            />
                                        </div>
                                        {isCommentPopupOpen === comment.id &&
                                            (console.log(
                                                "COMMENT",
                                                comment.pivot
                                            ),
                                            (
                                                <div
                                                    className="absolute bg-white border-2 rounded-xl p-1 shadow-lg w-[160px] h-auto z-10 right-0 top-full -mt-10">
                                                    <p
                                                        className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                                                        onClick={() =>{
                                                            confirmDelete(
                                                                comment
                                                            )
                                                        }}
                                                    >
                                                        <img
                                                            className="w-6 h-6 mr-2"
                                                            src="/assets/deleteicon.svg"
                                                            alt="Delete"
                                                        />
                                                        Delete
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Fixed ShareYourThoughts Section */}
                <div className="py-4 border-t flex flex-row justify-between items-center w-full">
                    <img
                        src={
                            currentUser.profile?.image
                                ? currentUser.profile.image ===
                                  "/assets/dummyStaffPlaceHolder.jpg"
                                    ? currentUser.profile.image
                                    : currentUser.profile.image.startsWith(
                                            "avatar/"
                                        )
                                      ? `/storage/${currentUser.profile.image}`
                                      : `/avatar/${currentUser.profile.image}`
                                : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
                                      currentUser.name
                                  )}&rounded=true`
                        }
                        alt={currentUser.name}
                        className="w-[53px] rounded-full mx-4"
                    />
                    <ShareYourThoughts
                        variant="comment"
                        postedId={post.id}
                        onCommentPosted={fetchComments}
                    />
                </div>

                {showLikesPopup && (
                    <LikesPopup
                        likedUsers={likedUsers}
                        onClose={() => setShowLikesPopup(false)}
                        commentId={selectedCommentId}
                    />
                )}

                {showDeletePopup && (
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "20px",
                            boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
                            zIndex: 10000,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "200px",
                            maxWidth: "full",
                        }}
                    >
                        <div
                            style={{
                                marginBottom: "20px",
                                fontWeight: "bold",
                                fontSize: "larger",
                                borderRadius: "24px",
                            }}
                        >
                            <h2>Delete Comment?</h2>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <button
                                onClick={() => setShowDeletePopup(false)}
                                style={{
                                    backgroundColor: "white",
                                    color: "#333",
                                    border: "1px solid #ccc",
                                    borderRadius: "25px",
                                    width: "80px",
                                    padding: "10px 20px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                }}
                            >
                                No
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{
                                    backgroundColor: "#E53935",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "25px",
                                    width: "80px",
                                    padding: "10px 20px",
                                    cursor: "pointer",
                                }}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
