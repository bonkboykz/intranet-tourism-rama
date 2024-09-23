import React from 'react';
import PageTitle from '../Components/Reusable/PageTitle';
import Example from '@/Layouts/DashboardLayoutNew';
import Pautan from '@/Components/Settings/LinkComponent';

const Settings = () => {
  const handleLinkNavigation = () => {
    window.location.href = route('manage-links');
  };

  const handleFolderNavigation = () => {
    window.location.href = route('manage-folders');
  };

  return (
    <Example>
      <div className="flex flex-col w-full min-h-screen bg-gray-100">
        {/* Main Title inside the gray background */}
        <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-100">
          <h1 className="text-4xl font-bold text-gray-900">Link</h1>
        </div>

        <div className="flex flex-col md:flex-row w-full">
          {/* Top section for Department Links */}
          <div className="flex flex-col w-full md:w-1/2 p-4 sm:p-6 lg:p-8 md:border-r border-gray-300">
            <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Systems</h1>
              <button
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                onClick={handleLinkNavigation}
              >
                Manage system
              </button>
            </div>
            {/* Display only department links */}
            <Pautan displayType="nonDepartment" />
          </div>

          {/* Bottom section for Non-Department Links */}
          <div className="flex flex-col w-full md:w-1/2 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Official File</h1>

              <button
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                onClick={handleFolderNavigation}
              >
                Manage File
              </button>
            </div>
            {/* Display only non-department links */}
            <Pautan displayType="department" />
          </div>
        </div>
      </div>
    </Example>
  );
};

export default Settings;
