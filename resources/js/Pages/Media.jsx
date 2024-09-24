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
    const [selectedTag, setSelectedTag] = useState("");
    const [tagOptions, setTagOptions] = useState([]);

    const { hasRole } = usePermissions();

    const [isLoading, setIsLoading] = useState(false);

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
    }, []);

    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    const handleManageAlbum = () => {
        router.visit("/album");
    };

    return (
        <Example>
            <main className="z-0 min-h-screen w-full bg-gray-100 flex-row flex justify-center items-start gap-20 md:gap-12">
                {/* left widgets */}
                <div className="z-0 pl-10 pt-10 pb-20 overflow-y-auto h-auto w-full max-w-[330px] max-h-[100vh] sticky top-0 hidden md:hidden lg:block no-scrollbar">
                    <div className="file-directory-header">
                        <PageTitle title="Media" />
                    </div>
                    <hr className="file-directory-underline" />
                    <div>
                        <FeaturedEvents />
                        <WhosOnline />
                    </div>
                </div>

                {/* main content */}
                <div className="flex flex-col justify-center w-full max-w-[1200px] pt-10 max-md:px-6 mr-10 max-md:ml-10 lg:ml-0 md:ml-10">
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

                    <Gallery selectedTag={selectedTag} />
                </div>
            </main>
            {/* <aside className="fixed bottom-0 hidden px-4 py-6 overflow-y-auto border-r border-gray-200 left-20 top-16 w-96 sm:px-6 lg:px-8 xl:block">
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
            </aside> */}
        </Example>
    );
};

export default Media;
