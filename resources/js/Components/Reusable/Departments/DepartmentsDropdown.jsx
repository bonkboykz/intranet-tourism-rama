import React, { useState } from 'react';
import './css/DepartmentsDropdown.css';
import AddCommunity from '../../../../../public/assets/AddCommunity.png';
import CreateDepartments from './CreateDepartments'; // Adjust the path as necessary

const DepartmentDropdown = ({ departments, onSelectDepartment, onCreateDepartment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isReportingPopupOpen, setIsReportingPopupOpen] = useState(false);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);

  const handleSelect = (department) => {
    setSelectedDepartment(department);
    onSelectDepartment(department);
    setIsOpen(false);
  };

  const toggleReportingPopup = () => setIsReportingPopupOpen(!isReportingPopupOpen);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleCreateCommunity = () => setIsCreateCommunityOpen(!isCreateCommunityOpen);

  return (
    <div className="department-dropdown-container">
      <button className="add-person-btn" onClick={toggleCreateCommunity}>
        <img src={AddCommunity} alt="Add Community" />
      </button>
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
        <ul className={`dropdown-list ${isOpen ? 'open' : ''}`}>
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
            <CreateDepartments
              onCancel={toggleCreateCommunity}
              onCreate={onCreateDepartment}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDropdown;