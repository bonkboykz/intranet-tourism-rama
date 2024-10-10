import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Volume2 } from "lucide-react";

import { CommunityContext } from "@/Pages/CommunityContext";
import { DepartmentContext } from "@/Pages/DepartmentContext";
import { cn } from "@/Utils/cn";
import { useClickOutside } from "@/Utils/hooks/useClickOutside";
import { usePermissions } from "@/Utils/hooks/usePermissions";
import useUserData from "@/Utils/hooks/useUserData";
import { toastError } from "@/Utils/toast";

import Comment from "../Comment";
import { CardHeader } from "../DefaultPostCard/CardHeader/CardHeader";
import { CardImage } from "../DefaultPostCard/CardImage/CardImage";
import { Comments } from "../DefaultPostCard/Comments/Comments";
import { Likes } from "../DefaultPostCard/Likes/Likes";
import { DeletePopup } from "../DeletePopup";
import LikesPopup from "../LikesPopup";
import { WallContext } from "../WallContext";
import { EditPollPost } from "./EditPost";
import { PostDetails } from "./PostDetails/PostDetails";
import { usePolls } from "./usePolls";

export function PollPostCard({ post }) {
    const [cachedPost, setCachedPost] = useState(post);
    const [showDetails, setShowDetails] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const { variant, loggedInUserId } = useContext(WallContext);

    const refetchPost = async () => {
        try {
            const {
                data: { data: updatedPost },
            } = await axios.get(`/api/posts/posts/${post.id}`, {
                params: {
                    with: [
                        "user.profile",
                        "attachments",
                        "accessibilities",
                        "likes",
                        "comments",
                        "albums",
                        "poll",
                        "poll.question",
                        "poll.question.options",
                        "poll.feedbacks",
                    ],
                },
            });

            updatedPost.attachments = Array.isArray(updatedPost.attachments)
                ? updatedPost.attachments
                : [updatedPost.attachments];

            setCachedPost(updatedPost);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAnnouncement = async (post) => {
        try {
            const response = await axios.put(`/api/posts/posts/${post.id}`, {
                announced: !post.announced,
                user_id: String(post.user.id),
                visibility: "public",
            });

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to announce post");
            }

            setShowDetails(false);
            refetchPost();
        } catch (error) {
            console.error("Error announcing post:", error);
        }
    };

    const { hasRole } = usePermissions();

    const { isAdmin: isCommunityAdmin } = useContext(CommunityContext);
    const { isAdmin: isDepartmentAdmin } = useContext(DepartmentContext);

    const canEdit =
        cachedPost.user_id === loggedInUserId ||
        hasRole("superadmin") ||
        isCommunityAdmin ||
        isDepartmentAdmin;

    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/posts/posts/${post.id}`);

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to delete post");
            }

            setShowDeletePopup(false);

            setIsDeleted(true);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleClosePoll = async (post) => {
        try {
            const response = await axios.put(
                `/api/posts/${post.id}/close-poll`
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to close poll");
            }

            refetchPost();
        } catch (error) {
            console.error("Error closing poll:", error);
            toastError("Failed to close poll");
        }
    };

    const handleExportPoll = async (post) => {
        try {
            const response = await axios.get(
                `/api/posts/${post.id}/export-poll`,
                {
                    responseType: "blob",
                }
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Error generating PDF");
            }

            // Create a Blob from the response and trigger a download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            // open in new page
            // window.open(url, "_blank");
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `poll_results_${post.poll.id}.pdf`); // Set the file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Poll exported successfully");
        } catch (error) {
            console.error("Error generating PDF:", error);

            toastError("Error generating PDF");
        }
    };

    const [showCommentsModal, setShowCommentsModal] = useState(false);

    const [showLikesPopup, setShowLikesPopup] = useState(false);

    const userData = useUserData();

    const { buttonRef, popupRef, modalRef } = useClickOutside(() => {
        setShowDetails(false);
        setShowModal(false);
    });

    const { renderPoll, question } = usePolls(cachedPost, {
        refetchPost,
        loggedInUserId,
    });

    if (!post.poll) {
        return null;
    }

    if (isDeleted) {
        return null;
    }

    return (
        <>
            <article
                className={cn(
                    // cachedPost.type === "announcement" ? "-mt-16" : "mt-10",
                    "w-full max-w-[700px]",
                    "mt-10 p-4 rounded-2xl bg-white border-2 shadow-xl w-full max-w-[700px] z-5 relative",
                    cachedPost.announced &&
                        (cachedPost.community_id || cachedPost.department_id
                            ? "relative pt-20"
                            : "relative pt-16")
                )}
            >
                {cachedPost.announced && (
                    <div
                        className="absolute w-full top-0 left-0  bg-secondary h-14 rounded-t-2xl  pl-6"
                        style={{
                            top: -2,
                            width: "calc(100% + 2px)",
                            left: -1,
                        }}
                    >
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
                                {canEdit && (
                                    <>
                                        <img
                                            ref={buttonRef}
                                            loading="lazy"
                                            src="/assets/icon_poll_card_threedots.svg"
                                            alt="Options"
                                            className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer mt-1"
                                            onClick={() =>
                                                setShowDetails(!showDetails)
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {showDetails && canEdit && (
                        <PostDetails
                            isClosed={
                                cachedPost.poll.end_date &&
                                new Date(cachedPost.poll.end_date) < new Date()
                            }
                            popupRef={popupRef}
                            onEdit={() => {
                                setShowDetails(false);
                                setShowModal(true);
                            }}
                            onDelete={() => {
                                setShowDetails(false);
                                setShowDeletePopup(true);
                            }}
                            onAnnouncement={() =>
                                handleAnnouncement(cachedPost)
                            }
                            isAnnounced={cachedPost.announced}
                            onClose={() => {
                                setShowDetails(false);
                                handleClosePoll(cachedPost);
                            }}
                            onExport={() => {
                                setShowDetails(false);
                                handleExportPoll(cachedPost);
                            }}
                        />
                    )}
                </header>

                <div className="break-words overflow-hidden">{question}</div>

                {renderPoll()}

                {showModal &&
                    createPortal(
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div
                                className="absolute top-0 left-0 w-full h-full bg-black opacity-50"
                                onClick={() => setShowModal(false)}
                            ></div>
                            <div
                                className="relative bg-white py-6 px-4 max-h-screen min-h-[auto] lg:my-8 rounded-2xl shadow-lg w-[500px] max-md:w-[300px]"
                                ref={modalRef}
                            >
                                <EditPollPost
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

                <div className="flex items-center gap-4 mt-4">
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
            {showCommentsModal &&
                createPortal(
                    <Comment
                        post={cachedPost}
                        onClose={() => setShowCommentsModal(false)}
                        loggedInUserId={loggedInUserId}
                        PostLikesCount={cachedPost.likes?.lenght || 0}
                        currentUser={{
                            id: loggedInUserId,
                            name: userData.name,
                            profile: {
                                image: userData?.profile?.image,
                            },
                        }}
                        onCommentPosted={refetchPost}
                        onCommentDeleted={refetchPost}
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
                            modalRef={modalRef}
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
                        postId={post.id}
                    />,
                    document.body
                )}
        </>
    );
}
