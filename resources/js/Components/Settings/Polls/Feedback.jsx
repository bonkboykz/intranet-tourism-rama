import React, { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
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

// Feedback Row Component
const FeedbackRow = ({ feedback, onRead, onDelete }) => {
    const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    // Function to handle read feedback and show modal
    const handleRead = () => {
        onRead(feedback.id);
        setIsFeedbackModalVisible(true);
    };

    // Function to handle delete feedback
    const handleDelete = () => {
        onDelete(feedback.id);
        setIsDeleteModalVisible(false);
    };

    const maxLength = 50;
    const truncatedFeedback =
        feedback.feedback_text.length > maxLength
            ? `${feedback.feedback_text.substring(0, maxLength)}...`
            : feedback.feedback_text;

    return (
        <>
            <div
                className="grid border-t border-gray-200 cursor-pointer py-8"
                style={{
                    gridTemplateColumns: "2fr 3fr 1fr",
                }}
                onClick={handleRead}
            >
                <div className="flex items-center">
                    <img
                        className="w-10 h-10 rounded-full"
                        src={getProfileImage(feedback.userProfile)}
                        alt="User profile"
                    />
                    <div className="ml-3">
                        <p className="text-sm font-bold text-black">
                            {feedback.user.name}{" "}
                            {feedback.userDepartment
                                ? `(${feedback.userDepartment.name})`
                                : ""}
                        </p>
                        <p className="text-xs font-semibold text-black">
                            {formatTime(feedback.created_at)}
                        </p>
                    </div>
                </div>
                <div className="flex justify-start">
                    <p className="pl-20 text-sm font-semibold text-center text-black ">
                        {truncatedFeedback}
                    </p>
                </div>
                <div className="flex items-center justify-end">
                    {/* {!feedback.read && (
                        <div className="w-3 h-3 mr-10 bg-[#FF5436] rounded-full"></div>
                    )} */}
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
                        className="relative p-8 bg-white rounded-lg shadow-lg w-[600px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-4 text-2xl font-bold text-center">
                            {feedback.user.name}{" "}
                            {feedback.userDepartment
                                ? `(${feedback.userDepartment.name})`
                                : ""}
                        </h2>
                        <hr
                            className="mb-5 border-t border-gray-300"
                            style={{ borderColor: "#E4E4E4", width: "100%" }}
                        />
                        <p className="mb-2 text-lg font-medium text-center">
                            {feedback.feedback_text}
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-8 py-2 mt-5 text-white bg-blue-500 rounded-full"
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm "
                    onClick={() => setIsDeleteModalVisible(false)}
                >
                    <div
                        className="relative p-8 bg-white rounded-lg shadow-custom w-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center ">
                            <h2 className="mb-4 text-lg font-bold">
                                Delete the feedback permanently?
                            </h2>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="px-8 py-2 text-base font-bold text-white bg-blue-500 border border-blue-500 rounded-full"
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

// Main Feedback Component
const Feedback = ({ postId }) => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFeedbackData = async () => {
        setIsLoading(true);
        try {
            // Fetch feedback data from API
            const response = await axios.get(
                `/api/posts/${postId}/poll_feedback`
            );

            console.log(response);

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
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;

    // Function to mark feedback as read
    const markAsRead = (id) => {
        // TODO:
        // setFeedbackList(
        //     feedbackList.map((fb) =>
        //         fb.id === id ? { ...fb, read: true } : fb
        //     )
        // );
    };

    // Function to delete feedback
    const deleteFeedback = (id) => {
        // TODO:
        // setFeedbackList(feedbackList.filter((fb) => fb.id !== id));
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    // const currentFeedback = feedbackList.slice(indexOfFirstRow, indexOfLastRow);

    const feedbackList = useMemo(() => {
        return feedbackData
            .sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            })
            .slice(indexOfFirstRow, indexOfLastRow);
    }, [feedbackData]);

    const totalPages = Math.ceil(feedbackData.length / rowsPerPage);

    console.log(feedbackList, indexOfFirstRow, indexOfLastRow);

    return (
        <>
            <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-10">
                <h2
                    className="mb-4 text-2xl font-bold text-blue-500 cursor-default grid text-center"
                    style={{
                        gridTemplateColumns: "2fr 3fr 1fr",
                    }}
                >
                    <div>User</div>
                    <div>Feedback</div>
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
            <div className="max-w-[900px]">
                <div className="flex items-center justify-end">
                    <button
                        className={`px-4 py-2 bg-[#FAFBFD] border border-[#D5D5D5] rounded-l-lg shadow-custom ${currentPage === 1 ? "opacity-60 cursor-default" : ""}`}
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
                        className={`px-4 py-2 bg-[#FAFBFD] border border-[#D5D5D5] rounded-r-lg shadow-custom ${currentPage === totalPages ? "opacity-60 cursor-default" : ""}`}
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
