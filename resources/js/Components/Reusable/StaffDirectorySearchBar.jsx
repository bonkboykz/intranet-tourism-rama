import React, { useEffect, useState } from "react";

import { usePermissions } from "@/Utils/hooks/usePermissions";

import defaultImage from "../../../../public/assets/dummyStaffPlaceHolder.jpg";
import orgChartIconActive from "../../../../public/assets/orgChartActive.svg";
import orgChartIconInactive from "../../../../public/assets/orgChartInactive.svg";
import searchIcon from "../../../../public/assets/searchStaffButton.png";
import staffListIconActive from "../../../../public/assets/staffListButton.svg";
import staffListIconInactive from "../../../../public/assets/staffListButtonInactive.svg";

import "./css/StaffDirectorySearchBar.css";
import "./css/General.css";

const SearchMembers = ({
    onSearch,
    handleStaffListButton,
    handleOrgChartButton,
    isStaffListActive,
    isOrgChartActive,
}) => {
    const { isSuperAdmin } = usePermissions();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllSearchResults = async (query) => {
        setError("");
        let allResults = [];

        try {
            const response = await fetch(
                `/api/users/users?search=${query}&disabledPagination=true&with[]=profile&with[]=employmentPosts.department&with[]=employmentPosts.businessPost&with[]=employmentPosts.businessUnit`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const responseText = await response.text();
            const data = responseText ? JSON.parse(responseText) : {};

            allResults = data.data;

            if (!isSuperAdmin) {
                allResults = allResults.filter((member) => !member.is_active);
            }

            setSearchResults(allResults);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setError("Failed to fetch search results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    let debounceTimeout;

    useEffect(() => {
        clearTimeout(debounceTimeout);

        if (searchTerm.trim() !== "") {
            setLoading(true);
            debounceTimeout = setTimeout(() => {
                fetchAllSearchResults(searchTerm);
            }, 1000);
        } else {
            setSearchResults([]);
        }

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm]);

    const handleSearch = () => {
        fetchAllSearchResults(searchTerm);
    };

    const getImageSource = (imageUrl) => {
        console.log("imageURL", imageUrl);
        if (imageUrl.startsWith("staff_image/")) {
            return `/storage/${imageUrl}`;
        } else {
            return imageUrl === "/assets/dummyStaffPlaceHolder.jpg"
                ? imageUrl
                : `/avatar/${imageUrl}`;
        }
    };

    const renderTitles = (employmentPosts) => {
        if (!employmentPosts || employmentPosts.length === 0) {
            return "No title available";
        }

        const uniqueTitles = [
            ...new Set(
                employmentPosts
                    .map((post) => post.business_post?.title)
                    .filter(Boolean)
            ),
        ];

        return (
            <div className="text-right">
                {uniqueTitles.map((title, index) => (
                    <p key={index} className="text-gray-600">
                        {title}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="staff-search-bar-container max-w-[1100px] p-4 bg-white rounded-2xl shadow-custom mb-5 sm:left">
            <div className="mb-1 staff-search-bar-title">
                <h2 className="font-semibold lg:text-xl sm:text-sm md:text-md">
                    Search Staff
                </h2>
            </div>
            <div
                className={`flex flex-col items-center space-y-3 staff-search-bar sm:flex-row sm:space-y-0 sm:space-x-3 ${searchResults.length > 0 ? "open-dropdown" : ""}`}
            >
                <input
                    type="text"
                    className={`text-md px-6 bg-gray-100 border-gray-100 rounded-full flex-grow w-full py-3 search-input-staff-search-bar sm:w-auto ${searchResults.length > 0 ? "dropdown-open" : ""}`}
                    placeholder="Search name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex w-full space-x-3 sm:justify-end sm:w-auto">
                    {/* <button
                        onClick={handleSearch}
                        className="font-bold mt-0 text-md px-4 py-2 items-center bg-primary text-white rounded-full hover:bg-primary-hover h-[43px]"
                    >
                        Search
                    </button> */}
                    <button
                        onClick={handleStaffListButton}
                        className="shrink=0 w-10 aspect-square"
                    >
                        <img
                            src={
                                isStaffListActive
                                    ? staffListIconActive
                                    : staffListIconInactive
                            }
                            alt="Staff List"
                        />
                    </button>
                    <button
                        onClick={handleOrgChartButton}
                        className="shrink=0 w-10 aspect-square"
                    >
                        <img
                            src={
                                isOrgChartActive
                                    ? orgChartIconActive
                                    : orgChartIconInactive
                            }
                            alt="Org Chart"
                        />
                    </button>
                </div>
            </div>
            {searchTerm && (
                <div className="mt-2 overflow-y-auto bg-white border border-gray-300 search-results-container custom-scrollbar max-h-72">
                    {loading ? (
                        <p className="p-2">Loading...</p>
                    ) : error ? (
                        <p className="p-2">{error}</p>
                    ) : searchResults.length === 0 ? (
                        <p className="p-2">No members found.</p>
                    ) : (
                        searchResults.map((result) => (
                            <a key={result.id} href={`/user/${result.id}`}>
                                <div className="flex items-center justify-between p-2 cursor-pointer search-result-item hover:bg-gray-100">
                                    <div className="flex items-center cursor-pointer">
                                        <img
                                            src={getImageSource(
                                                result.profile?.staff_image ||
                                                    "/assets/dummyStaffPlaceHolder.jpg"
                                            )}
                                            alt={result.name}
                                            className="w-10 h-10 mr-3 rounded-full cursor-pointer"
                                        />
                                        <p className="font-semibold cursor-pointer">
                                            {result.name}
                                        </p>
                                    </div>
                                    <div className="flex flex-col">
                                        {renderTitles(result.employment_posts)}
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchMembers;
