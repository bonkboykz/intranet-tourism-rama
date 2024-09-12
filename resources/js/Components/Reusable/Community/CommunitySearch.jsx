// import React, { useState } from 'react';
// import searchIcon from '../../../../../public/assets/searchStaffButton.png';
// import '../css/StaffDirectorySearchBar.css';
// import '../css/General.css';

// const DepartmentSearchBar = ({ onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     onSearch(value);
//   };

//   return (
//     <div className="staff-search-bar-container max-w-[1100px] p-4 bg-white rounded-2xl shadow-custom mb-5">
//       <div className="mb-1 staff-search-bar-title">
//         <h2 className="text-xl font-semibold">Search Departments</h2>
//       </div>
//       <div className="flex flex-col items-center space-y-3 staff-search-bar sm:flex-row sm:space-y-0 sm:space-x-3">
//         <input
//           type="text"
//           className="flex-grow w-full p-3 border border-[#E4E4E4] rounded-full search-input sm:w-auto"
//           placeholder="Search Name"
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//         <div className="flex w-full space-x-3 sm:justify-end sm:w-auto">
//           <button onClick={handleSearch} className="text-md px-4 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-700">
//           Search
//         </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DepartmentSearchBar;

import React, { useState } from "react";

import "../css/StaffDirectorySearchBar.css";
import "../css/General.css";

const CommunitySearchBar = ({ onSearch, toggleCreateCommunity }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="staff-search-bar-container max-w-[1100px] p-4 bg-white rounded-2xl shadow-custom mb-5 sm:left">
            <div className="mb-1 staff-search-bar-title">
                <h2 className="lg:text-xl font-semibold sm:text-sm md:text-md">
                    Search Communities
                </h2>
            </div>
            <div className="staff-search-bar flex flex-col items-center max-md:items-start space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <input
                    type="text"
                    className="text-md px-6 bg-gray-100 border-gray-100 rounded-full flex-grow w-full py-3 sm:w-auto"
                    placeholder="Search community name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <div className="flex justify-end max-md:w-full">
                    <button
                        className="flex items-center text-sm font-bold px-4 py-3 bg-red-500 text-white rounded-full hover:bg-red-700"
                        onClick={toggleCreateCommunity}
                    >
                        <img
                            src="/assets/plus.svg"
                            alt="Plus icon"
                            className="w-3 h-3 my-1.5 mr-2"
                        />
                        Community
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunitySearchBar;
