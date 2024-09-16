// CommunityDropdown.jsx
import React, { useState } from "react";

import AddCommunity from "../../../../public/assets/AddCommunity.png";
import addPersonButton from "../../../../public/assets/addPersonButton.png";
import dropDownDownArrow from "../../../../public/assets/dropdownDownArrow.png";
import dropDownUpArrow from "../../../../public/assets/dropdownUpArrow.png";
import threeDotButton from "../../../../public/assets/threeDotButton.png";
import visitDepartment from "../../../../public/assets/visitDepartmentButton.png";
import CreateCommunity from "./CreateCommunity"; // Adjust the path as necessary

import "./css/DropdownStaffDirectory.css";

const DepartmentDropdown = ({ departments, onSelectDepartment }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [isReportingPopupOpen, setIsReportingPopupOpen] = useState(false);
    const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);

    const handleSelect = (department) => {
        setSelectedDepartment(department);
        onSelectDepartment(department);
        setIsOpen(false);
    };

    // Popup for showing reporting structure option
    const toggleReportingPopup = () =>
        setIsReportingPopupOpen(!isReportingPopupOpen);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleCreateCommunity = () =>
        setIsCreateCommunityOpen(!isCreateCommunityOpen);

    return (
        <div className="department-dropdown-container">
            <button
                className={`dropdown-header ${isOpen ? "open" : ""}`}
                onClick={toggleDropdown}
            >
                <div className="dropdown-header-title">
                    {selectedDepartment || "All"}
                    <img
                        style={{ width: "15px" }}
                        src={isOpen ? dropDownUpArrow : dropDownDownArrow}
                        alt="Toggle Dropdown"
                    />
                </div>
            </button>
            {selectedDepartment && (
                <button className="visit-department-btn">
                    <img src={visitDepartment} alt="Visit Department" />
                </button>
            )}
            <button className="add-person-btn" onClick={toggleCreateCommunity}>
                <img src={AddCommunity} alt="Add Community" />
            </button>
            {/* <button className="three-dot-btn" onClick={toggleReportingPopup}>
          <img src={threeDotButton} alt="More Options" />
        </button> */}
            {isReportingPopupOpen && (
                <button
                    onClick={toggleReportingPopup}
                    className="staff-popup"
                    style={{
                        top: `25px`,
                        right: `-200px`,
                    }}
                >
                    Reporting Structure
                </button>
            )}
            {isOpen && (
                <ul className={`dropdown-list ${isOpen ? "open" : ""}`}>
                    {departments.map((dept, index) => (
                        <li key={index} onClick={() => handleSelect(dept)}>
                            {dept}
                        </li>
                    ))}
                </ul>
            )}
            {isCreateCommunityOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                            onClick={toggleCreateCommunity}
                        >
                            &times;
                        </button>
                        <CreateCommunity onCancel={toggleCreateCommunity} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentDropdown;
