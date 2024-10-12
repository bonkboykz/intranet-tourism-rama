import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Picker from "emoji-picker-react";
import { CircleXIcon, Loader2 } from "lucide-react";

import { AlbumIcon } from "@/Components/Icons/AlbumIcon";
import { DocumentIcon } from "@/Components/Icons/DocumentIcon";
import { EmojiIcon } from "@/Components/Icons/EmojiIcon";
import { EventIcon } from "@/Components/Icons/EventIcon";
import { ImageIcon } from "@/Components/Icons/ImageIcon";
import { PollsIcon } from "@/Components/Icons/PollsIcon";
import { SendIcon } from "@/Components/Icons/SendIcon";
import { VideoIcon } from "@/Components/Icons/VideoIcon";
import { useCsrf } from "@/composables";
import { useSettings } from "@/Layouts/useSettings";
import { cn } from "@/Utils/cn";
import { usePermissions } from "@/Utils/hooks/usePermissions";
import useUserData from "@/Utils/hooks/useUserData";
import { toastError } from "@/Utils/toast";

import Emoji from "../../../../../public/assets/EmojiIcon.svg";
import EventTag from "../../../../../public/assets/EventTagIcon.svg";
import MediaTag from "../../../../../public/assets/Media tag.svg";
import TagInput from "./AlbumTag";
import { SendAs } from "./InputBox/SendAs";
import { Event } from "./InputEvent";
import { People } from "./InputPeople";
// import { Tooltip } from "react-tooltip";
import InputPolls from "./InputPolls";
import { WallContext } from "./WallContext";

import "../css/InputBox.css";
import "../../../Pages/Calendar/index.css";

