import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

import { WallContext } from "@/Components/Reusable/WallPosting/WallContext";
import { useCsrf } from "@/composables";
import Example from "@/Layouts/DashboardLayoutNew";

import CommunityCard from "../Components/Reusable/Community/CommunityCard";
import CommunityDropdown from "../Components/Reusable/Community/CommunityDropdown";
import PopupMenu from "../Components/Reusable/Community/CommunityPopUp";
import CommunitySearchBar from "../Components/Reusable/Community/CommunitySearch";
import CreateCommunity from "../Components/Reusable/Community/CreateCommunity";
import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";

import "./css/StaffDirectory.css";

const Community = () => {
    const [departmentsList, setDepartmentsList] = useState([]);
    const { props } = usePage();
    const { id } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
    const [filter, setFilter] = useState("All"); // Default filter to show all
    const csrfToken = useCsrf();

    const toggleCreateCommunity = () =>
        setIsCreateCommunityOpen(!isCreateCommunityOpen);

    const fetchDepartments = async () => {
        try {
            setIsLoading(true);

            const url = "/api/communities/communities";
            const response = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json" },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const departmentData = data.data.data.map((community) => ({
                id: community.id,
                name: community.name,
                type: community.type,
                imageUrl: community.banner || "/assets/defaultCommunity.png", // Use banner if available
                isArchived: false, // Initialize with not archived
            }));

            // Retrieve archived state from localStorage
            const archivedState =
                JSON.parse(localStorage.getItem("archivedCommunities")) || {};

            // Update the archived state based on localStorage data
            const updatedDepartments = departmentData.map((department) => ({
                ...department,
                isArchived: archivedState[department.id] || false,
            }));

            setDepartmentsList(
                updatedDepartments.sort((a, b) => a.name?.localeCompare(b.name))
            );
        } catch (error) {
            console.error("Error fetching departments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleNewDepartment = (newDepartment) => {
        setDepartmentsList((prevList) =>
            [...prevList, { ...newDepartment, isArchived: false }].sort(
                (a, b) => a.name?.localeCompare(b.name)
            )
        );
    };

    const handleDelete = async (departmentId) => {
        try {
            const url = `/api/communities/communities/${departmentId}`;
            const options = {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-Token": csrfToken, // Ensure this token is being sent correctly
                },
            };

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(
                    `Failed to delete the department: ${response.statusText}`
                );
            }

            // Update the departments list after successful deletion
            setDepartmentsList((prevList) =>
                prevList.filter((department) => department.id !== departmentId)
            );

            console.log(
                `Department with ID ${departmentId} deleted successfully.`
            );
        } catch (error) {
            console.error("Error deleting department:", error.message);
            // Optional: Show an error message to the user
        }
    };

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);
    };

    const handleArchiveToggle = (departmentId) => {
        setDepartmentsList((prevList) => {
            const updatedList = prevList.map((department) =>
                department.id === departmentId
                    ? { ...department, isArchived: !department.isArchived }
                    : department
            );

            // Update localStorage with new archived state
            const archivedState = updatedList.reduce((acc, department) => {
                acc[department.id] = department.isArchived;
                return acc;
            }, {});

            localStorage.setItem(
                "archivedCommunities",
                JSON.stringify(archivedState)
            );
            return updatedList;
        });
    };

    const filteredDepartments = departmentsList
        .filter((community) => {
            if (filter === "All") return !community.isArchived;
            if (filter === "Public")
                return community.type === "public" && !community.isArchived;
            if (filter === "Private")
                return community.type === "private" && !community.isArchived;
            if (filter === "Archive") return community.isArchived;
            return false;
        })
        .filter((community) =>
            community.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <Example>
            <main className="w-full xl:pl-96 bg-gray-100 min-h-screen">
                <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                    <CommunitySearchBar
                        onSearch={(value) => setSearchTerm(value)}
                        toggleCreateCommunity={toggleCreateCommunity}
                    />
                    <div className="department-grid-container max-w-[1230px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-2 sm:py-4 md:py-6 lg:py-8">
                        {" "}
                    </div>
                    <CommunityDropdown onSelectFilter={handleFilterChange} />
                    <div className="dept-grid-container max-w-[1230px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-2 sm:py-4 md:py-6 lg:py-8">
                        {isLoading ? (
                            <div className="mt-20 ml-32 loading-spinner"></div>
                        ) : filteredDepartments.length === 0 ? (
                            <p>No communities found.</p>
                        ) : (
                            filteredDepartments.map((department) => (
                                <CommunityCard
                                    key={department.id}
                                    name={department.name}
                                    imageUrl={department.imageUrl}
                                    communityID={department.id}
                                    type={department.type}
                                    isArchived={department.isArchived} // Pass the archived state
                                    onArchiveToggle={() =>
                                        handleArchiveToggle(department.id)
                                    }
                                    onDelete={() => handleDelete(department.id)}
                                />
                            ))
                        )}
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
                    <PageTitle title="Community" />
                </div>
                <hr className="file-directory-underline" />
                <div>
                    <FeaturedEvents />
                    <WhosOnline />
                </div>
            </aside>
            {isCreateCommunityOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-2xl shadow-lg max-md:w-5/6 relative">
                        <div className="relative">
                            <div className="flex justify-end">
                                <button
                                    onClick={toggleCreateCommunity}
                                    className="absolute top-0 right-0 mt-2 mr-2"
                                >
                                    <img
                                        src="/assets/cancel.svg"
                                        alt="Close icon"
                                        className="w-6 h-6"
                                    />
                                </button>
                            </div>
                        </div>
                        <CreateCommunity
                            id={id}
                            onCreate={handleNewDepartment}
                        />
                    </div>
                </div>
            )}
        </Example>
    );
};

export default Community;
