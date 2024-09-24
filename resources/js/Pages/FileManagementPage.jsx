import React, { useState } from "react";
import { usePage } from "@inertiajs/react";

import { FileTable } from "@/Components/FileManagement";
import Example from "@/Layouts/DashboardLayoutNew";

import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import SearchFile from "../Components/Reusable/FileManagementSearchBar";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";

import "./css/StaffDirectory.css";
import "../Components/Reusable/css/FileManagementSearchBar.css";

const FileManage = ({ requiredData, onFileUploaded }) => {
    const { id } = usePage().props; // Retrieve the user_id from the Inertia view
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <Example>
            <main className="z-0 min-h-screen w-full bg-gray-100 flex-row flex justify-center items-start gap-20 md:gap-12">
                {/* left widgets */}
                <div className="z-0 pl-10 pt-10 pb-20 overflow-y-auto h-auto w-full max-w-[330px] max-h-[100vh] sticky top-0 hidden md:hidden lg:block no-scrollbar">
                    <div className="file-directory-header">
                        <PageTitle title="Files" />
                    </div>
                    <hr className="file-directory-underline" />
                    <div>
                        <FeaturedEvents />
                        <WhosOnline />
                    </div>
                </div>

                {/* main content */}
                <div className="flex flex-col justify-center w-full max-w-[1200px] pt-10 max-md:px-6 mr-10 max-md:ml-10 lg:ml-0 md:ml-10">
                    <SearchFile
                        userId={id}
                        onSearch={setSearchTerm}
                        requiredData={requiredData}
                        onFileUploaded={onFileUploaded}
                    />
                    <FileTable searchTerm={searchTerm} isManagement />
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
                    <PageTitle title="File" />
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

export default FileManage;
