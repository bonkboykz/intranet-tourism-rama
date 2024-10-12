import React, { useState } from "react";
import axios from "axios";
import { add, format, startOfDay } from "date-fns";
import { Loader2 } from "lucide-react";

import { cn } from "@/Utils/cn";

import { UserProfileAvatar } from "../UserProfileAvatar";

export function EditPollPost({
    post,
    onClose,
    loggedInUserId,
    onClosePopup,
    refetchPost,
}) {
    const [questionText, setQuestionText] = useState(
        post.poll.question.question_text || ""
    );
    const [loading, setLoading] = useState(false);

    const [options, setOptions] = useState(
        post.poll.question.options.map((option) => option.option_text) || []
    );

    const [endDate, setEndDate] = useState(
        post.poll.end_date ? new Date(post.poll.end_date) : new Date()
    );

    const [includeEndDate, setIncludeEndDate] = useState(
        Boolean(post.poll.end_date)
    );

    const handleQuestionChange = (event) => {
        setQuestionText(event.target.value);
    };

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const removeOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        try {
            const data = {
                question: questionText,
                options: options.map((option) => ({ option_text: option })),
                community: post.community,
            };

            if (includeEndDate) {
                data["end_date"] = endDate;
            }

            await axios.put(`/api/posts/${post.id}/update-poll`, data);

            onClose();
            onClosePopup();
            refetchPost();
        } catch (error) {
            console.error("Error updating post:", error);
        }

        setLoading(false);
    };

    return (
        <>
            <div className="flex flex-row justify-between items-center w-full max-md:w-full mb-4">
                <h2 className="font-bold text-2xl">Edit Poll</h2>
                <button onClick={onClose}>
                    <img
                        src="/assets/cancel.svg"
                        alt="Close icon"
                        className="w-6 h-6"
                    />
                </button>
            </div>

            {post.community && (
                <div className="mb-4 text-sm font-semibold text-neutral-600">
                    Community: {post.community.name}
                </div>
            )}

            <div className="max-h-[80vh] overflow-y-auto pb-4">
                <header className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
                    <div className="flex gap-1.5">
                        <UserProfileAvatar post={post} />
                        <div className="flex flex-col my-auto">
                            <div className="text-base font-semibold text-neutral-800">
                                {post.user?.username}
                            </div>
                        </div>
                    </div>
                </header>
                <form onSubmit={handleFormSubmit} className="mt-4">
                    <textarea
                        value={questionText}
                        onChange={handleQuestionChange}
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        placeholder="Edit question"
                    />

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Poll Options</h3>
                        {options.map((option, index) => (
                            <div key={index} className="flex mt-2">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(event) =>
                                        handleOptionChange(index, event)
                                    }
                                    className="w-full p-2 border rounded-md"
                                    placeholder={`Option ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="ml-2 text-secondary"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addOption}
                            className="mt-2 p-2 bg-primary text-white rounded-md"
                        >
                            Add Option
                        </button>
                    </div>
                </form>

                <div className="flex relative w-full flex-row max-md:flex-col justify-between max-md:justify-start items-center my-8 gap-4 max-md:gap-2">
                    <div className="flex flex-row max-md:flex-col max-md:justify-start w-full">
                        <label
                            htmlFor="end_date"
                            className="inline-block bg-gray-100 p-4 text-center text-sm text-neutral-800 rounded-3xl cursor-pointer select-none"
                            onClick={() => setIncludeEndDate(!includeEndDate)}
                        >
                            Choose end date (opt.)
                        </label>

                        {includeEndDate && (
                            <input
                                id="end_date"
                                name="end_date"
                                type="date"
                                min={format(
                                    add(startOfDay(new Date()), {
                                        days: 1,
                                    }),
                                    "yyyy-MM-dd"
                                )}
                                value={format(endDate, "yyyy-MM-dd")}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={cn(
                                    `border-none p-4 text-sm text-neutral-800 rounded-3xl`,
                                    includeEndDate ? "block" : "hidden"
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-end space-x-2 mt-4">
                <button
                    disabled={loading}
                    type="button"
                    onClick={onClose}
                    className="mt-2 px-4 py-2 font-bold hover:bg-gray-400 hover:text-white border-2 border-gray-400 text-gray-400 rounded-full text-sm"
                >
                    Cancel
                </button>
                <button
                    disabled={loading}
                    type="submit"
                    className="mt-2 px-4 py-2 font-bold hover:bg-primary-hover bg-primary text-white rounded-full text-sm"
                    onClick={handleFormSubmit}
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                    ) : (
                        "Save"
                    )}
                </button>
            </div>
        </>
    );
}
