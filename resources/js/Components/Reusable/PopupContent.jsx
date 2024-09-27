import React, { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const PopupContent = ({
    file,
    onRename,
    onDelete,
    onFileSelect,
    canEdit = true,
    onClose,
}) => {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {

        if (!showModal) return;

        const handleClickOutside = (event) => {
            const isClickedInsideOfModal = modalRef.current?.contains(
                event.target
            );
            if (!isClickedInsideOfModal) {
                setShowModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal]);

    if (!file || !file.id) {
        console.error("No file selected or file ID is missing.");
        return null;
    }

    const handleRename = (e, close) => {
        e.preventDefault();
        onRename();
        close();
    };

    const handleDelete = (e) => {
        e.preventDefault();
        onDelete(file.id);
    };

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/resources/resources/${file.id}`);
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            const fileObject = data.data;
            if (!fileObject)
                throw new Error("File not found in the API response");

            const metadata =
                typeof fileObject.metadata === "string"
                    ? JSON.parse(fileObject.metadata)
                    : fileObject.metadata;

            if (!metadata.path || !metadata.original_name) {
                throw new Error(
                    "Invalid metadata format: missing path or original_name"
                );
            }

            const fileUrl = `/storage/${metadata.path}`;
            const originalName = metadata.original_name || "default_filename";

            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = originalName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to download the file:", error);
        }
    };

    const handleViewClick = () => {
        if (file.metadata.path.endsWith(".pdf")) {
            const fileUrl = `/storage/${file.metadata.path}`;
            window.open(fileUrl, "_blank");
        } else {
            alert("Viewing is only available for PDF files.");
        }
    };

    const isPdf = file.metadata.path.endsWith(".pdf");

    return (
        <>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className="inline-flex justify-center items-center w-full pl-5 max-md:pl-1">
                        <img
                            src={threeDotsIcon}
                            alt="Options"
                            className="h-auto w-auto"
                        />
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
                    <MenuItems className="absolute right-0 z-10 mr-9 mt-[-103px] w-40 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {canEdit && (
                                <MenuItem>
                                    {({ active, close }) => (
                                        <button
                                            onClick={(e) =>
                                                handleRename(e, close)
                                            }
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
                                                className="mr-3 h-5 w-5"
                                            />
                                            Rename
                                        </button>
                                    )}
                                </MenuItem>
                            )}
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        onClick={handleDownload}
                                        className={classNames(
                                            active
                                                ? "bg-blue-100 text-gray-900"
                                                : "text-gray-700",
                                            "group flex items-center px-4 py-2 text-sm w-full"
                                        )}
                                    >
                                        <img
                                            src={downloadIcon}
                                            alt="Download"
                                            className="mr-3 h-5 w-5"
                                        />
                                        Download
                                    </button>
                                )}
                            </MenuItem>
                            {canEdit && (
                                <MenuItem>
                                    {({ active }) => (
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className={classNames(
                                                active
                                                    ? "bg-blue-100 text-gray-900"
                                                    : "text-gray-700",
                                                "group flex items-center px-4 py-2 text-sm w-full"
                                            )}
                                        >
                                            <img
                                                src={deleteIcon}
                                                alt="Delete"
                                                className="mr-3 h-5 w-5"
                                            />
                                            Delete
                                        </button>
                                    )}
                                </MenuItem>
                            )}
                            {isPdf && (
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
                                                className="mr-3 h-5 w-5"
                                            />
                                            View
                                        </button>
                                    )}
                                </MenuItem>
                            )}
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>
            {showModal &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div
                            className="relative p-8 bg-white shadow-lg rounded-2xl w-96"
                            ref={modalRef}
                        >
                            <h2 className="mb-4 text-xl font-bold text-center">
                                Delete file?
                            </h2>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="px-6 py-2 text-base font-bold text-gray-400 bg-white border border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                    onClick={() => {
                                        setShowModal(false);
                                        onClose();
                                    }}
                                >
                                    No
                                </button>
                                <button
                                    className="px-8 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                    onClick={handleDelete}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default PopupContent;
