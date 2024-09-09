import React, { useState } from "react";
import PageTitle from "../Components/Reusable/PageTitle";
import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import SearchFile from "../Components/Reusable/FileManagementSearchBar";
import { FileTable } from "@/Components/FileManagement";
import "./css/StaffDirectory.css";
import "../Components/Reusable/css/FileManagementSearchBar.css";
import Example from "@/Layouts/DashboardLayoutNew";
import { usePage } from "@inertiajs/react";

const FileManage = ({ requiredData, onFileUploaded }) => {
    const { id } = usePage().props; // Retrieve the user_id from the Inertia view
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <Example>
            <main className="min-h-screen bg-gray-100 xl:pl-96 ">
                <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                    <div>
                        <SearchFile
                            userId={id}
                            onSearch={setSearchTerm}
                            requiredData={requiredData}
                            onFileUploaded={onFileUploaded}
                        />
                        <FileTable searchTerm={searchTerm} />
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
                    <PageTitle title="File" />
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

export default FileManage;
