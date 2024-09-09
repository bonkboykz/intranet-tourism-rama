import React, { useState, useEffect } from "react";
import PageTitle from "../Components/Reusable/PageTitle";
import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import Example from "../Layouts/DashboardLayoutNew";
import "./css/StaffDirectory.css";
import "../Components/Reusable/css/FileManagementSearchBar.css";
import { router } from "@inertiajs/react";

const Media = () => {
    // const [selectedMedia, setSelectedMedia] = useState('All');
    const [posts, setPosts] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const url = "/api/posts/posts?with[]=attachments";
            const options = {
                method: "GET",
                headers: { Accept: "application/json" },
            };
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                // Filter out posts with type 'story'
                const filteredData = data.data.data.filter(
                    (post) => post.type !== "story"
                );

                setPosts(filteredData);
                // Extract unique tag values
                const uniqueTags = [
                    ...new Set(
                        data.data.data.flatMap((post) => post.tag || [])
                    ),
                ];
                setTagOptions(uniqueTags);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    console.log("DATA", posts);

    useEffect(() => {
        if (selectedTag === "") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(
                posts.filter(
                    (post) => post.tag && post.tag.includes(selectedTag)
                )
            );
        }
    }, [selectedTag, posts]);

    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    const renderImages = () => {
        return filteredPosts.map((post) =>
            post.attachments
                ?.filter((attachment) =>
                    attachment.mime_type.startsWith("image/")
                )
                .map((imageAttachment) => (
                    <img
                        key={imageAttachment.id}
                        src={`/storage/${imageAttachment.path}`}
                        alt="Image Attachment"
                        className="grow shrink-0 max-w-full aspect-[1.19] w-full object-cover"
                    />
                ))
        );
    };

    const renderVideos = () => {
        return filteredPosts.map((post) =>
            post.attachments
                ?.filter((attachment) =>
                    attachment.mime_type.startsWith("video/")
                )
                .map((videoAttachment) => (
                    <video
                        key={videoAttachment.id}
                        controls
                        src={`/storage/${videoAttachment.path}`}
                        className="grow shrink-0 max-w-full aspect-[1.19] w-full"
                    />
                ))
        );
    };

    const handleManageAlbum = () => {
        router.visit("/album");
    };

    return (
        <Example>
            <main className="min-h-screen bg-gray-100 xl:pl-96">
                <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                    <div>
                        <div className="relative flex flex-col justify-center max-w-full text-sm text-neutral-800">
                            <div
                                style={{ width: "180px" }}
                                className="flex justify-between gap-5 px-4 py-1 bg-white shadow-custom cursor-pointer rounded-2xl"
                            >
                                <select
                                    value={selectedTag}
                                    onChange={handleTagChange}
                                >
                                    <option value="">All</option>
                                    {tagOptions.map((tag, index) => (
                                        <option key={index} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="ml-auto">
                                {/* Manage Album Button */}
                                <button
                                    className="px-8 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                    onClick={handleManageAlbum}
                                >
                                    Manage Album
                                </button>
                            </div>
                        </div>

                        <div>
                            <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl shadow-lg mt-4">
                                <header>
                                    <h1 className="pb-2 text-2xl font-bold text-neutral-800 max-md:max-w-full">
                                        Images
                                    </h1>
                                    <hr className="underline" />
                                </header>
                                <section className="mt-4 max-md:max-w-full">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                                        {/* <h1 className="pb-2 text-2xl font-bold text-neutral-800 max-md:max-w-full">Images</h1> */}
                                        {renderImages()}
                                    </div>
                                </section>
                            </section>
                        </div>
                        <div>
                            <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl shadow-lg mt-4">
                                <header>
                                    <h1 className="pb-2 text-2xl font-bold text-neutral-800 max-md:max-w-full">
                                        Videos
                                    </h1>
                                    <hr className="underline" />
                                </header>
                                <section className="mt-4 max-md:max-w-full">
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                                        {/* <h1 className="pb-2 text-2xl font-bold text-neutral-800 max-md:max-w-full">Images</h1> */}
                                        {renderVideos()}
                                    </div>
                                </section>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <aside className="fixed bottom-0 hidden px-4 py-6 overflow-y-auto border-r border-gray-200 left-20 top-16 w-96 sm:px-6 lg:px-8 xl:block">
                <style>
                    {`
            aside::-webkit-scrollbar {
                width: 0px;
                background: transparent;
            }
            `}
                </style>
                <div className="file-directory-header">
                    <PageTitle title="Media" />
                </div>
                <hr className="file-directory-underline" />

                <div>
                    <FeaturedEvents />
                    {/* <WhosOnline /> */}
                </div>
            </aside>
        </Example>
    );
};

export default Media;
