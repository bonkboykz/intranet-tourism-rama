import React, { useState } from 'react';
import '../css/StaffDirectorySearchBar.css';
import '../css/General.css';

const DepartmentSearchBar = ({ onSearch, toggleCreateCommunity }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="staff-search-bar-container max-w-[1100px] p-4 bg-white rounded-2xl shadow-custom mb-5 sm:left">
      <div className="mb-1 staff-search-bar-title">
        <h2 className="lg:text-xl font-semibold sm:text-sm md:text-md">Search Departments</h2>
      </div>
      <div className="flex flex-col items-center space-y-4 staff-search-bar sm:flex-row sm:space-y-0 sm:space-x-3">
        <input
          type="text"
          className="text-md px-6 bg-gray-100 border-gray-100 rounded-full flex-grow w-full py-3 sm:w-auto"
          placeholder="Search department name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="flex justify-end max-md:w-full">
          <button
            className="flex items-center text-sm font-bold px-4 py-3 bg-red-500 text-white rounded-full hover:bg-red-700"
            onClick={toggleCreateCommunity}>
            <img src="/assets/plus.svg" alt="Plus icon" className="w-3 h-3 my-1.5 mr-2" />
            Department
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSearchBar;