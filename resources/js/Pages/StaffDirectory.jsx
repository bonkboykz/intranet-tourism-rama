import React, { useEffect, useState } from "react";
import axios from "axios";
import { PrimeReactProvider } from "primereact/api";
import { OrganizationChart } from "primereact/organizationchart";

import { useCsrf } from "@/composables";
import { usePermissions } from "@/Utils/hooks/usePermissions";

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
                isMember: department.is_member,
                role: department.role,
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

    const { isSuperAdmin } = usePermissions();

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
                is_assistance: member.is_assistance,
                post_id: member.employment_post_id,
                report_to: member.parent_id,
                is_hod: member.is_hod,
                email: member.email,
                department_id: member.department_id,
                department_name: member.department_name,
                unit_id: member.unit_id,
                unit_name: member.unit_name,
            }));

            const filteredMembers = members.filter(
                (member) => isSuperAdmin || !member.isDeactivated
            );

            setStaffMembers(filteredMembers);
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

    // const getCurrentMemberData = () => {
    //     return staffMembers.find((member) => member.id === currentMemberId);
    // };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredStaffMembers = staffMembers
        .filter((member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((member) => ({
            ...member,
            label: member.name,
            expanded: true,
            type: "person",
        }))
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

    // console.log("staffMembers", staffMembers);

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

    const reportingStructures = buildTree(
        staffMembers
            .filter((member) =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((member) => ({
                data: member,
                id: member.post_id,
                parent_id: member.report_to,
                label: member.name,
                className: `border rounded-lg p-3 shadow-md ${
                    member.is_assistance ? "bg-primary-100" : null
                }`,
                expanded: true,
                type: "person",
            }))
    );

    console.log("reportingStructures", reportingStructures);

    function buildTree(members) {
        if (!members.length) {
            return [];
        }

        const firstMember = members.find((member) => member.parent_id === null);

        const treeMember = members.filter(
            (member) => member.parent_id !== null || member.id == firstMember.id
        );

        const hodGroup = treeMember
            .filter((member) => member.data.is_hod && member.parent_id != null)
            .map((member) => ({
                id: `u-${member.data.unit_id}`,
                type: "group",
                label: member.data.unit_name,
                parent_id: member.parent_id,
            }));

        const structure = treeMember
            .map((member) =>
                member.data.is_hod && member.parent_id != null
                    ? { ...member, parent_id: `u-${member.data.unit_id}` }
                    : member
            )
            .concat(hodGroup);
        console.log(structure);

        const convertToTree = (data) => {
            // Create a map of nodes
            const nodeMap = {};
            data.forEach((item) => {
                nodeMap[item.id] = { ...item, children: [] };
            });

            // Build the tree structure
            const tree = [];
            data.forEach((item) => {
                if (item.parent_id && nodeMap[item.parent_id]) {
                    nodeMap[item.parent_id].children.push(nodeMap[item.id]);
                } else {
                    tree.push(nodeMap[item.id]); // Add root nodes
                }
            });

            return tree;
        };
        return convertToTree(structure);
    }

    const memberNodeTemplate = (node) => {
        if (node.type === "person") {
            return (
                <div className="flex items-center gap-2">
                    <div className="relative border shadow-md w-20 h-20 rounded-full flex-shrink-0">
                        <img
                            className="object-cover h-full w-full rounded-full"
                            src={node.data.imageUrl}
                        />
                        <div
                            className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full  ${
                                node.data.isOnline
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            } border-2 border-white`}
                        ></div>
                    </div>
                    <div className="flex flex-col items-start pl-3">
                        <div className="font-bold text-sm text-pretty uppercase">
                            {node.data.name}
                        </div>
                        <div className="text-nowrap text-sm font-sans uppercase">
                            {node.data.department_name}
                        </div>
                        {node.data.workNo ? (
                            <a
                                href={`tel:${node.data.workNo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-nowrap text-xs font-mono text-blue-700 active:text-gray-700"
                            >
                                {node.data.workNo}
                            </a>
                        ) : null}
                        {node.data.email ? (
                            <a
                                href={`mailto:${node.data.email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-nowrap text-xs font-mono text-blue-700 active:text-gray-700"
                            >
                                {node.data.email}
                            </a>
                        ) : null}
                        <div className="font-bold text-[0.6rem] uppercase bg-gray-400 text-white px-1 py-0.5 rounded-full">
                            {node.data.role}
                        </div>
                    </div>
                </div>
            );
        }
        return <div className="font-bold text-sm">{node.label}</div>;
    };

    return (
        <PrimeReactProvider>
            <Example>
                <div className="flex-row">
                    <div className="flex">
                        <main className="z-0 min-h-screen w-full bg-gray-100 flex-row flex justify-center items-start gap-20 md:gap-12">
                            {/* left widgets */}
                            <div className="z-0 pl-10 pt-10 pb-20 overflow-y-auto h-auto w-full max-w-[330px] max-h-[100vh] sticky top-0 hidden md:hidden lg:block no-scrollbar">
                                <div className="file-directory-header">
                                    <PageTitle title="Staff Directory" />
                                </div>
                                <hr className="file-directory-underline" />
                                <div>
                                    <FeaturedEvents />
                                    <WhosOnline />
                                </div>
                            </div>

                            {/* main content */}
                            <div className="flex flex-col justify-center w-full max-w-[1200px] pt-10 max-md:px-6 mr-10 max-md:ml-10 lg:ml-0 md:ml-10">
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
                                ) : isOrgChartActive ? (
                                    <div className="staff-member-grid-container max-w-[1200px]">
                                        {reportingStructures.length == 1 ? (
                                            <OrganizationChart
                                                value={reportingStructures}
                                                nodeTemplate={
                                                    memberNodeTemplate
                                                }
                                            />
                                        ) : (
                                            <div>
                                                The org chart could not be
                                                shown, because department
                                                relationships were not fully
                                                defined
                                            </div>
                                        )}
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
                                                isDeactivated={
                                                    member.isDeactivated
                                                }
                                                onDeactivateClick={() =>
                                                    handleDeactivateClick(
                                                        member.id
                                                    )
                                                }
                                                onActivateClick={() =>
                                                    handleActivateClick(
                                                        member.id
                                                    )
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
                            <PageTitle title="Staff Directory" />
                        </div>
                        <hr className="file-directory-underline" />
                        <div>
                            <FeaturedEvents />
                            <WhosOnline />
                        </div>
                    </aside> */}
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
                                    className="px-8 py-1 text-white bg-secondary rounded-full hover:bg-secondary-hover"
                                    onClick={() =>
                                        setIsDeactivateModalOpen(false)
                                    }
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
                                    onClick={() =>
                                        setIsActivateModalOpen(false)
                                    }
                                >
                                    No
                                </button>
                                <button
                                    className="px-8 py-1 font-bold text-white bg-primary rounded-full hover:bg-primary-hover"
                                    onClick={handleActivate}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Example>
        </PrimeReactProvider>
    );
};

export default StaffDirectory;
