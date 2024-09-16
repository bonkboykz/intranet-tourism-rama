import React, { useEffect, useState } from "react";
import axios from "axios";

import { useCsrf } from "@/composables";

import Header from "../Components/DashboardHeader";
import DeactivateModal from "../Components/Reusable/DeactivateModal";
import DepartmentDropdown from "../Components/Reusable/DropdownStaffDirectory";
import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "../Components/Reusable/PageTitle";
import SearchMembers from "../Components/Reusable/StaffDirectorySearchBar";
import StaffMemberCard from "../Components/Reusable/StaffMemberCard";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import Sidebar from "../Components/SideNavBar";
import Example from "../Layouts/DashboardLayoutNew";

import "./css/StaffDirectory.css";

const StaffDirectory = () => {
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
    const [isStaffListActive, setStaffListActive] = useState(true);
    const [isOrgChartActive, setOrgChartActive] = useState(false);
    const [activePopupId, setActivePopupId] = useState(null);
    const [activePopupRef, setActivePopupRef] = useState(null);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
    const [currentMemberId, setCurrentMemberId] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const csrfToken = useCsrf();

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
            }));

            setDepartments((prevDepartments) => {
                const allDepartments = [...prevDepartments, ...departmentData];
                return allDepartments.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            });

            if (data.data.next_page_url) {
                fetchDepartments(data.data.next_page_url);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchStaffMembers = async (departmentId) => {
        setIsLoading(true);

        try {
            const response = await axios.get(
                `/api/department/employment_posts?department_id=${departmentId}`
            );
            if (![200, 201].includes(response.status)) {
                throw new Error("Network response was not ok");
            }
            const data = response.data.data;

            const members = data.map((member) => ({
                id: member.user_id,
                name: member.name,
                role: member.business_post_title,
                status: "Online",
                imageUrl:
                    member.staff_image || "/assets/dummyStaffPlaceHolder.jpg",
                workNo: member.work_phone,
                phoneNo: member.phone_no,
                isDeactivated: member.is_active,
                order: member.order,
            }));

            setStaffMembers(members);
        } catch (error) {
            console.error("Error:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDepartments("/api/department/departments");
    }, []);

    useEffect(() => {
        if (selectedDepartmentId) {
            fetchStaffMembers(selectedDepartmentId);
        }
    }, [selectedDepartmentId]);

    const handleOutsideClick = (event) => {
        if (activePopupRef && !activePopupRef.contains(event.target)) {
            setActivePopupId(null);
            setActivePopupRef(null);
        }
    };

    useEffect(() => {
        if (activePopupRef) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            document.removeEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [activePopupRef]);

    const handleSelectDepartment = (departmentId) => {
        setSelectedDepartmentId(departmentId);
    };

    const handleStaffListButton = () => {
        setStaffListActive(true);
        setOrgChartActive(false);
    };

    const handleOrgChartButton = () => {
        setStaffListActive(false);
        setOrgChartActive(true);
    };

    const handleDeactivateClick = (id) => {
        setCurrentMemberId(id);
        setIsDeactivateModalOpen(true);
    };

    const handleActivateClick = (id) => {
        setCurrentMemberId(id);
        setIsActivateModalOpen(true);
    };

    const getCurrentMemberData = () => {
        return staffMembers.find((member) => member.id === currentMemberId);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredStaffMembers = staffMembers
        .filter((member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => parseInt(a.order) - parseInt(b.order));

    const updateIsActiveStatus = async (memberId, isActive) => {
        const response = await fetch(`/api/crud/users/${memberId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken || "",
            },
            body: JSON.stringify({ is_active: isActive }),
        });

        if (!response.ok) {
            throw new Error("Failed to update the status");
        }

        const text = await response.text();
        if (text) {
            return JSON.parse(text);
        }

        return {};
    };

    const handleDeactivate = async () => {
        try {
            await updateIsActiveStatus(currentMemberId, true);
            setStaffMembers(
                staffMembers.map((member) =>
                    member.id === currentMemberId
                        ? { ...member, isDeactivated: true }
                        : member
                )
            );
            setIsDeactivateModalOpen(false);
        } catch (error) {
            console.error("Error deactivating member:", error);
        }
    };

    const handleActivate = async () => {
        try {
            await updateIsActiveStatus(currentMemberId, false);
            setStaffMembers(
                staffMembers.map((member) =>
                    member.id === currentMemberId
                        ? { ...member, isDeactivated: false }
                        : member
                )
            );
            setIsActivateModalOpen(false);
        } catch (error) {
            console.error("Error activating member:", error);
        }
    };

    console.log("staffMembers", staffMembers);

    const handleNewMemberAdded = (newMember) => {
        const newMembers = [...staffMembers, newMember];
        newMembers.sort((a, b) => a.order - b.order);
        setStaffMembers(newMembers);
    };

    const handleAddMember = (newMemberData) => {
        const newMember = {
            id: newMemberData.id,
            name: newMemberData.name,
            role: newMemberData.role,
            status: "Online",
            imageUrl:
                newMemberData.imageUrl || "/assets/dummyStaffPlaceHolder.jpg",
            workNo: newMemberData.workNo,
            phoneNo: newMemberData.phoneNo,
            isDeactivated: newMemberData.isDeactivated,
            order: newMemberData.order,
        };

        console.log("newMember passed from popup", newMember);

        handleNewMemberAdded(newMember);
    };

    return (
        <Example>
            <div className="flex-row">
                <div className="flex">
                    <main className="w-full min-h-screen bg-gray-100 xl:pl-96">
                        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 max-w-[1200px]">
                            <SearchMembers
                                {...{
                                    handleStaffListButton,
                                    handleOrgChartButton,
                                    isStaffListActive,
                                    isOrgChartActive,
                                    onSearch: handleSearch,
                                }}
                            />
                            <DepartmentDropdown
                                departments={departments}
                                onSelectDepartment={handleSelectDepartment}
                                onNewMemberAdded={handleAddMember}
                            />
                            {isLoading ? (
                                <div className="staff-member-grid-container max-w-[1200px]">
                                    <div className="mt-20 ml-32 loading-spinner"></div>
                                </div>
                            ) : (
                                <div className="staff-member-grid-container max-w-[1200px]">
                                    {filteredStaffMembers.map((member) => (
                                        <StaffMemberCard
                                            key={member.id}
                                            id={member.id}
                                            name={member.name}
                                            role={member.role}
                                            status={member.status}
                                            imageUrl={member.imageUrl}
                                            workNo={member.workNo}
                                            phoneNo={member.phoneNo}
                                            isDeactivated={member.isDeactivated}
                                            onDeactivateClick={() =>
                                                handleDeactivateClick(member.id)
                                            }
                                            onActivateClick={() =>
                                                handleActivateClick(member.id)
                                            }
                                            isPopupOpen={
                                                activePopupId === member.id
                                            }
                                            setActivePopup={() => {
                                                setActivePopupId(member.id);
                                                setActivePopupRef(
                                                    document.getElementById(
                                                        `staff-popup-${member.id}`
                                                    )
                                                );
                                            }}
                                            closePopup={() => {
                                                setActivePopupId(null);
                                                setActivePopupRef(null);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
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
                            <PageTitle title="Staff Directory" />
                        </div>
                        <hr className="file-directory-underline" />
                        <div>
                            <FeaturedEvents />
                            {/* <WhosOnline /> */}
                        </div>
                    </aside>
                </div>
            </div>
            {isDeactivateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative p-8 bg-white shadow-lg rounded-2xl w-96">
                        <h2 className="mb-4 text-xl font-bold text-center">
                            Deactivate staff?
                        </h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-8 py-1 text-base text-gray-400 bg-white border border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                onClick={handleDeactivate}
                            >
                                Yes
                            </button>
                            <button
                                className="px-8 py-1 text-white bg-red-500 rounded-full hover:bg-red-700"
                                onClick={() => setIsDeactivateModalOpen(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isActivateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative p-8 bg-white shadow-lg rounded-3xl w-96">
                        <h2 className="mb-4 text-xl font-bold text-center">
                            Activate?
                        </h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-8 py-1 text-base text-gray-400 bg-white border border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                onClick={() => setIsActivateModalOpen(false)}
                            >
                                No
                            </button>
                            <button
                                className="px-8 py-1 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                onClick={handleActivate}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Example>
    );
};

export default StaffDirectory;
