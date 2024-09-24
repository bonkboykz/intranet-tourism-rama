import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { cn } from "@/Utils/cn";

import {
    ChosenEvent,
    Event,
    RecommendedEvent,
    SearchEventInput,
} from "./InputEvent";
import TaggedItem from "./TaggedItem";
import { UserProfileAvatar } from "./UserProfileAvatar";

function EditPost({
    post,
    onClose,
    loggedInUserId,
    onClosePopup,
    refetchPost,
}) {
    const [content, setContent] = useState(post.content || "");
    const [attachments, setAttachments] = useState(post.attachments || []);
    const [albums, setAlbums] = useState(
        [...(post.albums ?? [])].filter(Boolean)
    );

    const [chosenEvent, setChosenEvent] = useState(
        post.event ? JSON.parse(post.event) : []
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setContent(post.content || "");
        // setAlbums(post.albums || []);
        setAttachments(post.attachments || []);
    }, [post]);

    const handleInputChange = (event) => {
        setContent(event.target.value);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setAttachments([...attachments, ...files]);
    };

    const handleDeleteAttachment = (index) => {
        setAttachments((prevAttachments) =>
            prevAttachments.filter((_, i) => i !== index)
        );
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("user_id", loggedInUserId);

            formData.append("type", post.type);
            formData.append("visibility", post.visibility);

            // Check if content is not empty or just whitespace before adding to FormData
            if (content.trim()) {
                formData.append("content", content);
            }

            if (albums.length > 0) {
                for (let [index, album] of albums.entries()) {
                    formData.append(`albums[${index}]`, album.id);
                }
            } else if (albums.length === 0) {
                formData.append("remove_albums", "");
            }

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
            } else {
                formData.append("remove_events", "");
            }

            attachments.forEach((file, index) => {
                if (file instanceof File) {
                    formData.append(`attachments[${index}]`, file);
                } else {
                    formData.append(`attachments[${index}]`, file);
                }
            });

            const response = await axios.post(
                `/api/posts/posts/${post.id}`,
                formData
            );

            onClose();
            onClosePopup();
            refetchPost();
        } catch (error) {
            console.error("Error updating post:", error);
        }

        setLoading(false);
    };

    const [allAlbums, setAllAlbums] = useState([]);

    // console.log("allAlbums", allAlbums, albums);

    useEffect(() => {
        axios.get("/api/album").then((response) => {
            setAllAlbums(response.data.data);
            // if (post.albums && post.albums.length > 0) {
            //     console.log("setter", post.albums[0]);
            //     setAlbums([post.albums[0]]);
            // }
        });
    }, []);

    // useEffect(() => {
    //     if (albums.length > 0) {
    //         setAllAlbums(
    //             allAlbums.map((album) => {
    //                 if (album.id === albums[0].id) {
    //                     return { ...album, hidden: false };
    //                 }

    //                 return album;
    //             })
    //         );
    //     }
    // }, [albums.length]);

    const [searchEventResults, setSearchEventResults] = useState([]);

    const handleAddEvent = (event) => {
        setChosenEvent([
            {
                id: event.id,
                title: event.title,
            },
        ]);
    };

    const handleRemoveEvent = (id) => {
        setChosenEvent([]);
    };

    return (
        <>
            <div className="flex flex-row justify-between items-center w-full max-md:w-full mb-4">
                <h2 className="font-bold text-2xl">Edit Post</h2>
                <button onClick={onClose}>
                    <img
                        src="/assets/cancel.svg"
                        alt="Close icon"
                        className="w-6 h-6"
                    />
                </button>
            </div>
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
                        value={content}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        placeholder="Edit caption"
                    />
                    <div>
                        <div className="font-semibold text-lg mt-4">
                            Edit album tag
                        </div>
                        <div className="flex flex-col gap-0">
                            <ChosenEvent
                                chosenEvent={chosenEvent}
                                onRemoveEvent={handleRemoveEvent}
                            />

                            <SearchEventInput
                                onSearchResults={setSearchEventResults}
                            />

                            <div className="max-h-[300px] overflow-y-auto">
                                {searchEventResults.map((event) => (
                                    <RecommendedEvent
                                        key={event.id}
                                        event={event}
                                        onAddEvent={handleAddEvent}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="tags-container mt-3">
                            {allAlbums.map((allAlbum, index) => (
                                <div
                                    key={allAlbum.id}
                                    className={cn(
                                        "tag",
                                        allAlbum.hidden && "none",
                                        "cursor-pointer"
                                    )}
                                    onClick={() => {
                                        setAlbums([allAlbum]);
                                    }}
                                >
                                    {allAlbum.name}
                                    <div>+</div>
                                </div>
                            ))}
                        </div>

                        <div
                            className="tagged-items-container"
                            style={{ minHeight: "30px" }}
                        >
                            {albums.length > 0 ? (
                                <TaggedItem
                                    tag={albums[0]}
                                    onRemove={() => setAlbums([])}
                                />
                            ) : (
                                <div className="text-neutral-400 text-sm">
                                    No tag selected.
                                </div>
                            )}
                        </div>
                    </div>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mt-2"
                        multiple
                    />
                    <div className="flex flex-col w-full gap-2 mt-2 items-center">
                        {attachments.map((attachment, index) => (
                            <div
                                key={index}
                                className="relative attachment w-full"
                            >
                                {attachment.mime_type &&
                                attachment.mime_type.startsWith("image/") ? (
                                    <>
                                        <img
                                            src={`/storage/${attachment.path}`}
                                            alt="attachment"
                                            className="w-full h-auto rounded-lg"
                                        />

                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 text-red-500 border-red-500 w-8 h-8 bg-white cursor-pointer hover:bg-red-500 hover:text-white rounded-full"
                                            onClick={() =>
                                                handleDeleteAttachment(index)
                                            }
                                        >
                                            X
                                        </button>
                                    </>
                                ) : attachment.mime_type &&
                                  attachment.mime_type.startsWith("video/") ? (
                                    <>
                                        <video
                                            controls
                                            className="grow shrink-0 max-w-full aspect-[1.19] w-full"
                                        >
                                            <source
                                                src={`/storage/${attachment.path}`}
                                            />
                                            Your browser does not support the
                                            video tag.
                                        </video>

                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 text-red-500 border-red-500 w-8 h-8 bg-white cursor-pointer hover:bg-red-500 hover:text-white rounded-full"
                                            onClick={() =>
                                                handleDeleteAttachment(index)
                                            }
                                        >
                                            X
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex items-center w-full h-10 bg-gray-100 border-2 border-gray-300 rounded-xl px-2">
                                        <a
                                            href={`/storage/${attachment.path}`}
                                            download
                                            className="flex-1 text-sm w-full font-semibold text-start ml-2"
                                        >
                                            Download {attachment.file_name}
                                        </a>
                                        <button
                                            type="button"
                                            className="text-blue-500 px-2"
                                            onClick={() =>
                                                handleDeleteAttachment(index)
                                            }
                                        >
                                            X
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </form>
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
                    className="mt-2 px-4 py-2 font-bold hover:bg-blue-700 bg-blue-500 text-white rounded-full text-sm"
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

export default EditPost;
