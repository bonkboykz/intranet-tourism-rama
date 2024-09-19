import React, { useEffect, useRef, useState } from "react";
import { useLayoutEffect } from "react";
import { usePage } from "@inertiajs/react";

import { usePermissions } from "@/Utils/hooks/usePermissions";

import dropDownDownArrow from "../../../../public/assets/dropdownDownArrow.png";
import dropDownUpArrow from "../../../../public/assets/dropdownUpArrow.png";
import dummyStaffPlaceHolder from "../../../../public/assets/dummyStaffPlaceHolder.jpg";
import SearchPopup from "./AddMemberPopup";
import ThreeDotButton from "./ThreeDotButton";

import "./css/DropdownStaffDirectory.css";

const DepartmentDropdown = ({
    departments,
    onSelectDepartment,
    staffMembers,
    onNewMemberAdded,
}) => {
    const { hasRole } = usePermissions();

    const isSuperAdmin = hasRole("superadmin");

    const [isOpen, setIsOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const {
        props: { departmentId },
    } = usePage();

    useLayoutEffect(() => {
        if (!departmentId) {
            return;
        }

        const department = departments.find(
            (department) => department.id.toString() === departmentId
        );

        if (!department) {
            return;
        }

        setSearchTerm(department.name);
        setSelectedDepartment(department);
        onSelectDepartment(department.id);
    }, [departmentId, departments]);

    const handleSelect = (department) => {
        // // Simulate fetching department members and details (replace with real fetch logic)
        // const departmentDetails = {
        //     ...department,
        //     members: [
        //         {
        //             name: "Aisha Binti SOmething shas as dasd asd",
        //             position: "Pengarah Kanan",
        //             avatar: dummyStaffPlaceHolder,
        //         },
        //         {
        //             name: "Ben Tan",
        //             position: "Timbalan Pengarah Kanan",
        //             avatar: dummyStaffPlaceHolder,
        //         },
        //         {
        //             name: "Nick",
        //             position: "Setiausaha Pejabat",
        //             avatar: dummyStaffPlaceHolder,
        //         },
        //         {
        //             name: "Sarah",
        //             position: "Setiausaha Pejabat",
        //             avatar: dummyStaffPlaceHolder,
        //         },
        //         {
        //             name: "Thomas",
        //             position: "Timbalan Pengarah Kanan",
        //             avatar: dummyStaffPlaceHolder,
        //         },
        //         {
        //             name: "Zack",
        //             position: "Pegawai",
        //             avatar: dummyStaffPlaceHolder,
        //         },
        //         {
        //             name: "Zara",
        //             position: "Pegawai",
        //             avatar: dummyStaffPlaceHolder,
        //         },
        //     ],
        // };
        setSelectedDepartment(department);
        // localStorage.setItem(
        //     "selectedDepartment",
        //     JSON.stringify(departmentDetails)
        // ); // Persist selection in localStorage
        onSelectDepartment(department.id);
        setIsOpen(false);
        setSearchTerm(department.name);
    };

    const toggleAddMemberPopup = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsAddMemberPopupOpen((prev) => !prev);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        event.preventDefault();
        event.stopPropagation();
        setSearchTerm("");
        setIsOpen((prev) => !prev);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClickOutside = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setIsOpen(false);
            if (selectedDepartment.name) {
                setSearchTerm(selectedDepartment.name);
            } else {
                setSearchTerm("");
            }
        }
    };
    // const handleRefreshOrBack = () => {
    //     // Rehydrate the department info from localStorage (if present)
    //     const savedDepartment = localStorage.getItem("selectedDepartment");
    //     if (savedDepartment) {
    //         const departmentDetails = JSON.parse(savedDepartment);
    //         setSelectedDepartment(departmentDetails);
    //         setSearchTerm(departmentDetails.name);
    //     }
    // };

    // useEffect(() => {
    //     // Add event listener to handle refresh or back
    //     window.addEventListener("popstate", handleRefreshOrBack);

    //     return () => {
    //         window.removeEventListener("popstate", handleRefreshOrBack);
    //     };
    // }, []);

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

    // // Restore the department name in the search term on component mount
    // useEffect(() => {
    //     // Check localStorage on component mount to restore selected department and staff
    //     const savedDepartment = localStorage.getItem("selectedDepartment");
    //     if (savedDepartment) {
    //         const departmentDetails = JSON.parse(savedDepartment);
    //         setSelectedDepartment(departmentDetails);
    //         setSearchTerm(departmentDetails.name);
    //     }
    // }, []);

    useEffect(() => {
        if (departmentId) {
            return;
        }

        if (isSuperAdmin) {
            setSelectedDepartment({
                id: "",
                name: "",
            });
            setSearchTerm("");

            return;
        }

        const firstDepartmentWhereUser = departments?.find(
            (department) => department.isMember === true
        );

        if (firstDepartmentWhereUser) {
            onSelectDepartment(firstDepartmentWhereUser.id);
            setSelectedDepartment(firstDepartmentWhereUser);
            setSearchTerm(firstDepartmentWhereUser.name);
        }
    }, [departments]);

    const filteredDepartments = departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!selectedDepartment) {
        return null;
    }

    return (
        <div
            className="flex justify-between department-dropdown-container max-md:flex-row max-md:justify-start"
            ref={dropdownRef}
        >
            <div className="flex flex-row items-center max-md:flex-col max-md:w-full max-md:gap-4">
                <div
                    className={`dropdown-header  ${isOpen ? "open" : ""}`}
                    onClick={toggleDropdown}
                >
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Select Department"
                        className="font-bold dropdown-header-input"
                    />
                    <img
                        style={{ width: "15px", marginRight: "10px" }}
                        src={isOpen ? dropDownUpArrow : dropDownDownArrow}
                        alt="Toggle Dropdown"
                    />
                </div>
                <div className="justify-start max-md:w-full">
                    {selectedDepartment.id && selectedDepartment.isMember && (
                        <a
                            href={`/departmentInner?departmentId=${selectedDepartment.id}`}
                        >
                            <button className="flex-1 text-sm font-bold rounded-full whitespace-nowrap px-4 md:py-2.5 md:mr-4 max-md:py-2.5 lg:py-2.5 bg-blue-500 text-white hover:bg-blue-700">
                                Visit Department
                            </button>
                        </a>
                    )}
                </div>
            </div>
            {isOpen && (
                <ul className={`dropdown-list ${isOpen ? "open" : ""}`}>
                    {filteredDepartments.map((dept) => (
                        <li key={dept.id} onClick={() => handleSelect(dept)}>
                            {dept.name}
                        </li>
                    ))}
                </ul>
            )}
            {selectedDepartment.id &&
                selectedDepartment.isMember &&
                ["admin", "superadmin"].includes(selectedDepartment.role) && (
                    <div className="relative flex flex-row items-center justify-between w-full max-md:mt-4 max-md:flex-row max-md:justify-between lg:ml-0">
                        <button
                            className="flex items-center justify-center text-sm font-bold px-6 py-2.5 bg-red-500 text-white rounded-full hover:bg-red-700"
                            onClick={toggleAddMemberPopup}
                        >
                            <img
                                src="/assets/plus.svg"
                                alt="Plus icon"
                                className="w-3 h-3 mr-2"
                            />
                            Member
                        </button>
                        <ThreeDotButton
                            selectedDepartmentId={selectedDepartment.id}
                        />
                    </div>
                )}
            {isAddMemberPopupOpen && (
                <SearchPopup
                    isAddMemberPopupOpen={isAddMemberPopupOpen}
                    setIsAddMemberPopupOpen={setIsAddMemberPopupOpen}
                    departmentId={selectedDepartment.id}
                    people={staffMembers}
                    onNewMemberAdded={onNewMemberAdded}
                />
            )}
        </div>
    );
};

export default DepartmentDropdown;
