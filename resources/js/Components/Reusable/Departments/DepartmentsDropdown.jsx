import React, { useEffect, useRef, useState } from "react";

import dropDownDownArrow from "../../../../../public/assets/dropdownDownArrow.png";
import dropDownUpArrow from "../../../../../public/assets/dropdownUpArrow.png";
import dummyStaffPlaceHolder from "../../../../../public/assets/dummyStaffPlaceHolder.jpg";
import ThreeDotButton from "./DepartmentsThreeDot";

import "./css/DepartmentsDropdown.css";

function MenuItem({ text, isActive, onClick }) {
    return (
        <div
            className={`flex items-center gap-3 p-2 m-0.5 rounded-md cursor-pointer ${
                isActive ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
            onClick={() => onClick(text)}
        >
            <span
                className={`my-auto ${
                    isActive ? "text-neutral-800 font-bold" : "text-neutral-800"
                }`} // Change text color and style based on active/inactive state
            >
                {text}
            </span>
        </div>
    );
}

function IconMenu({ menuItems, onSelectFilter, closeDropdown }) {
    return (
        <aside className="absolute flex flex-col p-2 bg-white rounded-lg shadow-lg w-[160px] text-neutral-800 mt-[180px] z-10 ">
            {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                    <MenuItem
                        text={item.text}
                        isActive={item.isActive} // Pass active state to MenuItem
                        onClick={(text) => {
                            onSelectFilter(text);
                            closeDropdown(); // Close the dropdown after selecting an option
                        }}
                    />
                </React.Fragment>
            ))}
        </aside>
    );
}

const DepartmentDropdown = ({
    departments,
    onSelectDepartment,
    staffMembers,
    onSelectFilter,
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

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState({
        text: "All",
    });
    const [menuItems, setMenuItems] = useState([
        { text: "All", isActive: true },
        { text: "HQ/Department", isActive: false },
        { text: "State/Region", isActive: false },
        { text: "Overseas", isActive: false },
    ]);

    const toggleFilterDropdown = () => {
        setIsFilterOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsFilterOpen(false);
    };

    const handleSelectFilter = (text) => {
        setSelectedFilter({ text }); // Update the filter text and icon
        onSelectFilter(text); // Call the parent function

        // Update active state for the icons
        const updatedMenuItems = menuItems.map((item) =>
            item.text === text
                ? { ...item, isActive: true }
                : { ...item, isActive: false }
        );
        setMenuItems(updatedMenuItems);

        closeDropdown(); // Close the dropdown
    };

    return (
        <div className="max-w-screen-lg">
            <div className="relative flex items-end justify-end w-full">
                <div className="relative">
                    <ThreeDotButton
                        selectedDepartmentId={selectedDepartment.id}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-center text-sm max-w-[132px] text-neutral-800 relative mr-96 -mb-2 -mt-6">
                <div
                    className="flex gap-5 justify-between px-4 py-3 bg-white rounded-2xl shadow-lg mb-4 h-auto w-[160px] cursor-pointer"
                    onClick={toggleFilterDropdown}
                >
                    <div className="flex items-center gap-3">
                        <span>{selectedFilter.text}</span>
                    </div>
                    <img
                        loading="lazy"
                        src="assets/Dropdownarrow.svg"
                        alt="Decorative icon"
                        className={`shrink-0 my-auto aspect-[1.89] stroke-[2px] w-[15px] ${
                            isFilterOpen ? "transform rotate-180" : ""
                        }`}
                    />
                </div>
                {isFilterOpen && (
                    <IconMenu
                        menuItems={menuItems} // Pass the menuItems with active states
                        onSelectFilter={handleSelectFilter}
                        closeDropdown={closeDropdown}
                    />
                )}
            </div>
        </div>
    );
};

export default DepartmentDropdown;
