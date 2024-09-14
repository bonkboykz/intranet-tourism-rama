import { useState } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { CardHeader } from "@/Components/Reusable/WallPosting/DefaultPostCard/CardHeader/CardHeader";
import { CardImage } from "@/Components/Reusable/WallPosting/DefaultPostCard/CardImage/CardImage";
import { PostDetails } from "@/Components/Reusable/WallPosting/DefaultPostCard/PostDetails/PostDetails";
import { DeletePopup } from "@/Components/Reusable/WallPosting/DeletePopup";
import EditPost from "@/Components/Reusable/WallPosting/EditPost";
import { useUser } from "@/Layouts/useUser";
import { cn } from "@/Utils/cn";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import Feedback from "./Feedback";

function PollOptionAnswered({ option, percentage }) {
    return (
        <div className="flex gap-5 mt-3 text-md leading-5 text-neutral-800 max-md:flex-wrap min-h-12">
            <div
                className={cn(
                    `flex flex-auto gap-3 px-4   bg-gray-100 rounded-3xl max-md:flex-wrap items-center  transition `
                )}
            >
                <div className="shrink-0 bg-white rounded-full h-[13px] w-[13px]" />
                <button
                    disabled
                    className="py-2 flex-auto outline-none border-none  text-start "
                >
                    {option}
                </button>

                <div className="flex gap-2">
                    <div>{percentage.toFixed(2)}%</div>
                </div>
            </div>
        </div>
    );
}

export function PollCard({ post }) {
    const [cachedPost, setCachedPost] = useState(post);
    const [showDetails, setShowDetails] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const { hasRole } = usePermissions();

    const { user } = useUser();

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
                        "albums",
                        "poll",
                        "poll.question",
                        "poll.question.options",
                    ],
                },
            });

            const userProfileData = await axios.get(
                `/api/users/users/${post.user_id}`,
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

    const canEdit = cachedPost.user_id === user.id || hasRole("superadmin");

    const poll = cachedPost.poll;

    const [loading, setLoading] = useState(false);

    const [results, setResults] = useState({});

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `/api/posts/posts/${post.id}/calculatePollResults`
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to calculate poll results");
            }

            const responseData = response.data.data;

            setResults(responseData);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchResults();
    }, []);

    if (!post.poll) {
        return null;
    }

    const [showFeedback, setShowFeedback] = useState(false);
    const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/posts/posts/${post.id}`);

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to delete post");
            }

            setShowDeletePopup(false);
            refetchPost();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const renderPollResults = () => {
        if (!results || !results.percentages) {
            return null;
        }

        console.log("results", results);

        const percentagesMap = results.percentages?.reduce((acc, cur) => {
            acc[cur.option_id] = cur.percentage;
            return acc;
        }, {});

        return (
            <>
                <div className="flex flex-col gap-1 max-h-50 overflow-y-auto">
                    {poll.question?.options?.map((option, index) => (
                        <PollOptionAnswered
                            key={index}
                            option={option.option_text}
                            percentage={percentagesMap[option.id] ?? 0}
                        />
                    ))}
                </div>

                <div className="flex w-full justify-between mt-4 px-1">
                    <div>
                        <button
                            className="bg-[#FF5437] text-white px-4 py-2 rounded-lg"
                            onClick={() => {
                                setShowFeedback(!showFeedback);
                            }}
                        >
                            {showFeedback ? "Hide" : "Show"} Feedback
                        </button>
                    </div>
                    <div
                        className=" text-[#FF5437]"
                        style={{
                            fontSize: 22,
                        }}
                    >
                        Total votes: {results.total_count_of_votes}
                    </div>
                </div>
            </>
        );
    };

    if (loading) {
        return (
            <div>
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <article
                className={cn(
                    // cachedPost.type === "announcement" ? "-mt-16" : "mt-10",
                    "w-full lg:w-full max-w-[900px]",
                    "mt-10 p-4 rounded-2xl bg-white border-2 shadow-xl w-full relative"
                )}
            >
                <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full">
                    <div className="mt-4 flex flex-col justify-between items-start px-1 w-full mb-4 p-2 -ml-2">
                        <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
                            <CardImage post={cachedPost} />
                            <div className="flex items-center gap-2">
                                {canEdit && (
                                    <img
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
                            onEdit={() => {
                                setShowDetails(false);
                                setShowModal(true);
                            }}
                            onDelete={() => setShowDeletePopup(true)}
                        />
                    )}
                </header>

                <div>{poll.question?.question_text}</div>

                {renderPollResults()}

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
                                    loggedInUserId={user.id}
                                    onClose={() => setShowModal(false)}
                                    onClosePopup={() => {}}
                                    refetchPost={refetchPost}
                                />
                            </div>
                        </div>,
                        document.body
                    )}
            </article>

            {showFeedback && (
                <div className="mt-8">
                    <Feedback
                        postId={post.id}
                        onClose={() => setShowFeedback(false)}
                    />
                </div>
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
        </>
    );
}
