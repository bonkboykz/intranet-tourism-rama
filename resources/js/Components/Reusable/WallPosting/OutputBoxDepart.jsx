import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";

// function userid({ setSidebarOpen }) {
//     const { props } = usePage();
//     const { id } = props; // Access the user ID from props
//     const [userData, setUserData] = useState({
//         name: "",
//         profileImage: "",
//     });}

function Avatar({ src, alt }) {
    return (
        <img
            loading="lazy"
            src={src}
            alt={alt}
            className="shrink-0 aspect-square w-[53px]"
        />
    );
}

function UserInfo({ name, timestamp }) {
    return (
        <div className="flex flex-col my-auto">
            <div className="text-base font-bold text-neutral-800">{name}</div>
            <div className="mt-3 text-xs text-neutral-800 text-opacity-50">
                {timestamp}
            </div>
        </div>
    );
}

function FeedbackOption({ optionText, onVote }) {
    return (
        <div className="flex gap-2.5 px-3.5 py-2.5 mt-4 text-sm leading-5 bg-gray-100 rounded-3xl text-neutral-800 max-md:flex-wrap">
            <div className="shrink-0 self-start w-3 bg-white rounded-full h-[11px]" />
            <div className="flex-auto max-md:max-w-full">{optionText}</div>
            <button className="ml-2 text-blue-500" onClick={onVote}>
                Vote
            </button>
        </div>
    );
}

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

function FeedbackForm() {
    const [inputValue, setInputValue] = useState("");
    const textAreaRef = useRef(null);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const HandleFeedbackClick = (event) => {
        event.preventDefault();
        console.log("Sending Form...");
    };

    return (
        <form className="flex gap-3.5 mt-4 max-md:flex-wrap max-md:max-w-full">
            <textarea
                ref={textAreaRef}
                value={inputValue}
                onChange={handleChange}
                placeholder="Give Your Feedback"
                className="grow justify-center items-start px-5 py-3 text-sm leading-5 rounded-md border border-gray-100 border-solid text-neutral-800 text-opacity-50 w-fit max-md:px-5 max-md:max-w-full"
                rows="4"
                style={{ maxHeight: "30px", overflowY: "auto" }}
            />
            <button
                className="flex flex-col justify-center my-auto text-xs font-semibold leading-5 text-center text-white whitespace-nowrap px-6 py-2 bg-red-500 rounded-2xl max-md:px-5"
                onClick={HandleFeedbackClick}
            >
                Send
            </button>
        </form>
    );
}

// function IconButton({ src, alt }) {
// return <img loading="lazy" src={src} alt={alt} className="shrink-0 w-7 aspect-square" />;
// }

function OutputDataDepart({ polls }) {
    const [postData, setPostData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [votes, setVotes] = useState({}); // Track votes for each poll
    const [isPopupOpen, setIsPopupOpen] = useState({});

    const { props } = usePage();
    const { id } = props; // Access the user ID from props
    const [userData, setUserData] = useState({
        name: "",
        profileImage: "",
    });

    useEffect(() => {
        console.log("Fetching user data...");
        fetch(`/api/crud/users/${id}?with[]=profile`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            //-----------------------------//
            .then(({ data }) => {
                setUserData((pv) => ({
                    ...pv,
                    ...data,
                    name: data.name,
                    profileImage:
                        data.profile && data.profile.image
                            ? data.profile.image
                            : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${data.name}&rounded=true`,
                }));
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, [id]);

    const handleLogout = (event) => {
        event.preventDefault();
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
        })
            .then(() => {
                window.location.href = "/";
            })
            .catch((err) => console.error(err));
    }; //------------------------//

    useEffect(() => {
        fetch("/api/posts/posts?with[]=attachments", {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                const posts = data.data.data
                    .filter((post) => post.type === "department") // Filter posts by type
                    .map((post) => {
                        post.attachments = Array.isArray(post.attachments)
                            ? post.attachments
                            : [post.attachments];
                        return post;
                    })
                    .sort(
                        (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                    ); // Sort posts by timestamp in descending order
                setPostData(posts);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setLoading(false);
            });
    }, []);
    const handleVote = (pollId, optionIndex) => {
        const updatedVotes = { ...votes };
        if (!updatedVotes[pollId]) {
            updatedVotes[pollId] = new Array(
                polls.find((poll) => poll.id === pollId).options.length
            ).fill(0);
        }
        updatedVotes[pollId][optionIndex] += 1;
        setVotes(updatedVotes);
    };

    const calculatePercentage = (pollId, optionIndex) => {
        if (!votes[pollId]) return 0;
        const totalVotes = votes[pollId].reduce((acc, count) => acc + count, 0);
        if (totalVotes === 0) return 0;
        return ((votes[pollId][optionIndex] / totalVotes) * 100).toFixed(1);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {polls.map((poll, index) => (
                <div
                    className="input-box-container"
                    style={{ height: "auto", marginTop: "-10px" }}
                    key={poll.id}
                >
                    <article className="flex flex-col px-5 py-4 bg-white rounded-xl shadow-sm max-w-[610px] max-md:pl-5">
                        <ProfileHeader
                            name="Fareez Hishamuddin"
                            timeAgo="1 day ago"
                            profileImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/726408370b648407cc55fec1ee24245aad060d459ac0f498438d167758c3a165?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                            profileImageAlt="Profile image of Thomas"
                        />
                        <div className="poll">
                            <h3>{poll.content}</h3>
                            <ul>
                                {poll.options.map((option, i) => (
                                    <li key={i}>
                                        <FeedbackOption
                                            optionText={`${option} (${calculatePercentage(poll.id, i)}%)`}
                                            onVote={() =>
                                                handleVote(poll.id, i)
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <FeedbackForm />
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d36c4e55abf5012ece1a90ed95737b46c9b6970a05e3182fdd6248adca09028e?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                            alt=""
                            className="mt-6 aspect-[4.55] w-[76px]"
                        />
                    </article>
                </div>
            ))}
            {postData &&
                postData.map((post, index) => (
                    <div key={post.id} className="">
                        <article className="mt-4 p-4 border rounded-2xl bg-white border-2 shadow-xl w-[875px] relative">
                            <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full">
                                <div className="flex gap-1 mt-2"></div>

                                {/* icon speaker & 3 dot*/}

                                <div className="flex justify-between items-start px-1 w-full mb-4 p-2 ">
                                    <div className="flex flex-col ">
                                        <div className="flex flex-row items-center gap-2">
                                            <img
                                                className="w-8 h-8 rounded-full bg-gray-50"
                                                src={
                                                    userData.profileImage ??
                                                    "https://cdn.builder.io/api/v1/image/assets/TEMP/b68c042fe15637d83658e190705206009d4017b640a612fd4286280043e4c258?"
                                                }
                                                alt=""
                                            />
                                            <div className="flex flex-col">
                                                <span
                                                    className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                                                    aria-hidden="true"
                                                >
                                                    {userData.name}
                                                </span>

                                                <p className="a few minute ago">
                                                    2 hours ago
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <img
                                        loading="lazy"
                                        src="assets/wallpost-dotbutton.svg"
                                        alt="Options"
                                        className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer"
                                        onClick={() => togglePopup(index)}
                                    />
                                </div>

                                {isPopupOpen[index] && (
                                    <div className="absolute bg-white border-2 rounded-xl p-1 shadow-lg mt-14 right-0 w-[160px] h-auto z-10 ">
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

                            <div className="flex justify-start gap-2 w-5 h-5 mt-2">
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
                        </article>
                    </div>
                ))}
        </>
    );
}

export default OutputDataDepart;
