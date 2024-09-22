import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

import { useLazyLoading } from "@/Utils/hooks/useLazyLoading";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import Example from "../Layouts/DashboardLayoutNew";
import { Gallery } from "./Media/Gallery";

import "./css/StaffDirectory.css";
import "../Components/Reusable/css/FileManagementSearchBar.css";

const Media = () => {
    // const [selectedMedia, setSelectedMedia] = useState('All');
    const [posts, setPosts] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    const { hasRole } = usePermissions();

    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        const url = "/api/posts/public_media";

        try {
            const response = await axios.get(url, {
                params: {
                    ...(selectedTag !== "" && {
                        album_id: selectedTag,
                    }),
                },
            });
            const data = response.data.data;
            // Filter out posts with type 'story'
            // const filteredData = data.filter((post) => post.type !== "story");

            setPosts(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        setIsLoading(false);
    };

    const fetchTags = async () => {
        const url = "/api/album";

        try {
            const response = await axios.get(url);
            const data = response.data.data;
            setTagOptions(data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    useEffect(() => {
        fetchTags();
        fetchData();
    }, []);
    // console.log("DATA", posts);

    useEffect(() => {
        fetchData();
    }, [selectedTag]);

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
                        <div className="w-full flex flex-row justify-between items-center">
                            <div className="relative flex flex-col justify-center max-w-full text-sm text-neutral-800">
                                <div
                                    style={{ width: "180px" }}
                                    className="flex justify-between gap-5 px-4 py-1 bg-white shadow-custom cursor-pointer rounded-2xl"
                                >
                                    <select
                                        disabled={isLoading}
                                        value={selectedTag}
                                        onChange={handleTagChange}
                                        className="border-none outline-none w-full"
                                    >
                                        <option value="">All</option>
                                        {tagOptions.map((tag, index) => (
                                            <option key={index} value={tag.id}>
                                                {tag.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {hasRole("superadmin") && (
                                <div className="ml-auto">
                                    {/* Manage Album Button */}
                                    <button
                                        className="px-8 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                        onClick={handleManageAlbum}
                                    >
                                        Manage Album
                                    </button>
                                </div>
                            )}
                        </div>

                        <Gallery
                            filteredPosts={posts}
                            selectedTag={selectedTag}
                        />
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
                    <WhosOnline />
                </div>
            </aside>
        </Example>
    );
};

export default Media;
