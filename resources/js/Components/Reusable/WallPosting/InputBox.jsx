import React, { useState, useEffect, useRef } from "react";
import Picker from 'emoji-picker-react';
// import { Tooltip } from "react-tooltip";
import { Polls } from "./InputPolls";
import { People } from "./InputPeople";
import { Event } from "./InputEvent";
import TagInput from "./AlbumTag";
import MediaTag from '../../../../../public/assets/Media tag.svg'
import EventTag from '../../../../../public/assets/EventTagIcon.svg'
import "../css/InputBox.css";
import "../../../Pages/Calendar/index.css";
import Emoji from '../../../../../public/assets/EmojiIcon.svg'
import { useCsrf } from "@/composables";

function ShareYourThoughts({ userId, onCreatePoll, includeAccessibilities, filterType, filterId, variant, postedId, onCommentPosted }) {
    const [inputValue, setInputValue] = useState("");
    const [showPollPopup, setShowPollPopup] = useState(false);
    const [showMediaTagPopup, setShowMediaTagPopup] = useState(false);
    const [showPeoplePopup, setShowPeoplePopup] = useState(false);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [tags, setTags] = useState([]);
    const [mediaTagCount, setMediaTagCount] = useState(0);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [chosenPeople, setChosenPeople] = useState([]);
    const [chosenEvent, setChosenEvent] = useState([]);
    const [isAnnouncement, setIsAnnouncement] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(null);
    const [isMentioning, setIsMentioning] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [mentionSuggestionsPosition, setMentionSuggestionsPosition] = useState({ top: 0, left: 0 });
    
    
    const textAreaRef = useRef(null);
    const csrfToken = useCsrf();
    
    const handleChange = (event) => {
        const value = event.target.value;
        const cursorPosition = event.target.selectionStart;
        const beforeCursor = value.slice(0, cursorPosition);
        
        // Check if the last character typed is a space
        const isSpaceTyped = beforeCursor.endsWith(" ");
        
        const mentionMatch = beforeCursor.match(/@(\w*)$/);
        
        if (mentionMatch && !isSpaceTyped) {
            setIsMentioning(true);
            setMentionQuery(mentionMatch[1]);
        } else {
            setIsMentioning(false);
            setMentionQuery("");
        }
        
        setInputValue(value);
        setCursorPosition(cursorPosition);
    };

    const handleTagSelection = (tag, id) => {
        // const firstName = tag.name.split(" ")[0]; // Get only the first name
        // console.log("HAHAHA", tag, id);
        
        
        const beforeCursor = inputValue.slice(0, cursorPosition);
        const afterCursor = inputValue.slice(cursorPosition);
        const mentionStartIndex = beforeCursor.lastIndexOf("@");
        const updatedText = `${beforeCursor.slice(0, mentionStartIndex)}@${tag} ${afterCursor}`;
        
        setInputValue(updatedText);
        setChosenPeople((prevPeople) => [...prevPeople, { name: tag, id: id }]); // Store both name and user_id
        setCursorPosition(mentionStartIndex + tag.length + 2); // Adjust cursor position
        setIsMentioning(false); // Close mention suggestions
        setMentionQuery("");
    };
    
    const handleClickSend = () => {
        const formData = new FormData();
    
        // Determine if it's a post or a comment
        const isComment = variant === "comment";
        const endpoint = isComment ? `/api/posts/posts/${postedId}/comment` : "/api/posts/posts";
        
        // Append common fields
        formData.append("type", isAnnouncement ? "announcement" : "post");
        formData.append("visibility", "public");
    
        if (!inputValue) {
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
    
        // Handle mentions
        if (chosenPeople.length > 0) {
            const mentions = chosenPeople.map(person => `{ "id": "${person.id}", "name": "${person.name}" }`).join(", ");
            const formattedMentions = `[${mentions}]`;
            formData.append("mentions", formattedMentions);
        }
    
        // Handle events
        if (chosenEvent.length > 0) {
            const events = chosenEvent.map(event => `"${event.title}"`).join(", ");
            const formattedEvents = `[${events}]`;
            formData.append("event", formattedEvents);
        }
    
        if (includeAccessibilities) {
            formData.append("accessibilities[0][accessable_type]", filterType);
            formData.append("accessibilities[0][accessable_id]", filterId);
        }
    
        fetch(endpoint, {
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
            setChosenPeople([]);
            setChosenEvent([]);
            if (!isComment) {
                window.location.reload();
            } else {
                // Handle any other actions required after posting a comment, e.g., reloading comments
                onCommentPosted();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };
    
    

    useEffect(() => {
        const handleTagSearch = async () => {
            const atIndex = inputValue.lastIndexOf("@");

            if (atIndex === -1 || cursorPosition <= atIndex + 1) {
                return;
            }

            const searchTerm = inputValue.slice(atIndex + 1, cursorPosition).trim();

            if (searchTerm) {
                try {
                    const response = await fetch(`/api/crud/users?search=${searchTerm}&with[]=profile`);
                    if (response.ok) {
                        const data = await response.json();
                        setSearchResults(data.data.data);
                        console.log('searchResults', searchResults);
                        
                    } else {
                        console.error("Failed to fetch recommended people");
                    }
                } catch (error) {
                    console.error("Error fetching recommended people:", error);
                }
            }
        };

        handleTagSearch();
    }, [inputValue, cursorPosition]);


    const handleToggleChange = () => {
        setIsAnnouncement(!isAnnouncement);
    };
    
    const handleFileUpload = (file) => {
        setAttachments((prevAttachments) => [...prevAttachments, file]);
        setFileNames((prevFileNames) => [...prevFileNames, file.name]);
    };

    const removeFile = (index) => {
        setFileNames((prevFileNames) => prevFileNames.filter((_, i) => i !== index));
        setAttachments((prevAttachments) => prevAttachments.filter((_, i) => i !== index));
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

    const handleClickEvent = () => {
        // console.log("Hello");
        setShowEventPopup(true);
    }

    const closePopup = () => {
        setShowPollPopup(false);
        setShowPeoplePopup(false);
        setShowMediaTagPopup(false);
        setShowEventPopup(false);
    };

    const handleSaveTags = () => {
        setMediaTagCount(tags.length); // Update the count when saving tags
        closePopup(); // Close the popup
    };

    const handleSavePeople = (selectedPeople) => {
        setChosenPeople(selectedPeople); // Update chosenPeople state
        closePopup(); // Close the popup
    };

    const handleSaveEvent = (selectedPeople) => {
        setChosenEvent(selectedPeople); // Update chosenPeople state
        closePopup(); // Close the popup
    };

    const handleReactionClick = (emojiObject) => {
        setInputValue(inputValue + emojiObject.emoji);
        setShowReactionPicker(false); // Close the reaction picker after selecting a reaction
    };

    const toggleReactionPicker = () => {
        setShowReactionPicker(!showReactionPicker);
    };

    return (
        <section className="flex flex-col justify-center text-sm text-neutral-800 w-full">
            <div
                className={`flex flex-col gap-0 justify-between px-8 pt-5 pb-2 rounded-2xl shadow-sm max-md:flex-wrap max-md:px-5 max-w-full ${
                    variant === "comment" ? "comment-box-container" : "input-box-container"
                }`}
            >
                <div className="flex flex-col w-full">
                    {variant === "comment" && (
                        <textarea
                            ref={textAreaRef}
                            value={inputValue}
                            onChange={handleChange}
                            placeholder="comment something..."
                            className="self-center mt-1 h-8 px-2 mb-12 text-sm border-none appearance-none resize-none input-no-outline w-full"
                        />
                    )}
                    {variant !== "comment" && (
                        <textarea
                            ref={textAreaRef}
                            value={inputValue}
                            onChange={handleChange}
                            placeholder="Share Your Thoughts..."
                            className="self-center mt-1 h-8 px-2 mb-12 text-sm border-none appearance-none resize-none input-no-outline w-full"
                        />
                    )}
                    {fileNames.length > 0 && (
                        <div className="file-names-container py-2 w-auto flex flex-col gap-2">
                            {fileNames.map((name, index) => (
                                <div className="file-name inline-flex rounded-lg border-2 bg-gray-100 py-1 px-4 justify-between items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                    key={index}>
                                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                                        {name}
                                    </span>
                                    <button className="ml-2 text-blue-500" onClick={() => removeFile(index)}>
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className=" ">
                        <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-4 items-center">
                            {variant === "comment" && (
                                <>
                                    <button className="tooltip" onClick={toggleReactionPicker}>
                                        <img
                                            loading="lazy"
                                            src={Emoji}
                                            alt="Emoji Icon"
                                            className="w-[16px] h-[16px]"
                                        />
                                        <span className="tooltiptext">React 😀🤣😤</span>
                                    </button>
                                    {showReactionPicker && (
                                        <div className="emoji-picker-container">
                                            <Picker
                                                reactionsDefaultOpen={true}
                                                onReactionClick={handleReactionClick}
                                                reactions={["1f600", "1f602", "1f923", "1f60d", "1f62e", "1f614"]}
                                            />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleClickPeople}
                                        className="tooltip relative text-md text-blue-500 hover:text-blue-700"
                                    >
                                        <img
                                            loading="lazy"
                                            src="assets/inputpeople.svg"
                                            alt="People Icon"
                                            className="w-[16px] h-[16px]"
                                        />
                                        <span className="tooltiptext">Mentions People</span>
                                        {chosenPeople.length > 0 && (
                                            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                {chosenPeople.length}
                                            </span>
                                        )}
                                    </button>
                                </>
                            )}
                            {variant !== "comment" && (
                                <>
                                    <div className="flex w-full max-md:flex-col lg:flex-row max-md:gap-4 lg: justify-between">
                                        <div className="flex w-full flex-row justify-between lg:w-2/3 max-md:py">
                                            <button className="tooltip" onClick={handleClickPoll}>
                                                <img
                                                    loading="lazy"
                                                    src="assets/inputpolls.svg"
                                                    alt="Poll Icon"
                                                    className="w-4 h-4"
                                                />
                                                <span className="tooltiptext">Poll</span>
                                            </button>
                                            <button className="tooltip" onClick={handleClickImg}>
                                                <img
                                                    loading="lazy"
                                                    src="assets/inputimg.svg"
                                                    alt="Image Icon"
                                                    className="w-4 h-4"
                                                />
                                                <span className="tooltiptext">Image</span>
                                            </button>
                                            <button className="tooltip" onClick={handleClickVid}>
                                                <img
                                                    loading="lazy"
                                                    src="assets/inputvid.svg"
                                                    alt="Video Icon"
                                                    className="w-4 h-4"
                                                />
                                                <span className="tooltiptext">Video</span>
                                            </button>
                                            <button className="tooltip" onClick={handleClickDoc}>
                                                <img
                                                    loading="lazy"
                                                    src="assets/inputdoc.svg"
                                                    alt="Document Icon"
                                                    className="w-3 h-3"
                                                />
                                                <span className="tooltiptext">Document</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClickMediaTag}
                                                className="tooltip relative text-md text-blue-500 hover:text-blue-700"
                                            >
                                                <img src={MediaTag} alt="Tag Media" className="w-4 h-4" />
                                                <span className="tooltiptext">Album Tag</span>
                                                {mediaTagCount > 0 && (
                                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                        {mediaTagCount}
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClickPeople}
                                                className="tooltip relative text-md text-blue-500 hover:text-blue-700"
                                            >
                                                <img
                                                    loading="lazy"
                                                    src="assets/inputpeople.svg"
                                                    alt="People Icon"
                                                    className="w-4 h-4"
                                                />
                                                <span className="tooltiptext">Mentions People</span>
                                                {chosenPeople.length > 0 && (
                                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                        {chosenPeople.length}
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClickEvent}
                                                className=" tooltip relative text-md text-blue-500 hover:text-blue-700"
                                            >
                                                <img
                                                    loading="lazy"
                                                    src={EventTag}
                                                    alt="Event Icon"
                                                    className="w-4 h-4"
                                                />
                                                <span className="tooltiptext">Event Tag</span>
                                                {chosenEvent.length > 0 && (
                                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                        {chosenEvent.length}
                                                    </span>
                                                )}
                                            </button>
                                        </div>

                                        {/* column baru */}
                                        <div className="flex flex-row w-full max-md:justify-between justify-end gap-4">
                                            {variant !== "comment" && (
                                                <div className="flex items-center">
                                                    <label className="text-sm mr-3">Set as Announcement?</label>
                                                    <label className="switch">
                                                        <input type="checkbox" checked={isAnnouncement} onChange={handleToggleChange} />
                                                        <span className="slider"></span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        {/* column sampaisini */}
                                    </div>
                                </>
                            )}
                                            <button onClick={handleClickSend} className="flex send-button align-item justify-end">
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb9e6a4fb4fdc3ecfcef04a0984faf7c2720a004081fccbe4db40b1509a23780?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                                                    alt="SEND"
                                                    className="h-6 w-6"
                                                />
                                            </button>
                        </div>
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
                    chosenPeople={chosenPeople}
                    onSavePeople={handleSavePeople}
                />
            )}
            {showEventPopup && (
                <Event
                    onClose={closePopup}
                    chosenEvent={chosenEvent}
                    onSaveEvent={handleSaveEvent}
                />
            )}
            {isMentioning && mentionQuery && (
                <div className="mention-suggestions">
                    {searchResults.filter(person =>
                        person.name.toLowerCase().includes(mentionQuery.toLowerCase())
                    ).map(person => (
                        <div
                            key={person.id}
                            onClick={() => handleTagSelection(person.name, person.id)}
                        >
                            {person.name}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
    
}

export default ShareYourThoughts;