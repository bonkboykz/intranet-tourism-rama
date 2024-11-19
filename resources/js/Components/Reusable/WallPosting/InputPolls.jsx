import React, { useEffect, useRef, useState } from "react";
import Switch from "react-switch";
import { toast } from "react-toastify";
import { useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { add, format, startOfDay } from "date-fns";

import { CancelIcon } from "@/Components/Icons/CancelIcon";
import { cn } from "@/Utils/cn";
import useUserData from "@/Utils/hooks/useUserData";

import { SendAs } from "./InputBox/SendAs";
import { UserProfileAvatar } from "./UserProfileAvatar";

function PollOption({ option, onRemove, onChange }) {
    return (
        <div className="flex gap-5 px-px mt-0 text-sm leading-5 text-neutral-800 max-md:flex-wrap">
            <div className="flex flex-auto gap-3 px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-2xl items-center">
                <div className="flex items-center w-full">
                    <input
                        type="text"
                        value={option}
                        onChange={onChange}
                        className="flex-auto bg-gray-100 text-md outline-none border-none"
                    />
                </div>
                <img
                    loading="lazy"
                    src="assets/CloseIcon.svg"
                    alt="Close icon"
                    className="cursor-pointer w-[14px] h-[14px] object-contain"
                    onClick={onRemove}
                />
            </div>
        </div>
    );
}

function AddOptionButton({ label, onClick }) {
    return (
        <div
            className="flex items-center gap-3 p-2 bg-gray-100 border-2 border-gray-300 rounded-3xl cursor-pointer w-fit"
            onClick={onClick}
        >
            <div className="justify-center items-center text-xl font-bold text-center text-white bg-primary rounded-3xl h-[30px] w-[30px]">
                +
            </div>
            <div className="text-md font-bold text-neutral-800 mr-2">
                {label}
            </div>
        </div>
    );
}

export function InputPolls({
    communityId,
    departmentId,
    onClose,
    onCreatePoll,
}) {
    const [inputValue, setInputValue] = useState("");
    const [includeEndDate, setIncludeEndDate] = useState(false);
    const [endDate, setEndDate] = useState(new Date());

    const [postAs, setPostAs] = useState("Post as");
    const textAreaRef = useRef(null);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const [isMultiple, setIsMultiple] = useState(false);

    const [options, setOptions] = useState(["Option 1", "Option 2"]);

    const handleRemoveOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, `Option ${options.length + 1}`]);
        setTimeout(() => {
            if (textAreaRef.current) {
                textAreaRef.current.scrollTop =
                    textAreaRef.current.scrollHeight;
            }
        }, 0);
    };

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
    };

    const {
        props: {
            auth: { id: userId },
        },
    } = usePage();
    const userData = useUserData(userId);

    const handlePostPoll = async () => {
        const formData = new FormData();

        formData.append("question", inputValue);
        for (const [index, option] of options.entries()) {
            formData.append(`options[${index}]`, option);
        }

        if (isMultiple) {
            formData.append("multiple", isMultiple);
        }

        if (!includeEndDate) {
            toast.error("End date must be included");
            return;
        } else {
            formData.append("end_date", endDate);
        }

        if (communityId) {
            formData.append("community_id", communityId);
        }

        if (departmentId) {
            formData.append("department_id", departmentId);
        }

        if (postAs !== "Post as") {
            formData.append(
                "post_as",
                postAs.includes("admin") ? "admin" : "member"
            );
        } else {
            formData.append("post_as", "member");
        }

        try {
            const response = await axios.post(
                `/api/posts/posts/create_poll`,
                formData
            );

            onCreatePoll();
        } catch (e) {
            console.error(e);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div
                className="bg-white p-5 rounded-3xl shadow-lg overflow-y-auto overflow-x-hidden max-h-screen my-12 max-w-3xl w-full md:w-2/3 max-md:mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-start mb-6 text-2xl font-bold text-neutral-800">
                    <h1>Create Poll</h1>
                    <button onClick={onClose}>
                        <CancelIcon className="w-6" />
                    </button>
                </header>
                <main className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <UserProfileAvatar
                                post={{
                                    user: {
                                        name: userData.name,
                                        profile: userData.profile,
                                    },
                                }}
                            />
                        </div>

                        <div className="flex flex-col  w-fit">
                            <p className="text-lg font-bold">{userData.name}</p>
                        </div>
                    </div>
                    <textarea
                        ref={textAreaRef}
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Type something..."
                        className="w-full p-2 text-xl font-bold text-neutral-800 border-1 border-gray-300 rounded-md resize-none"
                        rows="4"
                        style={{ maxHeight: "100px", overflowY: "auto" }}
                    />
                    <h2 className="text-xl font-bold text-neutral-800">
                        Add Poll
                    </h2>
                    <div className="flex flex-col gap-3 max-h-50 overflow-y-auto">
                        {options.map((option, index) => (
                            <PollOption
                                key={index}
                                option={option}
                                onRemove={() => handleRemoveOption(index)}
                                onChange={(e) => handleOptionChange(index, e)}
                            />
                        ))}
                    </div>
                    <AddOptionButton
                        label="Add option"
                        onClick={handleAddOption}
                    />
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-blue-600">
                            Allow multiple answers?
                        </span>
                        <Switch
                            checked={isMultiple}
                            onChange={(checked) => setIsMultiple(checked)}
                            onColor="#36c"
                            onHandleColor="#fff"
                            handleDiameter={24}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={16}
                            width={40}
                            className="react-switch"
                        />
                    </div>
                    <div className="flex relative w-full flex-row max-md:flex-col justify-between max-md:justify-start items-center my-8 gap-4 max-md:gap-2">
                        <div className="flex flex-row max-md:flex-col max-md:justify-start w-full">
                            <label
                                htmlFor="end_date"
                                className="inline-block bg-gray-100 p-4 text-center text-sm text-neutral-800 rounded-3xl cursor-pointer select-none"
                                onClick={() =>
                                    setIncludeEndDate(!includeEndDate)
                                }
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
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={cn(
                                        `border-none p-4 text-sm text-neutral-800 rounded-3xl`,
                                        includeEndDate ? "block" : "hidden"
                                    )}
                                />
                            )}
                        </div>
                        <div className="w-full flex justify-end max-md:justify-start   ">
                            <SendAs
                                postAs={postAs}
                                onChange={(newPostAs) => setPostAs(newPostAs)}
                                communityId={communityId}
                                departmentId={departmentId}
                            />
                        </div>
                    </div>
                    <button
                        className="w-full py-2 mt-4 text-white bg-primary hover:bg-primary-hover rounded-3xl"
                        onClick={handlePostPoll}
                    >
                        Post poll
                    </button>
                </main>
            </div>
        </div>
    );
}

export default InputPolls;
