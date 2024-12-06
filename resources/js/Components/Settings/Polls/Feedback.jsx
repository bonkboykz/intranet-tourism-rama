import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Trash } from "lucide-react";
import moment from "moment";

import { getProfileImage } from "@/Utils/getProfileImage";

// Helper function to format time
const formatTime = (time) => {
    const now = moment();
    const date = moment(time);
    const diffInHours = now.diff(date, "hours");
    const diffInDays = now.diff(date, "days");

    if (diffInHours < 1) {
        return "Just now";
    } else if (diffInHours < 2) {
        return "1 hour ago";
    } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else if (diffInDays < 2) {
        return "1 day ago";
    } else if (diffInDays < 3) {
        return `${diffInDays} days ago`;
    } else {
        return date.format("DD/MM/YYYY");
    }
};

const FeedbackRow = ({ feedback, onRead, onDelete }) => {
    const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const handleRead = () => {
        onRead(feedback.id);
        setIsFeedbackModalVisible(true);
    };

    const handleDelete = () => {
        onDelete(feedback.id);
        setIsDeleteModalVisible(false);
    };

    const maxLength = 100;
    const truncatedFeedback =
        feedback.feedback_text.length > maxLength
            ? `${feedback.feedback_text.substring(0, maxLength)}...`
            : feedback.feedback_text;

    return (
        <>
            <div
                className="grid border-t w-full border-gray-200 cursor-pointer py-4"
                style={{
                    gridTemplateColumns: "2fr 3fr 1fr",
                }}
                onClick={handleRead}
            >
                <div className="flex items-center max-md:flex-col max-md:items-start">
                    <img
                        className="w-10 h-10 rounded-full"
                        src={getProfileImage(feedback.userProfile)}
                        alt="User profile"
                    />
                    <div className="ml-3 max-md:ml-0 max-md:mt-2">
                        <p className="text-sm font-bold text-black">
                            {feedback.user.name}{" "}
                            {feedback.userDepartment
                                ? `(${feedback.userDepartment.name})`
                                : ""}
                        </p>
                        <p className="text-xs font-semibold text-gray-400">
                            {formatTime(feedback.created_at)}
                        </p>
                    </div>
                </div>
                <div className="flex justify-start">
                    <p className="ml-6 text-sm font-semibold text-start text-black">
                        {truncatedFeedback}
                    </p>
                </div>
                <div className="flex items-center justify-end">
                    <button
                        className="rounded-full bg-[#FF5436] text-white w-6 h-6 flex items-center justify-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDeleteModalVisible(true);
                        }}
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isFeedbackModalVisible && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm"
                    onClick={() => setIsFeedbackModalVisible(false)}
                >
                    <div
                        className="relative p-8 bg-white rounded-2xl shadow-lg w-[600px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-4 text-2xl font-bold text-start">
                            {feedback.user.name}{" "}
                            {feedback.userDepartment
                                ? `(${feedback.userDepartment.name})`
                                : ""}
                        </h2>
                        <hr
                            className="mb-5 border-t border-gray-300"
                            style={{ borderColor: "#E4E4E4", width: "100%" }}
                        />
                        <p className="mb-2 text-lg font-medium text-start">
                            {feedback.feedback_text}
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-8 py-2 mt-5 text-white bg-primary hover:bg-primary-hover rounded-full"
                                onClick={() => setIsFeedbackModalVisible(false)}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isDeleteModalVisible && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
                    onClick={() => setIsDeleteModalVisible(false)}
                >
                    <div
                        className="relative p-8 bg-white rounded-lg shadow-custom w-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <h2 className="mb-4 text-lg font-bold">
                                Delete the feedback permanently?
                            </h2>
                            <div className="flex justify-center space-x-2">
                                <button
                                    className="px-8 py-2 text-base font-bold text-white bg-primary hover:bg-primary-hover border rounded-full"
                                    onClick={handleDelete}
                                >
                                    Yes
                                </button>
                                <button
                                    className="px-8 py-2 text-base font-bold text-[#979797] bg-white rounded-full border border-[#BDBDBD]"
                                    onClick={() =>
                                        setIsDeleteModalVisible(false)
                                    }
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const Feedback = ({ postId }) => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;

    const fetchFeedbackData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `/api/posts/${postId}/poll_feedback`
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to fetch feedback data");
            }

            const responseData = response.data.data;
            setFeedbackData(responseData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbackData();
    }, [postId]);

    const feedbackList = useMemo(() => {
        const indexOfLastRow = currentPage * rowsPerPage;
        const indexOfFirstRow = indexOfLastRow - rowsPerPage;

        return feedbackData
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(indexOfFirstRow, indexOfLastRow);
    }, [feedbackData, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(feedbackData.length / rowsPerPage);

    // Function to mark feedback as read
    const markAsRead = (id) => {
        // TODO:
        // setFeedbackList(
        //     feedbackList.map((fb) =>
        //         fb.id === id ? { ...fb, read: true } : fb
        //     )
        // );
    };

    const deleteFeedback = async (id) => {
        try {
            const response = await axios.delete(`/api/polls/feedbacks/${id}`);
            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to delete feedback");
            }
            fetchFeedbackData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom border-2 w-full mb-4 max-w-[1200px]">
                <h2
                    className="mb-4 text-2xl font-bold text-primary cursor-default grid text-center"
                    style={{
                        gridTemplateColumns: "2fr 3fr 1fr",
                    }}
                >
                    <div className="text-start">User</div>
                    <div className="text-start ml-6">Feedback</div>
                </h2>
                {feedbackList.map((feedback) => (
                    <FeedbackRow
                        key={feedback.id}
                        feedback={feedback}
                        onRead={markAsRead}
                        onDelete={deleteFeedback}
                    />
                ))}
            </section>
            <div className="w-full max-w-[1200px]">
                <div className="flex items-center justify-end">
                    <button
                        className={`px-4 py-2 bg-[#FAFBFD] border border-[#D5D5D5] rounded-l-lg shadow-custom ${
                            currentPage === 1 ? "opacity-60 cursor-default" : ""
                        }`}
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            ></path>
                        </svg>
                    </button>
                    <button
                        className={`px-4 py-2 bg-[#FAFBFD] border border-[#D5D5D5] rounded-r-lg shadow-custom ${
                            currentPage === totalPages
                                ? "opacity-60 cursor-default"
                                : ""
                        }`}
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Feedback;
