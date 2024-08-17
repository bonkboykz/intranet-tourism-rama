import React, { useState, useEffect, useRef } from "react";
import { Polls } from "./InputPolls";
import { People } from "./InputPeople";
import TagInput from "./AlbumTag";
import MediaTag from '../../../../../public/assets/Media tag.svg'
import "../css/InputBox.css";
import "../../../Pages/Calendar/index.css";
import { useCsrf } from "@/composables";

function ShareYourThoughts({ userId, onCreatePoll, includeAccessibilities, filterType, filterId }) {
    const [inputValue, setInputValue] = useState("");
    const [showPollPopup, setShowPollPopup] = useState(false);
    const [showMediaTagPopup, setShowMediaTagPopup] = useState(false);
    const [showPeoplePopup, setShowPeoplePopup] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [tags, setTags] = useState([]);
    const [mediaTagCount, setMediaTagCount] = useState(0);
    // const [peopleCount, setPeopleCount] = useState(0);
    const [chosenPeople, setChosenPeople] = useState([]); // Added chosenPeople state


    const textAreaRef = useRef(null);
    const csrfToken = useCsrf();

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleClickSend = () => {
        const formData = new FormData();
    
        // Append common fields
        formData.append("user_id", userId);
        formData.append("type", "post");
        formData.append("visibility", "public");
    
        if (!inputValue) {
            formData.append("tag", JSON.stringify(tags));
            attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
        } else {
            formData.append("content", inputValue);
            attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
        }
    
        // Handle tags with spaces after commas
        if (tags.length > 0) {
            const formattedTags = `[${tags.map(tag => `"${tag}"`).join(", ")}]`;
            formData.append("tag", formattedTags);
        }
    
        // Handle mentions with spaces after commas
        if (chosenPeople.length > 0) {
            const mentions = chosenPeople.map(person => `"${person.name}"`).join(", ");
            const formattedMentions = `[${mentions}]`;
            formData.append("mentions", formattedMentions);
        }
    
        if (includeAccessibilities) {
            formData.append("accessibilities[0][accessable_type]", filterType);
            formData.append("accessibilities[0][accessable_id]", filterId);
        }
    
        fetch("/api/posts/posts", {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json", "X-CSRF-Token": csrfToken },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok");
            })
            .then(() => {
                // Reset state
                setInputValue("");
                setAttachments([]);
                setFileNames([]);
                setTags([]);
                setChosenPeople([]); // Clear chosen people after sending
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    
    const handleFileUpload = (file) => {
        setAttachments((prevAttachments) => [...prevAttachments, file]);
        setFileNames((prevFileNames) => [...prevFileNames, file.name]);
    };

    const createFileInputHandler = (accept) => () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = accept;
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            handleFileUpload(file);
        };
        fileInput.click();
    };

    const handleClickImg = createFileInputHandler("image/*");
    const handleClickVid = createFileInputHandler("video/*");
    const handleClickDoc = createFileInputHandler(
        "application/pdf, .doc, .docx, .txt, .xlsx, .ppt, .pptx"
    );

    const handleClickPoll = () => {
        setShowPollPopup(true);
    };

    const handleClickMediaTag = () => {
        setShowMediaTagPopup(true);
    };

    const handleClickPeople = () => {
        setShowPeoplePopup(true);
    };

    const closePopup = () => {
        setShowPollPopup(false);
        setShowPeoplePopup(false);
        setShowMediaTagPopup(false);
    };

    const handleSaveTags = () => {
        setMediaTagCount(tags.length); // Update the count when saving tags
        closePopup(); // Close the popup
    };

    const handleSavePeople = (selectedPeople) => {
        setChosenPeople(selectedPeople); // Update chosenPeople state
        closePopup(); // Close the popup
    };

    return (
        <section className="flex flex-col justify-center text-sm text-neutral-800">
            <div className="input-box-container  flex gap-5 justify-between px-8 pt-5 pb-2 bg-white rounded-2xl shadow-sm max-md:flex-wrap max-md:px-5 max-w-full">
                <div className="flex flex-col w-[875px] " >
                    <textarea
                        ref={textAreaRef}
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Share Your Thoughts..."
                        className="self-center mt-1 h-8 px-2 text-sm border-none appearance-none resize-none input-no-outline "
                    />
                    <div className="flex mt-7 items-center  justify-between ">
                        <div className="flex gap-4 items-center">
                            <button onClick={handleClickPoll}>
                                <img
                                    loading="lazy"
                                    src="assets/inputpolls.svg"
                                    alt="Poll Icon"
                                    className="w-[14px] h-[14px]"
                                />
                            </button>
                            <button onClick={handleClickImg}>
                                <img
                                    loading="lazy"
                                    src="assets/inputimg.svg"
                                    alt="Image Icon"
                                    className="w-[14px] h-[14px]"
                                />
                            </button>
                            <button onClick={handleClickVid}>
                                <img
                                    loading="lazy"
                                    src="assets/inputvid.svg"
                                    alt="Video Icon"
                                    className="w-[18px] h-[18px]"
                                />
                            </button>
                            <button onClick={handleClickDoc}>
                                <img
                                    loading="lazy"
                                    src="assets/inputdoc.svg"
                                    alt="Document Icon"
                                    className="w-[14px] h-[14px]"
                                />
                            </button>
                            <button
                                type="button"
                                onClick={handleClickMediaTag}
                                className="relative text-md text-blue-500 hover:text-blue-700"
                            >
                                <img src={MediaTag} alt="Tag Media" className="w-[18px] h-[18px]" />
                                {mediaTagCount > 0 && (
                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                        {mediaTagCount}
                                    </span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleClickPeople}
                                className="relative text-md text-blue-500 hover:text-blue-700"
                            >
                                <img
                                    loading="lazy"
                                    src="assets/inputpeople.svg"
                                    alt="People Icon"
                                    className="w-[16px] h-[16px]"
                                />
                                {chosenPeople.length > 0 && (
                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                        {chosenPeople.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        <div
                            className="file-names-container flex flex-wrap gap-2"
                            style={{ minWidth: `${fileNames.length * 80}px` }}
                        >
                            {fileNames.map((name, index) => (
                                <div
                                    className="flex items-center px-2 py-1 bg-white rounded-lg shadow"
                                    key={index}
                                >
                                    <div className="file-name text-xs truncate">
                                        {name}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleClickSend} className="flex justify-center ">
                    <div className="">
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb9e6a4fb4fdc3ecfcef04a0984faf7c2720a004081fccbe4db40b1509a23780?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                            alt=""
                        />
                    </div>
                </button>
                    </div>
                </div>
            </div>
            {showMediaTagPopup && (
                <TagInput
                tags={tags}
                setTags={setTags}
                onClose={closePopup}
                onSave={handleSaveTags}
                />
            )}
            {showPollPopup && (
                <Polls onClose={closePopup} onCreatePoll={onCreatePoll} />
            )}
            {showPeoplePopup && (
                <People
                    onClose={closePopup}
                    chosenPeople={chosenPeople} // Pass chosenPeople state
                    onSavePeople={handleSavePeople}
                />
            )}
        </section>
    );
}

export default ShareYourThoughts;