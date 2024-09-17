import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

import Birthdaypopup from "@/Components/Reusable/Birthdayfunction/birthdayalert";
import DepartmentDropdown from "@/Components/Reusable/Departments/DepartmentsDropdown";
import { useCsrf } from "@/composables";
import Example from "@/Layouts/DashboardLayoutNew";

import CreateDepartments from "../Components/Reusable/Departments/CreateDepartments";
import DepartmentsCard from "../Components/Reusable/Departments/DepartmentsCard";
import DepartmentSearchBar from "../Components/Reusable/Departments/DepartmentSearch";
import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";

import "./css/StaffDirectory.css";

const Departments = () => {
    const { props } = usePage();
    const { id } = props;
    const [departmentsList, setDepartmentsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentDepartmentId, setCurrentDepartmentId] = useState(null);
    const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // State for error modal
    const csrfToken = useCsrf();

    const toggleCreateCommunity = () =>
        setIsCreateDepartmentOpen(!isCreateDepartmentOpen);

    const fetchDepartments = async (url) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json" },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            const departmentData = data.data.data.map((department) => ({
                id: department.id,
                name: department.name,
                order: department.order,
                imageUrl: department.banner
                    ? `/storage/${department.banner}`
                    : "assets/departmentsDefault.jpg",
                isMember: department.is_member,
            }));

            console.log("Department data:", departmentData);

            setDepartmentsList((prevDepartments) => {
                const allDepartments = [...prevDepartments, ...departmentData];
                return allDepartments.sort((a, b) => a.order - b.order);
            });

            if (data.data.next_page_url) {
                fetchDepartments(data.data.next_page_url);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchDepartments("/api/department/departments");
    }, []);

    const handleDelete = async () => {
        try {
            // First, check if there are employment posts associated with the department
            const checkPostsResponse = await fetch(
                `/api/department/employment_posts/${currentDepartmentId}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!checkPostsResponse.ok) {
                throw new Error("Error checking employment posts");
            }

            const employmentPostsData = await checkPostsResponse.json();

            // Check if there are members in the department
            if (
                Array.isArray(employmentPostsData) &&
                employmentPostsData.length > 0
            ) {
                setIsErrorModalOpen(true); // Trigger error popup
                setIsDeleteModalOpen(false); // Close delete confirmation modal
                return;
            }

            // Delete the department
            const responseDepartment = await fetch(
                `/api/department/departments/${currentDepartmentId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-CSRF-Token": csrfToken,
                    },
                }
            );

            if (!responseDepartment.ok) {
                throw new Error("Error deleting department");
            }

            // Update the state after successful deletion
            setDepartmentsList((prevList) =>
                prevList.filter(
                    (department) => department.id !== currentDepartmentId
                )
            );
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting department:", error);
            setIsErrorModalOpen(true); // Trigger the error modal
        }
    };

    const handleDeleteClick = (id) => {
        setCurrentDepartmentId(id);
        setIsDeleteModalOpen(true);
    };

    const handleNewDepartment = (newDepartment) => {
        setDepartmentsList((prevList) =>
            [...prevList, newDepartment].sort((a, b) =>
                a.name.localeCompare(b.name)
            )
        );
    };

    const filteredDepartments = departmentsList.filter((department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Example>
            <main className="w-full min-h-screen bg-gray-100 xl:pl-96">
                <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                    <DepartmentSearchBar
                        onSearch={(value) => setSearchTerm(value)}
                        toggleCreateCommunity={toggleCreateCommunity}
                    />
                    <DepartmentDropdown
                        departments={filteredDepartments}
                        onSelectDepartment={() => {}}
                        onCreateDepartment={handleNewDepartment}
                    />
                    <div className="dept-grid-container max-w-[1230px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-2 sm:py-4 md:py-6 lg:py-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64 ml-[450px]">
                                <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                            </div>
                        ) : filteredDepartments.length === 0 ? (
                            <p>No departments found.</p>
                        ) : (
                            filteredDepartments.map((department) => (
                                <DepartmentsCard
                                    key={department.id}
                                    name={department.name}
                                    imageUrl={
                                        department.imageUrl ||
                                        "assets/departmentsDefault.jpg"
                                    }
                                    departmentID={department.id}
                                    onDeleteClick={handleDeleteClick}
                                    isMember={department.isMember}
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
                    <PageTitle title="Departments" />
                </div>
                <hr className="file-directory-underline" />
                <div>
                    <FeaturedEvents />
                    <WhosOnline />
                </div>
            </aside>
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative p-8 bg-white shadow-lg rounded-2xl w-96">
                        <h2 className="mb-4 text-xl font-bold text-center">
                            Delete Department?
                        </h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-8 py-1 text-base text-gray-400 bg-white border border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                onClick={handleDelete}
                            >
                                Yes
                            </button>
                            <button
                                className="px-8 py-1 text-white bg-red-500 rounded-full hover:bg-red-700"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isErrorModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative px-8 py-6 bg-white shadow-lg rounded-2xl w-96">
                        <h2 className="mb-0 text-xl font-bold text-center text-red-500">
                            Error
                        </h2>
                        <p className="text-center font-bold text-gray-800">
                            Members still exist in the department. Please delete
                            all members first.
                        </p>
                        <div className="flex justify-center mt-6">
                            <button
                                className="px-8 py-1 text-white bg-red-500 rounded-full hover:bg-red-700"
                                onClick={() => setIsErrorModalOpen(false)} // Close the modal on click
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCreateDepartmentOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative p-4 bg-white shadow-lg rounded-2xl">
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
                            {/* <CreateDepartments Create={handleNewDepartment} userID={id} /> */}
                            <CreateDepartments
                                onCancel={toggleCreateCommunity}
                                onCreate={handleNewDepartment}
                                userID={id}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Example>
    );
};

export default Departments;
