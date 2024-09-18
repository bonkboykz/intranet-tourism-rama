import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

import { CommunityContext } from "@/Pages/CommunityContext";
import { DepartmentContext } from "@/Pages/DepartmentContext";
import { cn } from "@/Utils/cn";
import { usePermissions } from "@/Utils/hooks/usePermissions";
import useUserData from "@/Utils/hooks/useUserData";

import Comment from "../Comment";
import { CardHeader } from "../DefaultPostCard/CardHeader/CardHeader";
import { CardImage } from "../DefaultPostCard/CardImage/CardImage";
import { Comments } from "../DefaultPostCard/Comments/Comments";
import { Likes } from "../DefaultPostCard/Likes/Likes";
import { PostDetails } from "../DefaultPostCard/PostDetails/PostDetails";
import { DeletePopup } from "../DeletePopup";
import EditPost from "../EditPost";
import LikesPopup from "../LikesPopup";
import { WallContext } from "../WallContext";

function PollOption({ option, onClick, selected, disabled }) {
    return (
        <div className="flex gap-5 mt-3 text-md leading-5 text-neutral-800 max-md:flex-wrap min-h-12">
            <div
                className={cn(
                    `flex flex-auto gap-3 px-4   bg-gray-100 rounded-3xl max-md:flex-wrap items-center  transition `,
                    selected && "bg-[#4880FF] text-white",
                    disabled && "opacity-60"
                )}
            >
                <div className="shrink-0 bg-white rounded-full h-[13px] w-[13px]" />
                <button
                    disabled={disabled}
                    onClick={onClick}
                    className="py-2 flex-auto outline-none border-none cursor-pointer text-start disabled:cursor-default"
                >
                    {option}
                </button>
            </div>
        </div>
    );
}

function PollOptionAnswered({ option, selected, percentage }) {
    return (
        <div className="flex gap-5 mt-3 text-md leading-5 text-neutral-800 max-md:flex-wrap min-h-12">
            <div
                className={cn(
                    `flex flex-auto gap-3 px-4   bg-gray-100 rounded-3xl max-md:flex-wrap items-center  transition `,
                    selected && "bg-[#4880FF] text-white"
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
                    ],
                },
            });

            // const userProfileData = await axios.get(
            //     `/api/users/users/${post.user_id}`,
            //     {
            //         params: {
            //             with: ["profile"],
            //         },
            //     }
            // );
            // updatedPost.userProfile = userProfileData.data;

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
                announced: true,
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

    const [feedbackText, setFeedbackText] = useState("");
    const [chosenAnswers, setChosenAnswers] = useState([]);

    const poll = cachedPost.poll;

    const isSingleChoice = poll?.question?.question_type === "single";

    const noMoreOptions = isSingleChoice && chosenAnswers.length >= 1;

    const onClick = (option) => {
        if (chosenAnswers.includes(option.id)) {
            setChosenAnswers(chosenAnswers.filter((x) => x !== option.id));
        } else if (!noMoreOptions) {
            setChosenAnswers([...chosenAnswers, option.id]);
        }
    };

    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        setLoading(true);

        const formData = new FormData();

        if (feedbackText.trim() !== "") {
            formData.append("feedbackText", feedbackText.trim());
        }

        chosenAnswers.forEach((answer, index) => {
            formData.append(`option_ids[${index}]`, answer);
        });

        formData.append("poll_id", poll.id);

        try {
            const response = await axios.post(
                `/api/posts/posts/${post.id}/submitPollResponse`,
                formData
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to submit poll response");
            }

            const responseData = response.data.data;

            setPreviousResponse(responseData);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const [loadingAnswered, setLoadingAnswered] = useState(false);
    const [previousResponse, setPreviousResponse] = useState(null);

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

    const fetchAnswered = async () => {
        setLoadingAnswered(true);
        try {
            const response = await axios.post(
                `/api/posts/posts/${post.id}/haveAnsweredPoll`
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to check if user has answered poll");
            }

            const previousResponse = response.data.data;

            setPreviousResponse(previousResponse);
        } catch (e) {
            console.error(e);
        }

        setLoadingAnswered(false);
    };

    useEffect(() => {
        fetchResults();
        fetchAnswered();
    }, []);

    useEffect(() => {
        fetchResults();
    }, [previousResponse]);

    if (!post.poll) {
        return null;
    }

    const renderPollResults = () => {
        const answers = previousResponse?.answers ?? [];

        const percentagesMap = results.percentages?.reduce((acc, cur) => {
            acc[cur.option_id] = cur.percentage;
            return acc;
        }, {});

        return (
            <>
                <div className="flex flex-col gap-1 max-h-50 overflow-y-auto">
                    {percentagesMap &&
                        poll.question?.options?.map((option, index) => (
                            <PollOptionAnswered
                                key={index}
                                selected={answers.includes(option.id)}
                                option={option.option_text}
                                percentage={percentagesMap[option.id] ?? 0}
                            />
                        ))}
                </div>

                <div
                    className="absolute right-[1rem] bottom-[1rem] text-[#FF5437]"
                    style={{
                        fontSize: 22,
                    }}
                >
                    Total votes: {results.total_count_of_votes}
                </div>
            </>
        );
    };

    const renderPoll = () => {
        return (
            <>
                <div className="flex flex-col gap-1 max-h-50 overflow-y-auto">
                    {poll.question?.options?.map((option, index) => (
                        <PollOption
                            disabled={
                                (!chosenAnswers.includes(option.id) &&
                                    noMoreOptions) ||
                                loading
                            }
                            key={index}
                            selected={chosenAnswers.includes(option.id)}
                            option={option.option_text}
                            onClick={(e) => onClick(option)}
                        />
                    ))}
                </div>

                <div className="mt-4 flex w-full gap-2">
                    <input
                        className="border-slate-300 rounded-md px-4 py-2 flex flex-1"
                        type="text"
                        placeholder="Give Your Feedback"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                    />

                    <button
                        disabled={loading}
                        className="rounded-3xl min-w-20 bg-[#FF5437] text-white border-none disabled:opacity-40"
                        onClick={onSubmit}
                    >
                        Send
                    </button>
                </div>
            </>
        );
    };

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

    const [showCommentsModal, setShowCommentsModal] = useState(false);

    const [showLikesPopup, setShowLikesPopup] = useState(false);

    const isExpired = poll?.end_date
        ? new Date(poll?.end_date) < new Date()
        : false;

    const userData = useUserData();

    if (isDeleted) {
        return null;
    }

    return (
        <>
            <article
                className={cn(
                    // cachedPost.type === "announcement" ? "-mt-16" : "mt-10",
                    "w-full lg:w-full md:w-[610px] sm:w-[610px]",
                    "mt-10 p-4 rounded-2xl bg-white border-2 shadow-xl w-full lg:w-[610px] md:w-[610px] sm:w-[610px] z-5 relative"
                )}
            >
                <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full">
                    <div className="flex gap-1 mt-2"></div>
                    <div className="flex flex-col justify-between items-start px-1 w-full mb-4 p-2 -ml-2 -mt-3">
                        <CardHeader post={cachedPost} />
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
                            onAnnouncement={() =>
                                handleAnnouncement(cachedPost)
                            }
                        />
                    )}
                </header>

                <div>{poll.question?.question_text}</div>

                {previousResponse || isExpired
                    ? renderPollResults()
                    : renderPoll()}

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
                        postId={post.id}
                    />,
                    document.body
                )}
        </>
    );
}
