import React, { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";

import { FileTable } from "@/Components/FileManagement";
import Example from "@/Layouts/DashboardLayoutNew";

import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import SearchFile from "../Components/Reusable/FileManagementSearchBar";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";

import "./css/StaffDirectory.css";
import "../Components/Reusable/css/FileManagementSearchBar.css";

const Filter = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("By Name");
    const menuRef = useRef(null);

    const filters = [
        { value: "name", label: "By Name" },
        { value: "author", label: "By Author" },
    ];

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter.label);
        onFilterChange(filter.value);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative w-32" ref={menuRef}>
            <button
                className="flex justify-between w-full p-2 border rounded-md"
                onClick={toggleDropdown}
            >
                <span>{selectedFilter}</span>
                <span className={`transform ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                </span>
            </button>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            className="block w-full text-left p-2 hover:bg-gray-200"
                            onClick={() => handleFilterSelect(filter)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const FileManage = ({ requiredData, onFileUploaded }) => {
    const { id } = usePage().props; // Retrieve the user_id from the Inertia view
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("name");

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

                    <Filter onFilterChange={setFilterBy} />

                    <FileTable
                        filterBy={filterBy}
                        searchTerm={searchTerm}
                        isManagement
                    />
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
