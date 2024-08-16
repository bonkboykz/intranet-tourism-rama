import React, { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import threeDotsIcon from '../../../../public/assets/threedots.svg';
import deleteIcon from '../../../../public/assets/deleteicon.svg';
import downloadIcon from '../../../../public/assets/downloadicon.svg';
import renameIcon from '../../../../public/assets/renameicon.svg';
import ViewIcon from '../../../../public/assets/ViewIcon.svg';
import ViewAdminPopup from '../Reusable/ViewAdminPopup';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const PopupContent = ({ file, onRename, onDelete, onFileSelect }) => {
  console.log("FILE", file);
  
  if (!file || !file.id) {
    console.error("No file selected or file ID is missing.");
    return null; // or return some placeholder content
  }

  const handleRename = (e, close) => {
    e.preventDefault();
    onRename();
    close(); // Close the popup
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this file?")) {
      onDelete(file.id);
    }
  };

  // const handleDownload = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(`/api/resources/resources?id=${file.id}`);
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.json();
  //     const fileUrl = data.path;
  //     window.open(fileUrl, '_blank');
  //   } catch (error) {
  //     console.error("Failed to download the file:", error);
  //   }
  // };
  // const handleDownload = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(`/api/resources/resources?id=${file.id}`);
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.json();
  //     console.log("API response:", data); // Log the entire API response to check its structure
  
  //     const fileObject = data.data.data.find(f => f.id === file.id); // Find the file object in the data array
  
  //     if (!fileObject) {
  //       throw new Error("File not found in the API response");     
  //     }
      
  //     const fileUrl = `/storage/${fileObject.path}`;    // Extract the file path
  //     console.log("FILE_PATH", fileObject);
      
  //     console.log("File path:", fileUrl);    // Log the file path to verify
  
  //     const link = document.createElement('a');
  //     link.href = fileUrl;                   // Ensure this URL is correct
  //     link.download = fileObject.metadata.original_name; // Use a default name if fileObject.name is not available
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Failed to download the file:", error);
  //   }
  // };


  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/resources/resources?id=${file.id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("API response:", data); // Log the entire API response to check its structure
  
      const fileObject = data.data.data.find(f => f.id === file.id); // Find the file object in the data array
  
      if (!fileObject) {
        throw new Error("File not found in the API response");
      }
      
      // Check if metadata is a string and parse it if necessary
      const metadata = typeof fileObject.metadata === 'string' 
        ? JSON.parse(fileObject.metadata) 
        : fileObject.metadata;
  
      // If the path or original_name is undefined, log an error or handle it accordingly
      if (!metadata.path || !metadata.original_name) {
        throw new Error("Invalid metadata format: missing path or original_name");
      }
  
      const fileUrl = `/storage/${metadata.path}`; // Use the metadata for the file path
      console.log("File path:", fileUrl); // Log the file path to verify
  
      // Access the original_name from the metadata object
      const originalName = metadata.original_name || 'default_filename';
      console.log("Original name:", originalName);
  
      const link = document.createElement('a');
      link.href = fileUrl; // Ensure this URL is correct
      link.download = originalName; // Use the correct name or a fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download the file:", error);
    }
  };
  
  
  
  

  // const handleViewClick = (e) => {
  //   e.stopPropagation();
  //   onFileSelect(file); // Select this file for admin management
  // };


  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const fileUrl = `/storage/${file.metadata.path}`; // Construct the file URL
    window.open(fileUrl, '_blank'); // Open the file in a new tab
};


  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex justify-center items-center w-full pl-5">
          <img src={threeDotsIcon} alt="Options" className="h-auto w-auto" />
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <MenuItem>
              {({ active, close }) => (
                <button
                  onClick={(e) => handleRename(e, close)}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <img src={renameIcon} alt="Rename" className="mr-3 h-5 w-5" />
                  Rename
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleDownload}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <img src={downloadIcon} alt="Download" className="mr-3 h-5 w-5" />
                  Download
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleDelete}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <img src={deleteIcon} alt="Delete" className="mr-3 h-5 w-5" />
                  Delete
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleViewClick}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <img src={ViewIcon} alt="View" className="mr-3 h-5 w-5" />
                  View
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default PopupContent;
