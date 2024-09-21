import React, { useEffect, useRef, useState } from "react";
import Switch from "react-switch";
import { useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { add, format, startOfDay } from "date-fns";

import { cn } from "@/Utils/cn";
import useUserData from "@/Utils/hooks/useUserData";

import { SendAs } from "./InputBox/SendAs";
import { UserProfileAvatar } from "./UserProfileAvatar";

function PollOption({ option, onRemove, onChange }) {
    return (
        <div className="flex gap-5 px-px mt-3 text-sm leading-5 text-neutral-800 max-md:flex-wrap">
            <div className="flex flex-auto gap-3 px-4 py-2 bg-gray-100 rounded-3xl max-md:flex-wrap items-center">
                <div className="shrink-0 bg-white rounded-full h-[13px] w-[13px]" />
                <input
                    type="text"
                    value={option}
                    onChange={onChange}
                    className="flex-auto bg-gray-100 outline-none border-none"
                />
            </div>
            <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b330e075518102f0d7cedcbac4231209eacd02d6ed1f3210266297b383a48d7?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                alt="Remove option"
                className="shrink-0 my-auto aspect-square w-[19px] cursor-pointer"
                onClick={onRemove}
            />
        </div>
    );
}

function AddOptionButton({ label, onClick }) {
    return (
        <div
            className="addoptionbutton flex flex-auto gap-3 py-1.5 bg-gray-100 rounded-3xl pr-5 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex justify-center items-center px-2.5 text-xl font-bold ml-1 text-center text-white bg-blue-500 rounded-3xl h-[30px] w-[30px]">
                +
            </div>
            <div className="flex-auto my-auto text-sm leading-5 text-neutral-800">
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

        if (includeEndDate) {
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

    const [includeEndDate, setIncludeEndDate] = useState(false);
    const [endDate, setEndDate] = useState(new Date());

    const [postAs, setPostAs] = useState("Post as");

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div
                className="bg-white p-5 rounded-3xl shadow-lg max-w-3xl w-full md:w-2/3 max-md:mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center mb-6 text-2xl font-bold text-neutral-800">
                    <h1>Create Poll</h1>
                    <button onClick={onClose}>
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d5c01ea628264d796f4bd86723682019081b89678cb8451fb7b48173e320e5ff?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                            alt="Close icon"
                            className="w-6 cursor-pointer"
                        />
                    </button>
                </header>
                <main className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <UserProfileAvatar
                                post={{
                                    user: {
                                        name: userData.name,
                                        profile: userData,
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
                        className="w-full p-2 text-xl font-bold text-neutral-800 border-none rounded-md resize-none"
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
                        <span className="text-sm text-blue-600">
                            Allow multiple answers?
                        </span>
                    </div>
                    <div className="flex relative w-full my-8 gap-4">
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
                                    add(startOfDay(new Date()), { days: 1 }),
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
                    <div>
                        <SendAs
                            postAs={postAs}
                            onChange={(newPostAs) => setPostAs(newPostAs)}
                            communityId={communityId}
                            departmentId={departmentId}
                        />
                    </div>
                    <button
                        className="w-full py-2 mt-4 text-white bg-blue-500 rounded-3xl"
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
