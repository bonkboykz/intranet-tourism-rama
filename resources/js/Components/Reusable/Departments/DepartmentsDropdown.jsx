import React, { useEffect, useRef, useState } from "react";

import dropDownDownArrow from "../../../../../public/assets/dropdownDownArrow.png";
import dropDownUpArrow from "../../../../../public/assets/dropdownUpArrow.png";
import dummyStaffPlaceHolder from "../../../../../public/assets/dummyStaffPlaceHolder.jpg";
import ThreeDotButton from "./DepartmentsThreeDot";

import "./css/DepartmentsDropdown.css";

const DepartmentDropdown = ({
    departments,
    onSelectDepartment,
    staffMembers,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState({
        id: "",
        name: "",
    });
    const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const handleSelect = (department) => {
        setSelectedDepartment(department);
        onSelectDepartment(department.id);
        setIsOpen(false);
        setSearchTerm(department.name);
    };

    const toggleAddMemberPopup = (event) => {
        event.stopPropagation();
        setIsAddMemberPopupOpen((prev) => !prev);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setSearchTerm("");
        setIsOpen((prev) => !prev);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClickOutside = (event) => {
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

    const filteredDepartments = departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-screen-lg">
            <div className="relative flex items-end justify-end w-full">
                <div className="relative">
                    <ThreeDotButton
                        selectedDepartmentId={selectedDepartment.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default DepartmentDropdown;
