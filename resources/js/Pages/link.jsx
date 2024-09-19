import React from "react";

import FeaturedEvents from "@/Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import Pautan from "@/Components/Settings/LinkComponent";
import Example from "@/Layouts/DashboardLayoutNew";

import PageTitle from "../Components/Reusable/PageTitle";

const Settings = () => {
    const handleLinkNavigation = () => {
        window.location.href = route("manage-links");
    };

    const handleFolderNavigation = () => {
        window.location.href = route("manage-folders");
    };

    return (
        <Example>
            <div className="flex flex-col w-full min-h-screen bg-gray-100">
                {/* Main Title inside the gray background */}
                <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-100">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Link Management
                    </h1>
                </div>

                <div className="flex flex-row w-full">
                    {/* Left section for System */}
                    <div className="flex flex-col w-1/2 p-4 sm:p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <PageTitle title="System" />
                            <button
                                className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                onClick={handleLinkNavigation}
                            >
                                Manage System
                            </button>
                        </div>
                        <Pautan />
                    </div>

                    {/* Right section for Official Folder */}
                    <div className="flex flex-col w-1/2 p-4 sm:p-6 lg:p-8 border-l border-gray-300">
                        <div className="flex items-center justify-between mb-4">
                            <PageTitle title="Official Folder" />
                            <button
                                className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                onClick={handleFolderNavigation}
                            >
                                Manage File
                            </button>
                        </div>
                        {/* Placeholder for folder-related content */}
                        <div className="bg-white p-6 shadow-sm rounded-lg">
                            <p>Folder component or content goes here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Example>
    );
};

export default Settings;

//link.jsx