function ShareYourThoughts({
    userId,
    onCreatePoll,
    includeAccessibilities,
    filterType,
    filterId,
    variant,
    postedId,
    onCommentPosted,
    communityId,
    departmentId,
}) {
    const [postAs, setPostAs] = useState("Post as");
    const [inputValue, setInputValue] = useState("");
    const [showPollPopup, setShowPollPopup] = useState(false);
    const [showMediaTagPopup, setShowMediaTagPopup] = useState(false);
    const [showPeoplePopup, setShowPeoplePopup] = useState(false);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [albums, setAlbums] = useState([]); // Single tag
    const [mediaTagCount, setMediaTagCount] = useState(0);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [chosenPeople, setChosenPeople] = useState([]);
    const [chosenEvent, setChosenEvent] = useState([]);
    const [isAnnouncement, setIsAnnouncement] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(null);
    const [isMentioning, setIsMentioning] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [mentionSuggestionsPosition, setMentionSuggestionsPosition] =
        useState({ top: 0, left: 0 });
    const [isSending, setIsSending] = useState(false);
    const emojiPickerRef = useRef(null);

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
        const updatedText = `${beforeCursor.slice(
            0,
            mentionStartIndex
        )}@${tag} ${afterCursor}`;

        setInputValue(updatedText);
        setChosenPeople((prevPeople) => [...prevPeople, { name: tag, id: id }]); // Store both name and user_id
        setCursorPosition(mentionStartIndex + tag.length + 2); // Adjust cursor position
        setIsMentioning(false); // Close mention suggestions
        setMentionQuery("");
    };

    const isComment = variant === "comment";

    const handleClickSend = async () => {
        // Prevent triggering multiple times
        if (isSending) return;

        // Check if there is no content and no attachments
        if (!inputValue && attachments.length === 0) {
            return; // Do nothing and exit the function
        }

        setIsSending(true); // Set the flag to true to prevent multiple sends

        // console.log(attachments);

        const formData = new FormData();

        // Determine if it's a post or a comment
        const isComment = variant === "comment";
        const endpoint = isComment
            ? `/api/posts/posts/${postedId}/comment`
            : "/api/posts/posts";

        // Append common fields
        formData.append("visibility", "public");

        formData.append("announced", isAnnouncement ? 1 : 0);

        if (postAs !== "Post as") {
            formData.append(
                "post_as",
                postAs.includes("admin") ? "admin" : "member"
            );
        }

        // Append content and attachments only if they exist
        if (inputValue) {
            formData.append("content", inputValue);
        }
        if (attachments.length > 0) {
            attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
        }

        // // Handle tags with spaces after commas
        // if (tag.length > 0) {
        //     const formattedTags = `[${tag.map(tag => `"${tag}"`).join(", ")}]`;
        //     formData.append("tag", formattedTags);
        // }

        if (albums.length > 0) {
            for (let [index, album] of albums.entries()) {
                formData.append(`albums[${index}]`, album.id);
            }
        }

        // Handle mentions
        if (chosenPeople.length > 0) {
            const mentions = chosenPeople
                .map(
                    (person) =>
                        `{ "id": "${person.id}", "name": "${person.name}" }`
                )
                .join(", ");
            const formattedMentions = `[${mentions}]`;
            formData.append("mentions", formattedMentions);
        }

        // Handle events
        if (chosenEvent.length > 0) {
            const events = chosenEvent
                .map((event) =>
                    JSON.stringify({
                        id: event.id,
                        title: event.title,
                    })
                )
                .join(", ");
            const formattedEvents = `[${events}]`;
            formData.append("event", formattedEvents);
        }

        const accesibilities = [];

        if (communityId) {
            accesibilities.push({
                accessable_type: "Community",
                accessable_id: communityId,
            });
            formData.append("community_id", communityId);
        }

        if (departmentId) {
            accesibilities.push({
                accessable_type: "Department",
                accessable_id: departmentId,
            });
            formData.append("department_id", departmentId);
        }

        for (let [index, access] of accesibilities.entries()) {
            Object.entries(access).forEach(([key, value]) => {
                formData.append(`accessibilities[${index}][${key}]`, value);
            });
        }

        try {
            const response = await axios.post(endpoint, formData);

            if ([401, 403, 500].includes(response.status)) {
                throw new Error("Network response was not ok");
            }

            // Reset state
            setInputValue("");
            setAttachments([]);
            setFileNames([]);
            // setTag([]);
            setAlbums([]); // Reset tag as it is a string
            setChosenPeople([]);
            setChosenEvent([]);
            if (!isComment) {
                // TODO: add handler to refetch or reload based on context
                window.location.reload();
            } else {
                // Handle any other actions required after posting a comment, e.g., reloading comments
                onCommentPosted();
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsSending(false); // Reset the flag once the request is complete
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowReactionPicker(false);
            }
        };

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiPickerRef]);

    useEffect(() => {
        const handleTagSearch = async () => {
            const atIndex = inputValue.lastIndexOf("@");

            if (atIndex === -1 || cursorPosition <= atIndex + 1) {
                return;
            }

            const searchTerm = inputValue
                .slice(atIndex + 1, cursorPosition)
                .trim();

            if (searchTerm) {
                try {
                    const response = await fetch(
                        `/api/crud/users?search=${searchTerm}&with[]=profile`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setSearchResults(data.data.data);
                        console.log("searchResults", searchResults);
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
        setFileNames((prevFileNames) =>
            prevFileNames.filter((_, i) => i !== index)
        );
        setAttachments((prevAttachments) =>
            prevAttachments.filter((_, i) => i !== index)
        );
    };

    const { settings } = useSettings();

    const createFileInputHandler = (accept) => () => {
        let baseMaxSize = settings.max_file_size;

        if (accept === "video/*") {
            baseMaxSize = settings.max_video_size;
        } else if (accept === "image/*") {
            baseMaxSize = settings.max_image_size;
        }

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = accept;
        fileInput.multiple = true;
        fileInput.onchange = (e) => {
            // const file = e.target.files[0];

            let areAllUnderLimit = true;

            for (const file of e.target.files) {
                // 20MB
                // const maxSize = 20971520;
                const maxSize = baseMaxSize * 1000000;

                if (file.size > maxSize) {
                    areAllUnderLimit = false;
                    break;
                }
            }

            if (!areAllUnderLimit) {
                toastError(`File size should be less than ${baseMaxSize}MB`, {
                    icon: <CircleXIcon className="w-6 h-6 text-white" />,
                    theme: "colored",
                });

                return;
            }

            for (const file of e.target.files) {
                handleFileUpload(file);
            }
        };
        fileInput.click();
    };

    const handleClickImg = createFileInputHandler("image/*");
    const handleClickVid = createFileInputHandler("video/*");
    const handleClickDoc = createFileInputHandler(
        "application/pdf, .doc, .docx, .txt, .xlsx, .ppt, .pptx, .rar, .zip"
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
    };

    const closePopup = () => {
        setShowPollPopup(false);
        setShowPeoplePopup(false);
        setShowMediaTagPopup(false);
        setShowEventPopup(false);
    };

    const handleSaveTags = () => {
        setMediaTagCount(albums.length); // Set count to 1 if a tag is selected, otherwise 0
        closePopup(); // Close the popup
    };

    const handleSavePeople = (selectedPeople) => {
        setChosenPeople(selectedPeople); // Update chosenPeople state
        closePopup(); // Close the popup
    };

    const handleSaveEvent = (event) => {
        setChosenEvent(event); // Update chosenPeople state
        closePopup(); // Close the popup
    };

    // const handleReactionClick = (emojiObject) => {
    //     setInputValue(inputValue + emojiObject.emoji);
    //     setShowReactionPicker(false); // Close the reaction picker after selecting a reaction
    // };

    // const toggleReactionPicker = () => {
    //     setShowReactionPicker(!showReactionPicker);
    // };

    const handleReactionClick = (emojiObject, event) => {
        console.log("Emoji Object:", emojiObject);
        console.log("Event:", event);

        // Get the selected emoji
        const selectedEmoji = emojiObject.emoji || "";
        setInputValue((prevValue) => prevValue + selectedEmoji);
        setShowReactionPicker(false);
    };

    const toggleReactionPicker = () => {
        setShowReactionPicker(!showReactionPicker);
    };

    const { hasPermission, hasRole } = usePermissions();

    const canSetAnnouncement =
        (!communityId && !departmentId && hasRole("superadmin")) ||
        (communityId &&
            hasPermission(`set unset post as announcement ${communityId}`)) ||
        (departmentId &&
            hasPermission(`set unset post as announcement ${departmentId}`));

    return (
        <section className="flex flex-col justify-center text-sm text-neutral-800 w-full">
            <div
                className={cn(
                    `flex flex-col gap-0 justify-between px-8 pt-5 pb-2 rounded-2xl shadow-sm max-md:flex-wrap max-md:px-5 max-w-full`,
                    isComment ? "comment-box-container" : "input-box-container",
                    "relative"
                )}
            >
                <div className="flex flex-col w-full">
                    {isComment && (
                        <textarea
                            ref={textAreaRef}
                            value={inputValue}
                            onChange={handleChange}
                            placeholder="Add comment..."
                            className="self-center mt-1 h-8 px-2 mb-12 text-sm border-none appearance-none resize-none input-no-outline w-full"
                        />
                    )}
                    {!isComment && (
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
                                <div
                                    className="file-name inline-flex rounded-lg border-2 bg-gray-100 py-1 px-4 justify-between items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                    key={index}
                                >
                                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                                        {name}
                                    </span>
                                    <button
                                        className="ml-2 text-primary"
                                        onClick={() => removeFile(index)}
                                    >
                                        <img
                                            src="assets/cancel2.svg"
                                            alt="cancel icon"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className=" ">
                        <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-4 items-center">
                            {/* <button
                                className="tooltip"
                                onClick={toggleReactionPicker}
                            >
                                <img
                                    loading="lazy"
                                    src={Emoji}
                                    alt="Emoji Icon"
                                    className="w-[16px] h-[16px]"
                                />
                                <span className="tooltiptext">
                                    React 😀🤣😤
                                </span>
                            </button>
                            {showReactionPicker && (
                                <div
                                    ref={emojiPickerRef}
                                    className="emoji-picker-container "
                                >
                                    <Picker
                                        onEmojiClick={handleReactionClick} // Ensure this correctly triggers the handler
                                    />
                                </div>
                            )} */}

                            {isComment && (
                                <>
                                    <div className="flex flex-row w-full justify-between items-center mt-1">
                                        <div className="w-full flex justify-between">
                                            {/* <button
                                            type="button"
                                            onClick={handleClickPeople}
                                            className="tooltip relative text-md text-primary hover:text-blue-700"
                                        >
                                            <img
                                                loading="lazy"
                                                src="assets/inputpeople.svg"
                                                alt="People Icon"
                                                className="w-[16px] h-[16px]"
                                            />
                                            <span className="tooltiptext">Mentions People</span>
                                            {chosenPeople.length > 0 && (
                                                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary rounded-full">
                                                    {chosenPeople.length}
                                                </span>
                                            )}
                                        </button> */}
                                            <button
                                                className="tooltip"
                                                onClick={toggleReactionPicker}
                                            >
                                                <EmojiIcon className="w-[16px] h-[16px] text-primary" />
                                                <span className="tooltiptext">
                                                    React 😀🤣😤
                                                </span>
                                            </button>
                                            {showReactionPicker && (
                                                <div
                                                    ref={emojiPickerRef}
                                                    className="emoji-picker-container-comment"
                                                >
                                                    <Picker
                                                        onEmojiClick={
                                                            handleReactionClick
                                                        } // Ensure this correctly triggers the handler
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleClickSend}
                                            // className="flex send-button align-item justify-end"
                                        >
                                            {isSending ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <SendIcon className="h-6 w-6 text-secondary" />
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                            {!isComment && (
                                <>
                                    <div className="flex w-full max-md:flex-col lg:flex-row max-md:gap-4 lg: justify-between">
                                        <div className="flex w-full flex-row justify-between lg:w-2/3 max-md:py mr-4">
                                            <button
                                                className="tooltip"
                                                onClick={toggleReactionPicker}
                                            >
                                                <EmojiIcon className="w-[16px] h-[16px] text-primary" />
                                                <span className="tooltiptext">
                                                    React 😀🤣😤
                                                </span>
                                            </button>
                                            {showReactionPicker && (
                                                <div
                                                    ref={emojiPickerRef}
                                                    className="emoji-picker-container-input-box"
                                                >
                                                    <Picker
                                                        onEmojiClick={
                                                            handleReactionClick
                                                        } // Ensure this correctly triggers the handler
                                                    />
                                                </div>
                                            )}
                                            <button
                                                className="tooltip"
                                                onClick={handleClickPoll}
                                            >
                                                <PollsIcon className="w-4 h-4 text-primary" />
                                                <span className="tooltiptext">
                                                    Poll
                                                </span>
                                            </button>
                                            <button
                                                className="tooltip"
                                                onClick={handleClickImg}
                                            >
                                                <ImageIcon className="w-4 h-4 text-primary" />
                                                <span className="tooltiptext">
                                                    Image
                                                </span>
                                            </button>
                                            <button
                                                className="tooltip"
                                                onClick={handleClickVid}
                                            >
                                                <VideoIcon className="w-4 h-4 text-primary" />
                                                <span className="tooltiptext">
                                                    Video
                                                </span>
                                            </button>
                                            <button
                                                className="tooltip"
                                                onClick={handleClickDoc}
                                            >
                                                <DocumentIcon className="w-3 h-3 text-primary" />
                                                <span className="tooltiptext">
                                                    Document
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClickMediaTag}
                                                className="tooltip relative text-md text-primary hover:text-blue-700"
                                            >
                                                <AlbumIcon className="w-4 h-4 text-primary" />
                                                <span className="tooltiptext">
                                                    Album Tag
                                                </span>
                                                {mediaTagCount > 0 && (
                                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary rounded-full">
                                                        {mediaTagCount}
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClickEvent}
                                                className=" tooltip relative text-md text-primary hover:text-blue-700"
                                            >
                                                <EventIcon className="w-4 h-4 text-primary" />
                                                <span className="tooltiptext">
                                                    Event Tag
                                                </span>
                                                {chosenEvent.length > 0 && (
                                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary rounded-full">
                                                        {chosenEvent.length}
                                                    </span>
                                                )}
                                            </button>
                                        </div>

                                        {/* column baru */}
                                        <div className="flex flex-row w-full justify-between gap-4">
                                            <div className="flex flex-row w-full max-md:justify-between justify-end gap-4 whitespace-nowrap">
                                                {variant !== "comment" &&
                                                    canSetAnnouncement && (
                                                        <div className="w-full flex items-center justify-end max-md:justify-start">
                                                            <label className="text-sm mr-3">
                                                                Set as
                                                                Announcement?
                                                            </label>
                                                            <label className="switch">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        isAnnouncement
                                                                    }
                                                                    onChange={
                                                                        handleToggleChange
                                                                    }
                                                                />

                                                                <span className="slider"></span>
                                                            </label>
                                                        </div>
                                                    )}

                                                <SendAs
                                                    postAs={postAs}
                                                    onChange={(newPostAs) =>
                                                        setPostAs(newPostAs)
                                                    }
                                                    communityId={communityId}
                                                    departmentId={departmentId}
                                                />
                                                <div className="flex justify-end max-md:w-full">
                                                    <button
                                                        onClick={
                                                            handleClickSend
                                                        }
                                                        className="w-10 h-10 flex items-center justify-center"
                                                    >
                                                        {isSending ? (
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                        ) : (
                                                            <SendIcon className="h-6 w-6 text-secondary" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showMediaTagPopup && (
                <TagInput
                    tag={albums}
                    setTag={setAlbums}
                    onClose={closePopup}
                    onSave={handleSaveTags}
                />
            )}
            {showPollPopup && (
                <InputPolls
                    communityId={communityId}
                    departmentId={departmentId}
                    onClose={closePopup}
                    onCreatePoll={() => {
                        window.location.reload();
                    }}
                />
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
                    {searchResults
                        .filter((person) =>
                            person.name
                                .toLowerCase()
                                .includes(mentionQuery.toLowerCase())
                        )
                        .map((person) => (
                            <div
                                key={person.id}
                                onClick={() =>
                                    handleTagSelection(person.name, person.id)
                                }
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
