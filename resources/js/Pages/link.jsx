import React from "react";

import Pautan from "@/Components/Settings/LinkComponent";
import Example from "@/Layouts/DashboardLayoutNew";
import { usePermissions } from "@/Utils/hooks/usePermissions";

// import PageTitle from "../Components/Reusable/PageTitle";

const Settings = () => {
    const handleLinkNavigation = () => {
        window.location.href = "manage-links";
    };

    const handleFolderNavigation = () => {
        window.location.href = "manage-folders";
    };

    const { hasRole } = usePermissions();

    const isSuperAdmin = hasRole("superadmin");

    return (
        <Example>
            <div className="flex flex-col w-full min-h-screen bg-gray-100">
                {/* Main Title inside the gray background */}
                <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-100">
                    <h1 className="text-4xl font-bold text-gray-900">Link</h1>
                </div>

                <div className="flex flex-col md:flex-row w-full">
                    {/* Top section for Department Links */}
                    <div className="flex flex-col w-full md:w-1/2 p-4 sm:p-6 lg:p-8 md:border-r border-gray-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                                    Systems
                                </h1>
                                {/* Add description for Systems */}
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Links to external sources
                                </p>
                            </div>
                            {isSuperAdmin && (
                                <button
                                    className="px-4 py-2 font-bold text-white bg-primary rounded-full hover:bg-primary-hover"
                                    onClick={handleLinkNavigation}
                                >
                                    Manage system
                                </button>
                            )}
                        </div>
                        {/* Display only department links */}
                        <Pautan displayType="nonDepartment" />
                    </div>

                    {/* Bottom section for Non-Department Links */}
                    <div className="flex flex-col w-full md:w-1/2 p-4 sm:p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                                    Official File
                                </h1>
                                {/* Add description for Official File */}
                                <p className="text-gray-600 text-sm sm:text-base">
                                    User can access certain files from here
                                </p>
                            </div>
                            {isSuperAdmin && (
                                <button
                                    className="px-4 py-2 font-bold text-white bg-primary rounded-full hover:bg-primary-hover"
                                    onClick={handleFolderNavigation}
                                >
                                    Manage File
                                </button>
                            )}
                        </div>
                        {/* Display only non-department links */}
                        <Pautan displayType="department" />
                    </div>
                </div>
            </div>
        </Example>
    );
};

export default Settings;
