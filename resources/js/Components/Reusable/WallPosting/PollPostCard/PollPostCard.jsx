import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import axios from "axios";

import { cn } from "@/Utils/cn";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import { CardHeader } from "../DefaultPostCard/CardHeader/CardHeader";
import { CardImage } from "../DefaultPostCard/CardImage/CardImage";
import { PostDetails } from "../DefaultPostCard/PostDetails/PostDetails";
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
                    <div>{percentage}%</div>
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
    const { hasRole } = usePermissions();
    const { variant, loggedInUserId } = useContext(WallContext);

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

    if (!post.poll) {
        return null;
    }

    const canEdit =
        cachedPost.user_id === loggedInUserId || hasRole("superadmin");

    const poll = cachedPost.poll;

    // console.log(poll);

    const [feedbackText, setFeedbackText] = useState("");
    const [chosenAnswers, setChosenAnswers] = useState([]);

    const isSingleChoice = poll.question?.question_type === "single";

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

    console.log(previousResponse, results);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `/api/posts/posts/${post.id}/calculatePollResults`
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to calculate poll results");
            }

            // console.log(response);

            const responseData = response.data.data;

            setResults(responseData);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchResults();
    }, [previousResponse]);

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

            console.log("have answered", response);

            setPreviousResponse(previousResponse);
        } catch (e) {
            console.error(e);
        }

        setLoadingAnswered(false);
    };

    useEffect(() => {
        fetchAnswered();
    }, []);

    const renderPollResults = () => {
        const answers = previousResponse?.answers ?? [];

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
                            selected={answers.includes(option.id)}
                            option={option.option_text}
                            percentage={percentagesMap[option.id] ?? 0}
                        />
                    ))}
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

    return (
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
                                    onClick={() => setShowDetails(!showDetails)}
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
                        onAnnouncement={() => handleAnnouncement(cachedPost)}
                    />
                )}
            </header>

            <div>{poll.question?.question_text}</div>

            {previousResponse ? renderPollResults() : renderPoll()}
        </article>
    );
}
