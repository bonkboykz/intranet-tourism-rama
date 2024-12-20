import React, { useState } from 'react';
import searchIcon from '../../../../public/assets/searchStaffButton.png';
import filterIcon from '../../../../public/assets/staffListButton.png';
import './css/StaffDirectorySearchBar.css';
import './css/General.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log(searchTerm);
  };

  return (
    <div className="staff-search-bar-container">
        <div className="staff-search-bar-title">
            <h2>Search Community</h2>
        </div>
        <div className="staff-search-bar">
            <input
                type="text"
                className="search-input"
                placeholder="Search community"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '1.2rem' }}
            />
            <button onClick={handleSearch} className="text-md px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-700 h-[43px]">
              Search
            </button>
        </div>
    </div>
  );
};

export default SearchBar;
