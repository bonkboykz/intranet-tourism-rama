import { useContext, useState } from "react";
import { useLayoutEffect } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { Emoji } from "react-emoji-render";
import { useClickAway } from "@uidotdev/usehooks";
import axios from "axios";
import { format, isSameDay } from "date-fns";
import { Volume2 } from "lucide-react";
import { Popover, Whisper } from "rsuite";

import { CommunityContext } from "@/Pages/CommunityContext";
import { DepartmentContext } from "@/Pages/DepartmentContext";
import { cn } from "@/Utils/cn";
import { formatTimeAgo } from "@/Utils/format";
import { useClickOutside } from "@/Utils/hooks/useClickOutside";
import { usePermissions } from "@/Utils/hooks/usePermissions";
import useUserData from "@/Utils/hooks/useUserData";
import { truncate } from "@/Utils/truncate";

import Comment from "../Comment";
import { DeletePopup } from "../DeletePopup";
import EditPost from "../EditPost";
import LikesPopup from "../LikesPopup";
import MentionedName from "../MentionedName";
import PostAttachments from "../PostAttachments";
import { UserProfileAvatar } from "../UserProfileAvatar";
import { WallContext } from "../WallContext";
import { CardHeader } from "./CardHeader/CardHeader";
import { CardImage } from "./CardImage/CardImage";
import { Comments } from "./Comments/Comments";
import { Likes } from "./Likes/Likes";
import { PostDetails } from "./PostDetails/PostDetails";

import "rsuite/dist/rsuite-no-reset.min.css";

