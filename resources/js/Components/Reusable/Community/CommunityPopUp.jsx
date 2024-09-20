import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PopupMenu = ({
    onArchiveToggle,
    selectedDepartmentId,
    onClose,
    onDelete,
    isArchived,
    popupRef,
    modalRef,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        onDelete(selectedDepartmentId);
        setShowConfirm(false);
        onClose();
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    return (
        <div ref={popupRef} className="relative z-50">
            <div className="absolute right-0 z-50 bg-white border shadow-lg w-[190px] rounded-xl -mt-20">
                <button
                    onClick={() => {
                        onArchiveToggle(selectedDepartmentId);
                        onClose();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm font-extrabold text-gray-700 hover:bg-gray-100 hover:rounded-t-xl"
                >
                    {isArchived ? "Unarchive" : "Archive"}
                </button>
                <button
                    onClick={handleDeleteClick}
                    className="flex items-center w-full px-4 py-2 text-sm font-extrabold text-gray-700 hover:bg-gray-100 hover:rounded-b-xl"
                >
                    Delete
                </button>
            </div>
            {showConfirm &&
                createPortal(
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg"
                            ref={modalRef}
                        >
                            <p className="mb-4 text-lg">
                                Are you sure you want to delete this community?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={handleCancelDelete}
                                    className="px-8 py-1 text-white bg-red-500 rounded-full hover:bg-red-700"
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-8 py-1 text-base text-gray-400 bg-white border border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default PopupMenu;
