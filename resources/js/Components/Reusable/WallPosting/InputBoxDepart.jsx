import React, { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import TagInput from "./AlbumTag";
import { People } from "./InputPeople";
import InputPolls from "./InputPolls";

function ShareYourThoughtsDepart() {
    const [inputValue, setInputValue] = useState("");
    const [showPollPopup, setShowPollPopup] = useState(false);
    const [showPeoplePopup, setShowPeoplePopup] = useState(false);
    const [posts, setPosts] = useState([]); // State to store the submitted posts
    const textAreaRef = useRef(null);
    const [attachments, setAttachments] = useState([]);
    const [tags, setTags] = useState([]);

    const [isPopupOpen, setIsPopupOpen] = useState({}); // State to manage which post's popup is open

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleClickImg = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // You can upload the file to your server here
            console.log("Uploading file:", file);

            // If you want to display the file name in the textarea
            const fileName = file.name;
            const newValue = `${inputValue}\n${fileName}`;
            setInputValue(newValue);

            // Set focus back to the textarea
            textAreaRef.current.focus();
        };
        fileInput.click();
    };

    const handleClickVid = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "video/*";
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // You can upload the file to your server here
            console.log("Uploading file:", file);

            // If you want to display the file name in the textarea
            const fileName = file.name;
            const newValue = `${inputValue}\n${fileName}`;
            setInputValue(newValue);

            // Set focus back to the textarea
            textAreaRef.current.focus();
        };
        fileInput.click();
    };

    const handleClickPoll = () => {
        setShowPollPopup(true);
    };

    const handleClickSend = () => {
        const formData = new FormData();
        formData.append("user_id", "1");
        formData.append("type", "department");
        formData.append("visibility", "public");
        formData.append("content", inputValue);
        formData.append("tag", JSON.stringify(tags));

        attachments.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });

        fetch("/api/posts/posts", {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setInputValue("");
                setAttachments([]);
                setTags([]);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
                window.location.reload();
            });
    };

    const handleClickDoc = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "application/pdf, .doc, .docx, .txt"; // Accept PDF, Word documents, and text files
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // You can upload the file to your server here
            console.log("Uploading file:", file);

            // If you want to display the file name in the textarea
            const fileName = file.name;
            const newValue = `${inputValue}\n${fileName}`;
            setInputValue(newValue);

            // Set focus back to the textarea
            textAreaRef.current.focus();
        };
        fileInput.click();
    };

    const handleClickPeople = () => {
        setShowPeoplePopup(true);
    };

    const closePopup = () => {
        setShowPollPopup(false);
        setShowPeoplePopup(false);
    };

    const handleSubmitPost = () => {
        if (inputValue.trim()) {
            const currentTime = new Date(); // Capture the current time
            setPosts([{ text: inputValue, time: currentTime }, ...posts]);
            setInputValue(""); // Clear the input field after submission
        }
    };

    const togglePopup = (index) => {
        setIsPopupOpen((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const handleEdit = (index) => {
        console.log("Edit post:", index);
    };

    const handleDelete = (index) => {
        console.log("Delete post:", index);
    };

    const handleAnnouncement = (index) => {
        console.log("Make announcement:", index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            // Trigger re-render to update relative time
            setPosts([...posts]);
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [posts]);

    // Inline styles for responsiveness
    const inputBoxContainerStyle = {
        Width: "875px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: "16px",
        height: "90px",
    };

    const textAreaStyle = {
        width: "800px",
        height: "100px",
        outline: "none",
        border: "none",
        resize: "none",
        padding: "8px",
        fontSize: "14px",
    };

    const responsiveStyles = {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };

    return (
        <section className="flex relative flex-col mb-10  w-[875px]">
            <div className=" mt-4 p-4 border rounded-2xl bg-white shadow-xl w-[875px] relative">
                <div
                    className="relative flex flex-row justify-between "
                    style={responsiveStyles}
                >
                    <textarea
                        ref={textAreaRef}
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Share Your fsdf..."
                        style={textAreaStyle}
                    />

                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb9e6a4fb4fdc3ecfcef04a0984faf7c2720a004081fccbe4db40b1509a23780?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                        alt="Submit"
                        className="absolute right-0 top-0 mt-2 mr-2 w-6 h-6 cursor-pointer"
                        onClick={handleClickSend}
                    />

                    <div className="flex flex-row gap-3 ">
                        <img
                            loading="lazy"
                            src="assets/inputpolls.svg"
                            alt="Icon 1"
                            className="w-[15px] h-auto"
                            onClick={handleClickPoll}
                        />
                        <img
                            loading="lazy"
                            src="assets/inputimg.svg"
                            alt="Icon 2"
                            className="w-[15px] h-auto"
                            onClick={handleClickImg}
                        />
                        <img
                            loading="lazy"
                            src="assets/inputvid.svg"
                            alt="Icon 3"
                            className="w-[15px] h-auto"
                            onClick={handleClickVid}
                        />
                        <img
                            loading="lazy"
                            src="assets/inputdoc.svg"
                            alt="Icon 4"
                            className="w-[15px] h-auto"
                            onClick={handleClickDoc}
                        />
                        <img
                            loading="lazy"
                            src="assets/inputpeople.svg"
                            alt="Icon 5"
                            className="w-[10px] h-auto"
                            onClick={handleClickPeople}
                        />
                    </div>
                </div>
            </div>

            <TagInput tags={tags} setTags={setTags} />

            {showPollPopup && <InputPolls onClose={closePopup} />}
            {showPeoplePopup && <People onClose={closePopup} />}

            <div className="mt-6 ">
                {posts.map((post, index) => (
                    <div
                        key={index}
                        className="mt-4 p-4 border rounded-2xl bg-white border-2 shadow-xl max-w-full absolute"
                    >
                        <div className="flex justify-between px-1 w-full mt-0">
                            {/* <p className="text-gray-500 text-sm flex flex-row">{formatDistanceToNow(new Date(post.time), { addSuffix: true })}</p> */}
                            <img
                                loading="lazy"
                                src="assets/wallpost-dotbutton.svg"
                                alt="Options"
                                className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer"
                                onClick={() => togglePopup(index)}
                            />
                        </div>

                        {/* Popup function for 3 dot after posting */}

                        {isPopupOpen[index] && (
                            <div className="absolute bg-white border-2 rounded-xl shadow-lg px-2 py-2 mt-1 right-0 w-[160px] h-auto z-10">
                                <p
                                    className="cursor-pointer flex flex-row"
                                    onClick={() => handleEdit(index)}
                                >
                                    <img
                                        className="w-6 h-6"
                                        src="/assets/EditIcon.svg"
                                        alt="Edit"
                                    />
                                    Edit
                                </p>
                                <div className="font-extrabold text-neutral-800 mb-2 border-b-2 border-neutral-300"></div>

                                <p
                                    className="cursor-pointer flex flex-row"
                                    onClick={() => handleDelete(index)}
                                >
                                    <img
                                        className="w-6 h-6"
                                        src="/assets/DeleteIcon.svg"
                                        alt="Delete"
                                    />
                                    Delete
                                </p>
                                <div className="font-extrabold text-neutral-800 mb-2 border-b-2 border-neutral-300"></div>

                                <p
                                    className="cursor-pointer flex flex-row "
                                    onClick={() => handleAnnouncement(index)}
                                >
                                    <img
                                        className="w-6 h-6"
                                        src="/assets/AnnounceIcon.svg"
                                        alt="Announcement"
                                    />
                                    Announcement
                                </p>
                            </div>
                        )}

                        {/* Output styling for break word to next line and icon */}
                        {/* <div
              className="post-content break-words overflow-hidden"
              style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
            >
              {post.text}
            </div>
            <div className="flex justify-start gap-2 w-4 h-4">
              <img src='/assets/likeforposting.svg' alt="Like" className="w-6 h-6 cursor-pointer" />
              <img src='/assets/commentforposting.svg' alt="Comment" className="w-6 h-6 cursor-pointer" />
              <img src='/assets/shareforposting.svg' alt="Share" className="w-6 h-6 cursor-pointer" />
            </div> */}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ShareYourThoughtsDepart;