function EventTag({ event }) {
    const events = useMemo(() => {
        return JSON.parse(event);
    }, [event]);

    const [eventDetails, setEventDetails] = useState({});

    const fetchEventDetails = async () => {
        try {
            const data = (
                await Promise.all(
                    events.map(async (event) => {
                        const response = await axios.get(
                            `/api/events/events/${event.id}`
                        );

                        return response.data.data;
                    })
                )
            ).reduce((acc, event) => {
                acc[event.id] = event;
                return acc;
            }, {});

            setEventDetails(data);
        } catch (error) {
            console.error("Error fetching event details:", error);
        }
    };

    useEffect(() => {
        if (events.length <= 0) {
            return;
        }

        fetchEventDetails();
    }, [events]);

    if (events.length <= 0) {
        return null;
    }

    return (
        <div className="flex gap-2">
            {events.map((event) => {
                return (
                    <Whisper
                        placement="top"
                        trigger="hover"
                        enterable
                        key={event.id}
                        speaker={
                            <Popover
                                arrow={false}
                                style={{
                                    borderRadius: 10,
                                }}
                            >
                                {eventDetails[event.id] && (
                                    <div className="p-2">
                                        <div className="text-sm font-semibold text-primary">
                                            {eventDetails[event.id].title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {format(
                                                new Date(
                                                    eventDetails[
                                                        event.id
                                                    ].start_at
                                                ),
                                                "dd.MM.yyyy"
                                            )}
                                            {eventDetails[event.id].end_at &&
                                                !isSameDay(
                                                    new Date(
                                                        eventDetails.start_at
                                                    ),
                                                    new Date(
                                                        eventDetails.end_at
                                                    )
                                                ) &&
                                                ` – ${format(
                                                    new Date(
                                                        eventDetails[
                                                            event.id
                                                        ].end_at
                                                    ),
                                                    "dd.MM.yyyy"
                                                )}`}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {eventDetails[event.id].location}
                                        </div>
                                        <div>
                                            {truncate(
                                                eventDetails[event.id]
                                                    .description,
                                                50
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Popover>
                        }
                    >
                        <div className="px-2 py-0 rounded-md bg-red-100">
                            <p className="mt-0 text-xs font-semibold leading-6 text-secondary max-md:max-w-full cursor-pointer">
                                {event.title}
                            </p>
                        </div>
                    </Whisper>
                );
            })}
        </div>
    );
}

const renderContentWithTags = (content, mentions) => {
    if (!content) {
        return null; // or return <></> for an empty fragment
    }

    const mentionData = mentions ? JSON.parse(mentions) : [];
    const mentionNames = mentionData.map((person) => person.name);
    const tagRegex = new RegExp(`@(${mentionNames.join("|")})\\b`, "g");
    const urlRegex = /https:\/\/[^\s]+/g;
    const combinedRegex = new RegExp(
        `(${urlRegex.source}|${tagRegex.source})`,
        "g"
    );

    const replaceContent = (text) => {
        const parts = text.split(combinedRegex).filter(Boolean);
        const renderedParts = [];

        for (let index = 0; index < parts.length; index++) {
            const part = parts[index];

            if (urlRegex.test(part)) {
                renderedParts.push(
                    <a
                        href={part}
                        key={`url-${index}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="emoji-text"
                        style={{ color: "blue", textDecoration: "underline" }}
                    >
                        {part}
                    </a>
                );
            } else if (index === 0 || !parts[index - 1].startsWith("@")) {
                const mentionMatch = mentionData.find(
                    (person) => `@${person.name}` === part
                );
                if (mentionMatch) {
                    renderedParts.push(
                        <MentionedName
                            key={`mention-${mentionMatch.id}-${index}`}
                            name={mentionMatch.name}
                            userId={mentionMatch.id}
                        />
                    );
                } else {
                    renderedParts.push(part);
                }
            }
        }

        return renderedParts;
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
                        "user.profile",
                        "attachments",
                        "accessibilities",
                        "likes",
                        "comments",
                        "albums",
                        "community",
                        "department",
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

            if (!post.id) {
                console.error(`Post with ID ${post.id} not found.`);
                return;
            }

            // If the post has accessibilities, delete them first
            if (
                postToDelete.accessibilities &&
                postToDelete.accessibilities.length > 0
            ) {
                for (const accessibility of postToDelete.accessibilities) {
                    const response = await axios.delete(
                        `/api/posts/post_accessibilities/${accessibility.id}`
                    );

                    if (![200, 201, 204].includes(response.status)) {
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
                    const response = await axios.delete(
                        `/api/posts/post_comment/${comment.pivot.id}`
                    );

                    if ([200, 201, 204].includes(response.status)) {
                        // console.error(`Failed to delete comment with ID ${comment.pivot.id}.`);
                        const response = await axios.delete(
                            `/api/posts/posts/${comment.pivot.comment_id}`
                        );

                        if (![200, 201, 204].includes(response.status)) {
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
                console.error(`Failed to delete post with ID ${post.id}.`);
            }
        } catch (error) {
            console.error(`Error deleting post with ID ${post.id}:`, error);
        } finally {
            setShowDetails(false);
            setShowDeletePopup(false);
        }
    };

    const handleAnnouncement = async (post) => {
        try {
            const response = await axios.put(
                `/api/posts/${post.id}/${
                    post.announced ? "unannounce" : "announce"
                }`
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to announce post");
            }

            setShowDetails(false);
            refetchPost();
        } catch (error) {
            console.error("Error announcing post:", error);
        }
    };

    const renderBirhdayPost = () => {
        return (
            <>
                {!cachedPost.attachments ||
                cachedPost.attachments.length === 0 ? (
                    <>
                        <div>
                            <div className="whitespace-pre-wrap break-all overflow-hidden">
                                {cachedPost.content}
                            </div>
                        </div>
                        <p className="mt-0 text-xs font-semibold leading-6 text-primary max-md:max-w-full">
                            {cachedPost.mentions
                                ? JSON.parse(cachedPost.mentions)
                                      .map((mention) => mention.name)
                                      .join(", ")
                                : ""}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="mt-0 text-xs font-semibold leading-6 text-primary max-md:max-w-full">
                            {cachedPost.mentions
                                ? JSON.parse(cachedPost.mentions)
                                      .map((mention) => mention.name)
                                      .join(", ")
                                : ""}
                        </p>
                        <div className="relative flex flex-wrap gap-2 mt-4">
                            {cachedPost.attachments.map((attachment, idx) => (
                                <div key={idx} className="relative w-full">
                                    <img
                                        src={`/storage/${attachment.path}`}
                                        alt={`Attachment ${idx + 1}`}
                                        className="rounded-xl w-full h-auto object-cover"
                                        style={{ maxHeight: "300px" }}
                                    />
                                    {idx ===
                                        Math.floor(
                                            cachedPost.attachments.length / 2
                                        ) && (
                                        <div className="absolute inset-0 flex justify-center items-center p-4">
                                            <span
                                                className="text-5xl font-black text-center emoji-text  text-white text-opacity-90 bg-black bg-opacity-50 rounded-lg"
                                                style={{
                                                    maxWidth: "90%",
                                                    overflowWrap: "break-word",
                                                    wordWrap: "break-word",
                                                }}
                                            >
                                                {cachedPost.content}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </>
        );
    };

    const renderOtherPost = () => {
        return (
            <>
                <article className="post-content">
                    <div className="whitespace-pre-wrap break-all overflow-hidden">
                        {renderContentWithTags(
                            cachedPost.content,
                            cachedPost.mentions
                        )}
                    </div>
                </article>

                <PostAttachments attachments={cachedPost.attachments} />
                <p className="taging px-2 py-0 bg-blue-100 rounded-md my-2 text-xs font-semibold leading-6 text-primary max-md:max-w-full">
                    {/* {cachedPost.tag?.replace(/[\[\]"]/g, "") || ""} */}
                    {cachedPost.albums?.map((album) => album.name).join(", ")}
                </p>
                {cachedPost.event && <EventTag event={cachedPost.event} />}
            </>
        );
    };

    const { hasRole } = usePermissions();

    const { isAdmin: isCommunityAdmin } = useContext(CommunityContext);
    const { isAdmin: isDepartmentAdmin } = useContext(DepartmentContext);

    const canEdit =
        cachedPost.user_id === loggedInUserId ||
        hasRole("superadmin") ||
        isCommunityAdmin ||
        isDepartmentAdmin;

    const userData = useUserData();

    const { buttonRef, popupRef, modalRef } = useClickOutside(() => {
        setShowDetails(false);
        setShowModal(false);
    });

    if (isDeleted) {
        return null;
    }

    return (
        <>
            <article
                className={cn(
                    // cachedPost.type === "announcement" ? "-mt-16" : "mt-10",
                    variant === "department"
                        ? "w-full max-w-[700px]"
                        : "w-full max-w-[700px]",
                    "mt-10 p-4 rounded-2xl bg-white border-2 shadow-xl w-full z-5 relative",
                    cachedPost.announced &&
                        (cachedPost.community_id || cachedPost.department_id
                            ? "relative pt-20"
                            : "relative pt-16")
                )}
            >
                {cachedPost.announced && (
                    <div
                        className="absolute w-full top-0 left-0  bg-secondary h-14 rounded-t-2xl pl-6"
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
                                    <img
                                        ref={buttonRef}
                                        loading="lazy"
                                        src="/assets/wallpost-dotbutton.svg"
                                        alt="Options"
                                        className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer mt-1"
                                        onClick={() =>
                                            setShowDetails(!showDetails)
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {showDetails && canEdit && (
                        <PostDetails
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
                        />
                    )}
                </header>

                {cachedPost.type === "birthday"
                    ? renderBirhdayPost()
                    : renderOtherPost()}

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
                        <div
                            className="relative bg-white py-6 px-4 max-h-screen min-h-[auto] lg:my-8 rounded-2xl shadow-lg w-[500px] max-md:w-[300px]"
                            ref={modalRef}
                        >
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
                            name: userData?.name,
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
                        postId={cachedPost.id}
                    />,
                    document.body
                )}
        </>
    );
}
