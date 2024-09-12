import React, { useState, useEffect } from "react";
import PageTitle from "../Components/Reusable/PageTitle";
import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import Example from "../Layouts/DashboardLayoutNew";
import "./css/StaffDirectory.css";
import "../Components/Reusable/css/FileManagementSearchBar.css";
import { router } from "@inertiajs/react";
import { Gallery } from "./Media/Gallery";

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

    // console.log("DATA", posts);

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

                        <Gallery filteredPosts={filteredPosts} />
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
