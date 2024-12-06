import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { cn } from "@/Utils/cn";
import { toastError } from "@/Utils/toast";

function PollOption({
    option,
    onClick,
    selected,
    disabled,
    percentage = 0,
    showPercentage = false,
}) {
    return (
        <div className="flex gap-5 mt-3 text-md leading-5 text-neutral-800 max-md:flex-wrap min-h-12">
            <div
                className={cn(
                    `flex flex-auto gap-3 px-4 bg-gray-100 rounded-3xl items-center transition`,
                    selected && "bg-primary text-white",
                    disabled && "opacity-60"
                )}
            >
                <button
                    disabled={disabled}
                    onClick={onClick}
                    className="py-2 flex-auto outline-none border-none cursor-pointer break-all overflow-hidden text-blue-900 active:text-white font-bold text-start w-full disabled:cursor-default"
                >
                    {option}
                </button>

                <div className="flex gap-2">
                    {showPercentage && <div>{percentage.toFixed(2)}%</div>}
                </div>
            </div>
        </div>
    );
}

export function usePolls(cachedPost, { refetchPost, loggedInUserId }) {
    const [feedbackText, setFeedbackText] = useState("");
    const [chosenAnswers, setChosenAnswers] = useState([]);

    const poll = cachedPost.poll;

    const isSingleChoice = poll?.question?.question_type === "single";

    // const noMoreOptions = isSingleChoice && chosenAnswers.length >= 1;

    const onClick = (option) => {
        let newChosenAnswers = [];

        if (chosenAnswers.includes(option.id)) {
            newChosenAnswers = chosenAnswers.filter((x) => x !== option.id);
            setChosenAnswers(newChosenAnswers);
        } else if (!isSingleChoice) {
            newChosenAnswers = [...chosenAnswers, option.id];
            setChosenAnswers(newChosenAnswers);
        } else if (isSingleChoice && chosenAnswers.length > 0) {
            return;
        } else if (isSingleChoice && chosenAnswers.length === 0) {
            newChosenAnswers = [option.id];
            setChosenAnswers(newChosenAnswers);
        }

        onSubmit(newChosenAnswers);
    };

    const [loading, setLoading] = useState(false);

    const onSubmit = async (optionIds) => {
        setLoading(true);

        const formData = new FormData();

        optionIds.forEach((answer, index) => {
            formData.append(`option_ids[${index}]`, answer);
        });

        formData.append("poll_id", poll.id);

        try {
            const response = await axios.post(
                `/api/posts/posts/${cachedPost.id}/submitPollResponse`,
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

    const onSubmitFeedback = async () => {
        setLoading(true);

        const formData = new FormData();

        formData.append("feedbackText", feedbackText.trim());
        formData.append("poll_id", poll.id);

        try {
            const response = await axios.post(
                `/api/posts/posts/${cachedPost.id}/submitPollFeedback`,
                formData
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to submit poll feedback");
            }

            // const responseData = response.data.data;

            toast.success("Feedback submitted successfully");

            await refetchPost();
        } catch (e) {
            console.error(e);

            toastError("Failed to submit feedback");
        }
        setLoading(false);
    };

    const [loadingAnswered, setLoadingAnswered] = useState(false);
    const [previousResponse, setPreviousResponse] = useState(null);

    const [results, setResults] = useState({});

    const fetchResults = async () => {
        if (!cachedPost.poll) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `/api/posts/posts/${cachedPost.id}/calculatePollResults`
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
        if (!cachedPost.poll) {
            return;
        }

        setLoadingAnswered(true);
        try {
            const response = await axios.post(
                `/api/posts/posts/${cachedPost.id}/haveAnsweredPoll`
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to check if user has answered poll");
            }

            const previousResponse = response.data.data;

            setPreviousResponse(previousResponse);

            setChosenAnswers(
                previousResponse?.answers?.map((answer) => answer) ?? []
            );
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

    const isExpired = poll?.end_date
        ? new Date(poll?.end_date) < new Date()
        : false;

    const renderPoll = () => {
        const answers = previousResponse?.answers ?? [];

        const hasSubmittedAnswers = answers.length > 0;

        const percentagesMap =
            results.percentages?.reduce((acc, cur) => {
                acc[cur.option_id] = parseFloat(cur.percentage.toFixed(1));
                return acc;
            }, {}) ?? {};

        const hasSubmittedFeedback =
            poll.feedbacks?.some(
                (feedback) => feedback.user_id === loggedInUserId
            ) ?? false;

        return (
            <>
                <div className="flex flex-col gap-1 max-h-50 overflow-y-auto">
                    {poll.question?.options?.map((option, index) => (
                        <PollOption
                            disabled={loading || isExpired}
                            key={index}
                            selected={chosenAnswers.includes(option.id)}
                            option={option.option_text}
                            onClick={() => onClick(option)}
                            percentage={percentagesMap[option.id] ?? 0}
                            showPercentage={hasSubmittedAnswers}
                        />
                    ))}
                </div>

                <div className="text-sm text-gray-500 my-2">
                    {isSingleChoice
                        ? "Deselect your current choice to change your vote"
                        : "Select one or more"}
                </div>

                {!hasSubmittedFeedback && (
                    <div className="mt-4 flex w-full gap-2">
                        <input
                            className="border-slate-300 rounded-md px-4 py-2 flex flex-1"
                            type="text"
                            placeholder="Your feedback will only be seen by the poll creator"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                        />

                        <button
                            disabled={feedbackText.length <= 0 || loading}
                            className={cn(
                                "rounded-3xl min-w-20 font-bold bg-secondary hover:bg-secondary-hover text-white border-none disabled:opacity-40"
                            )}
                            onClick={onSubmitFeedback}
                        >
                            Send
                        </button>
                    </div>
                )}

                <div
                    className="text-secondary absolute right-[16px] bottom-[16px] font-semibold"
                    style={{
                        fontSize: 18,
                    }}
                >
                    Total votes: {results.total_count_of_votes}
                </div>
            </>
        );
    };

    return {
        renderPoll,
        question: poll?.question?.question_text,
    };
}
