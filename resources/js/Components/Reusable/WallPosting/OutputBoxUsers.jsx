import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

function ProfileHeader({ name, timeAgo, profileImageSrc, profileImageAlt }) {
    return (
        <header className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
            <div className="flex gap-1.5">
                <img
                    loading="lazy"
                    src={profileImageSrc}
                    alt={profileImageAlt}
                    className="shrink-0 aspect-square w-[53px]"
                />
                <div className="flex flex-col my-auto">
                    <div className="text-base font-semibold text-neutral-800">
                        {name}
                    </div>
                    <time className="mt-3 text-xs text-neutral-800 text-opacity-50">
                        {timeAgo}
                    </time>
                </div>
            </div>
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e3c193bbbcd5eca7bf933dad4a6932d076b04eb038d7635c591737bbebdc61ef?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                alt=""
                className="shrink-0 self-start aspect-[3.85] w-[19px]"
            />
        </header>
    );
}

function FeedbackOption({ optionText }) {
    return (
        <div className="flex gap-2.5 px-3.5 py-2.5 mt-4 text-sm leading-5 bg-gray-100 rounded-3xl text-neutral-800 max-md:flex-wrap">
            <div className="shrink-0 self-start w-3 bg-white rounded-full h-[11px]" />
            <div className="flex-auto max-md:max-w-full">{optionText}</div>
        </div>
    );
}

function FeedbackForm() {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleFeedbackClick = (event) => {
        event.preventDefault(); // Prevents the default form submission
        console.log("Sending Form...");
    };

    return (
        <form className="flex gap-3.5 mt-4 max-md:flex-wrap max-md:max-w-full">
            <textarea
                value={inputValue}
                onChange={handleChange}
                placeholder="Give Your Feedback"
                className="grow justify-center items-start px-5 py-3 text-sm leading-5 rounded-md border border-gray-100 border-solid text-neutral-800 text-opacity-50 w-fit max-md:px-5 max-md:max-w-full"
                rows="4"
                style={{ maxHeight: "30px", overflowY: "auto" }}
            />
            <button
                className="flex flex-col justify-center my-auto text-xs font-semibold leading-5 text-center text-white whitespace-nowrap px-6 py-2 bg-red-500 rounded-2xl max-md:px-5"
                onClick={handleFeedbackClick}
            >
                Send
            </button>
        </form>
    );
}

function OutputDataUsers({ userId }) {
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState({});

    useEffect(() => {
        // Fetch all posts
        fetch("/api/posts/posts?with[]=user&with[]=attachments")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched all posts:", data.data.data);
                setAllPosts(data.data.data); // Store all posts
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching all posts:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Filter posts by userId
        if (allPosts.length > 0) {
            const filtered = allPosts.filter((post) => post.user_id === userId);
            console.log("Filtered Post", filtered);
            setFilteredPosts(filtered.reverse());
        }
    }, [allPosts, userId]);

    const togglePopup = (index) => {
        setIsPopupOpen((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const formatTimeAgo = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {filteredPosts.map((post, index) => (
                <div key={post.id} className="">
                    <article className="mt-4 p-4 rounded-2xl border-2 shadow-sm w-full relative">
                        <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full">
                            <div className="flex gap-1 mt-2"></div>

                            {/* icon speaker & 3 dot*/}
                            <div className="flex justify-between items-start px-1 w-full mb-4 p-2 -ml-2 -mt-3">
                                <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
                                    <div className="flex gap-1.5 -mt-1">
                                        <img
                                            loading="lazy"
                                            src={
                                                post.user.profileImage ??
                                                `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(post.user.name)}&rounded=true`
                                            }
                                            alt={post.user.name}
                                            className="shrink-0 aspect-square w-[53px]"
                                        />
                                        <div className="flex flex-col my-auto">
                                            <div className="text-base font-semibold text-neutral-800">
                                                {post.user.name}
                                            </div>
                                            <time className="mt-1 text-xs text-neutral-800 text-opacity-50">
                                                {formatTimeAgo(post.created_at)}
                                            </time>
                                        </div>
                                    </div>
                                    <img
                                        loading="lazy"
                                        src="/assets/wallpost-dotbutton.svg"
                                        alt="Options"
                                        className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer"
                                        style={{ marginTop: "7px" }}
                                        onClick={() => togglePopup(index)}
                                    />
                                </div>
                            </div>

                            {isPopupOpen[index] && (
                                <div className="absolute bg-white border-2 rounded-xl p-1 shadow-lg mt-6 right-0 w-[160px] h-auto z-10 ">
                                    <p
                                        className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl  p-2"
                                        onClick={() => handleEdit(index)}
                                    >
                                        <img
                                            className="w-6 h-6"
                                            src="/assets/EditIcon.svg"
                                            alt="Edit"
                                        />
                                        Edit
                                    </p>
                                    <div className="font-extrabold text-neutral-800 mb-1 mt-1 border-b-2 border-neutral-300"></div>

                                    <p
                                        className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                                        onClick={() => handleDelete(index)}
                                    >
                                        <img
                                            className="w-6 h-6"
                                            src="/assets/deleteicon.svg"
                                            alt="Delete"
                                        />
                                        Delete
                                    </p>
                                    <div className="font-extrabold text-neutral-800 mb-2 mt-1 border-b-2 border-neutral-300"></div>

                                    <p
                                        className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                                        onClick={() =>
                                            handleAnnouncement(index)
                                        }
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
                        </header>

                        <div
                            className=" post-content break-words overflow-hidden"
                            style={{
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {post.content}
                        </div>

                        <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 underline max-md:max-w-full">
                            {post.tag}
                        </p>

                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {post.attachments.map((attachment, index) => (
                                <div key={index} className="attachment">
                                    {attachment.mime_type.startsWith(
                                        "image/"
                                    ) ? (
                                        <img
                                            src={`/storage/${attachment.path}`}
                                            alt="attachment"
                                            className="w-full h-auto rounded-lg"
                                        />
                                    ) : attachment.mime_type.startsWith(
                                          "video/"
                                      ) ? (
                                        <video
                                            controls
                                            className="max-w-full h-auto rounded-md"
                                        >
                                            <source
                                                src={`/storage/${attachment.path}`}
                                                alt="attachment"
                                                className="w-full h-auto rounded-lg"
                                            />
                                            Your browser does not support the
                                            video tag.
                                        </video>
                                    ) : (
                                        <a
                                            href={`/storage/${attachment.path}`}
                                            download
                                            className="block w-full h-24 bg-gray-100 rounded-lg text-xs font-semibold text-center leading-24"
                                        >
                                            Download {attachment.file_name}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-start gap-2 w-5 h-5 mt-2">
                            {/* Like, comment, share icons */}
                            <img
                                src="/assets/likeforposting.svg"
                                alt="Like"
                                className="w-6 h-6 cursor-pointer"
                            />
                            <img
                                src="/assets/commentforposting.svg"
                                alt="Comment"
                                className="w-6 h-6 cursor-pointer"
                            />
                            <img
                                src="/assets/shareforposting.svg"
                                alt="Share"
                                className="w-6 h-6 cursor-pointer"
                            />
                        </div>
                    </article>
                </div>
            ))}
        </>
    );
}

export default OutputDataUsers;
