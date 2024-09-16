import React from "react";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";

import deleteIcon from "../../../../public/assets/deleteicon.svg";
import downloadIcon from "../../../../public/assets/downloadicon.svg";
import renameIcon from "../../../../public/assets/renameicon.svg";
import threeDotsIcon from "../../../../public/assets/threedots.svg";
import ViewIcon from "../../../../public/assets/ViewIcon.svg";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const PopupContent = ({ file, onRename }) => {
    const handleDelete = (e) => {
        e.preventDefault();
        console.log("Delete clicked");
        // Add your delete logic here
        // For example, you might call an API to delete the file
        fetch(`/api/deleteFile/${file.id}`, { method: "DELETE" })
            .then((response) => response.json())
            .then((data) => {
                // Handle successful delete
                console.log("File deleted", data);
            })
            .catch((error) => {
                // Handle error
                console.error("Error deleting file", error);
            });
    };

    const handleDownload = (e) => {
        e.preventDefault();
        console.log("Download clicked");
        // Add your download logic here
        // For example, you might redirect to a download URL
        window.location.href = `/api/downloadFile/${file.id}`;
    };

    const handleRename = (e, close) => {
        e.preventDefault();
        onRename();
        close(); // Close the popup
    };

    const handleViewClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const fileUrl = `/storage/${file.metadata.path}`; // Construct the file URL
        window.open(fileUrl, "_blank"); // Open the file in a new tab
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton className="inline-flex justify-center items-center w-full pl-5">
                    <img
                        src={threeDotsIcon}
                        alt="Options"
                        className="h-auto w-auto"
                    />
                </MenuButton>
            </div>

            <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems className="absolute right-0 z-10 -mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <MenuItem>
                            {({ active, close }) => (
                                <button
                                    onClick={(e) => handleRename(e, close)}
                                    className={classNames(
                                        active
                                            ? "bg-blue-100 text-gray-900"
                                            : "text-gray-700",
                                        "group flex items-center px-4 py-2 text-sm w-full"
                                    )}
                                >
                                    <img
                                        src={renameIcon}
                                        alt="Rename"
                                        className="mr-3 h-7 w-7"
                                    />
                                    Rename
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    onClick={handleDelete}
                                    className={classNames(
                                        active
                                            ? "bg-blue-100 text-gray-900"
                                            : "text-gray-700",
                                        "group flex items-center px-4 py-2 text-sm w-full text-left"
                                    )}
                                >
                                    <img
                                        src={deleteIcon}
                                        alt="Delete"
                                        className="mr-3 h-7 w-7 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Delete
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    onClick={handleDownload}
                                    className={classNames(
                                        active
                                            ? "bg-blue-100 text-gray-900"
                                            : "text-gray-700",
                                        "group flex items-center px-4 py-2 text-sm w-full text-left"
                                    )}
                                >
                                    <img
                                        src={downloadIcon}
                                        alt="Download"
                                        className="mr-3 h-7 w-7 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Download
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    onClick={handleViewClick}
                                    className={classNames(
                                        active
                                            ? "bg-blue-100 text-gray-900"
                                            : "text-gray-700",
                                        "group flex items-center px-4 py-2 text-sm w-full"
                                    )}
                                >
                                    <img
                                        src={ViewIcon}
                                        alt="View"
                                        className="mr-3 h-7 w-7"
                                    />
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
