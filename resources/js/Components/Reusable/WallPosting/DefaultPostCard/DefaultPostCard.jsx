import { useContext, useState } from "react";
import axios from "axios";

import { formatTimeAgo } from "@/Utils/format";

import MentionedName from "../MentionedName";
import { cn } from "@/Utils/cn";
import { WallContext } from "../WallContext";
import { Likes } from "./Likes/Likes";
import { Comments } from "./Comments/Comments";
import { PostDetails } from "./PostDetails/PostDetails";
import PostAttachments from "../PostAttachments";
import { createPortal } from "react-dom";
import EditPost from "../EditPost";
import { UserProfileAvatar } from "../UserProfileAvatar";
import Comment from "../Comment";
import { useLayoutEffect } from "react";
import { DeletePopup } from "../DeletePopup";
import LikesPopup from "../LikesPopup";
import { CardHeader } from "./CardHeader/CardHeader";
import { CardImage } from "./CardImage/CardImage";
import { Volume2 } from "lucide-react";

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
                        <MentionedName
                            key={`mention-${index}`}
                            name={mention.name}
                            userId={mention.id}
                        />
                    );
                }
            }

            return part;
        });
    };

    return replaceContent(content);
};

export function DefaultPostCard({ post }) {
    const { variant, loggedInUserId } = useContext(WallContext);

    const [cachedPost, setCachedPost] = useState(post);

    const refetchPost = async () => {
        try {
            const {
                data: { data: updatedPost },
            } = await axios.get(`/api/posts/posts/${post.id}`, {
                params: {
                    with: [
                        "user",
                        "attachments",
                        "accessibilities",
                        "likes",
                        "comments",
                    ],
                },
            });

            const userProfileData = await axios.get(
                `/api/users/users/${post.user_id}?with[]=profile`,
                {
                    params: {
                        with: ["profile"],
                    },
                }
            );
            updatedPost.userProfile = userProfileData.data;

            updatedPost.attachments = Array.isArray(updatedPost.attachments)
                ? updatedPost.attachments
                : [updatedPost.attachments];

            setCachedPost(updatedPost);
        } catch (error) {
            console.error(error);
        }
    };

    const [showDetails, setShowDetails] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showLikesPopup, setShowLikesPopup] = useState(false);

    useLayoutEffect(() => {
        if (
            !showModal &&
            !showCommentsModal &&
            !showDeletePopup &&
            !showLikesPopup
        ) {
            document.body.style.overflow = "auto";
            return;
        }

        document.body.style.overflow = "hidden";
    }, [showModal, showCommentsModal, showDeletePopup, showLikesPopup]);

    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = async () => {
        try {
            // Fetch the post to check if it has accessibilities
            const postToDelete = post;

            // console.log("LLLL", postToDelete.comments.pivot.id);
            //   postToDelete.comments.forEach(comment => {
            //     console.log("LLLL", comment.pivot.comment_id);
            // });

            if (!postToDelete) {
                console.error(`Post with ID ${postIdToDelete} not found.`);
                return;
            }

            // If the post has accessibilities, delete them first
            if (
                postToDelete.accessibilities &&
                postToDelete.accessibilities.length > 0
            ) {
                for (const accessibility of postToDelete.accessibilities) {
                    const response = await fetch(
                        `/api/posts/post_accessibilities/${accessibility.id}`,
                        {
                            method: "DELETE",
                            headers: {
                                Accept: "application/json",
                                "X-CSRF-Token": csrfToken,
                            },
                        }
                    );

                    if (!response.ok) {
                        console.error(
                            `Failed to delete accessibility with ID ${accessibility.id}.`
                        );
                        return;
                    }
                }
            }

            // If the post has comments, delete them first
            if (postToDelete.comments && postToDelete.comments.length > 0) {
                for (const comment of postToDelete.comments) {
                    const response = await fetch(
                        `/api/posts/post_comment/${comment.pivot.id}`,
                        {
                            method: "DELETE",
                            headers: {
                                Accept: "application/json",
                                "X-CSRF-Token": csrfToken,
                            },
                        }
                    );

                    if (response.ok) {
                        // console.error(`Failed to delete comment with ID ${comment.pivot.id}.`);
                        const response = await fetch(
                            `/api/posts/posts/${comment.pivot.comment_id}`,
                            {
                                method: "DELETE",
                                headers: {
                                    Accept: "application/json",
                                    "X-CSRF-Token": csrfToken,
                                },
                            }
                        );

                        if (!response.ok) {
                            console.error(
                                `Failed to delete comment with ID ${comment.pivot.comment_id}.`
                            );
                            return;
                        }
                        // return;
                    }
                }
            }

            // Now delete the post
            const postResponse = await axios.delete(
                `/api/posts/posts/${post.id}`
            );

            if ([200, 204].includes(postResponse.status)) {
                setIsDeleted(true);
            } else {
                console.error(
                    `Failed to delete post with ID ${postIdToDelete}.`
                );
            }
        } catch (error) {
            console.error(
                `Error deleting post with ID ${postIdToDelete}:`,
                error
            );
        } finally {
            setShowDetails(false);
            setShowDeletePopup(false);
        }
    };

    const handleAnnouncement = async (post) => {
        try {
            const newType =
                post.type === "announcement" ? "post" : "announcement";
            const response = await axios.put(`/api/posts/posts/${post.id}`, {
                type: newType,
                user_id: String(post.user.id),
                visibility: "public",
            });

            if (response.ok) {
                setShowDetails(false);
                refetchPost();
            } else {
                console.error("Failed to update post type");
            }
        } catch (error) {
            console.error("Error updating post type:", error);
        }
    };

    if (isDeleted) {
        return null;
    }

    return (
        <>
            <article
                className={cn(
                    // cachedPost.type === "announcement" ? "-mt-16" : "mt-10",
                    variant === "department"
                        ? "w-full lg:w-[610px] md:w-[610px] sm:w-[610px]"
                        : "w-full lg:w-full md:w-[610px] sm:w-[610px]",
                    "mt-10 p-4 rounded-2xl bg-white border-2 shadow-xl w-full lg:w-[610px] md:w-[610px] sm:w-[610px] z-5 relative",
                    cachedPost.announced &&
                        (cachedPost.community_id || cachedPost.department_id
                            ? "relative pt-20"
                            : "relative pt-16")
                )}
            >
                {cachedPost.announced && (
                    <div className="absolute w-full top-0 left-0  bg-[#FF5437] h-14 rounded-t-2xl  pl-6">
                        <div className="flex items-center gap-1 w-full h-full">
                            <Volume2 className="w-6 h-6 text-white" />
                            <div className="text-white text-center font-bold text-lg	ml-2">
                                Announcement
                            </div>
                        </div>
                    </div>
                )}
                <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full">
                    <div className="flex gap-1 mt-2"></div>
                    <div className="flex flex-col justify-between items-start px-1 w-full mb-4 p-2 -ml-2 -mt-3">
                        <CardHeader post={cachedPost} />
                        <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
                            <CardImage post={cachedPost} />
                            <div className="flex items-center gap-2">
                                <img
                                    loading="lazy"
                                    src="/assets/wallpost-dotbutton.svg"
                                    alt="Options"
                                    className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer mt-1"
                                    onClick={() => setShowDetails(!showDetails)}
                                />
                            </div>
                        </div>
                    </div>

                    {showDetails && (
                        <PostDetails
                            onEdit={() => {
                                setShowDetails(false);
                                setShowModal(true);
                            }}
                            onDelete={() => setShowDeletePopup(true)}
                            onAnnouncement={() =>
                                handleAnnouncement(cachedPost)
                            }
                        />
                    )}
                </header>

                <article className="post-content">
                    {renderContentWithTags(
                        cachedPost.content,
                        cachedPost.mentions
                    )}
                </article>

                <p className="taging mt-0 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                    {cachedPost.tag?.replace(/[\[\]"]/g, "") || ""}
                </p>

                <p className="mt-0 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                    {cachedPost.event?.replace(/[\[\]"]/g, "") || ""}
                </p>
                <PostAttachments attachments={post.attachments} />
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                        <Likes
                            likes={
                                Array.isArray(cachedPost.likes)
                                    ? cachedPost.likes
                                    : []
                            }
                            loggedInUserId={loggedInUserId}
                            postId={post.id}
                            onLike={refetchPost}
                            onUnlike={refetchPost}
                            onLikesClick={() => {
                                setShowLikesPopup(true);
                            }}
                        />
                    </div>
                    <Comments
                        comments={
                            Array.isArray(cachedPost.comments)
                                ? cachedPost.comments
                                : []
                        }
                        variant={variant}
                        onCommentsOpen={() => setShowCommentsModal(true)}
                    />
                </div>
            </article>

            {showModal &&
                createPortal(
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div
                            className="absolute top-0 left-0 w-full h-full bg-black opacity-50"
                            onClick={() => setShowModal(false)}
                        ></div>
                        <div className="relative bg-white py-6 px-4 max-h-screen min-h-[auto] lg:my-8 rounded-2xl shadow-lg w-[500px] max-md:w-[300px]">
                            <EditPost
                                post={cachedPost}
                                loggedInUserId={loggedInUserId}
                                onClose={() => setShowModal(false)}
                                onClosePopup={() => {}}
                                refetchPost={refetchPost}
                            />
                        </div>
                    </div>,
                    document.body
                )}

            {showCommentsModal &&
                createPortal(
                    <Comment
                        post={cachedPost}
                        onClose={() => setShowCommentsModal(false)}
                        loggedInUserId={loggedInUserId}
                        PostLikesCount={cachedPost.likes?.lenght || 0}
                        currentUser={{
                            id: loggedInUserId,
                            name: cachedPost.user.name,
                            profile: {
                                image: cachedPost.userProfile?.profile?.image,
                            },
                        }}
                    />,
                    document.body
                )}

            {showDeletePopup &&
                createPortal(
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div
                            className="absolute top-0 left-0 w-full h-full bg-black opacity-50"
                            onClick={() => setShowDeletePopup(false)}
                        ></div>
                        <DeletePopup
                            onClose={() => setShowDeletePopup(false)}
                            onDelete={handleDelete}
                        />
                    </div>,
                    document.body
                )}

            {showLikesPopup &&
                createPortal(
                    <LikesPopup
                        onClose={() => setShowLikesPopup(false)}
                        postId={cachedPost.id}
                    />,
                    document.body
                )}
        </>
    );
}
