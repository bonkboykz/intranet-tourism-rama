import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { FaLock } from "react-icons/fa"; // Import the lock icon

import defaultImage from "../../../../../public/assets/dummyStaffImage.png";
import PopupMenu from "./CommunityPopUp";

import "./css/DepartmentsCard.css";

const CommunityCard = ({
    name,
    imageUrl,
    communityID,
    type,
    isArchived,
    onArchiveToggle,
    onDelete,
    role,
}) => {
    const isPrivate = type === "private"; // Add a fallback check
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen((prev) => !prev);
    };

    const handleAssign = () => {
        console.log("Reporting Structure");
        setIsPopupOpen(false);
    };

    const popupRef = useRef(null);
    const buttonRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickedInsideOfPopup = popupRef.current?.contains(
                event.target
            );
            const isClickedInsideOfModal = modalRef.current?.contains(
                event.target
            );

            const isClickedInsideOfButton = buttonRef.current?.contains(
                event.target
            );

            if (
                !isClickedInsideOfPopup &&
                !isClickedInsideOfModal &&
                !isClickedInsideOfButton
            ) {
                setIsPopupOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="staff-member-card">
            <div className="card-header">
                <img
                    src={imageUrl || defaultImage}
                    alt={name}
                    className="staff-member-image"
                />
                {["superadmin", "admin"].includes(role) && (
                    <button
                        className="status-button"
                        onClick={togglePopup}
                        ref={buttonRef}
                    >
                        <img
                            src="/assets/threedots.svg"
                            alt="Menu"
                            className="h-5 w-[50px]"
                        />
                    </button>
                )}
                {isPopupOpen && (
                    <PopupMenu
                        popupRef={popupRef}
                        modalRef={modalRef}
                        selectedDepartmentId={communityID}
                        onArchiveToggle={onArchiveToggle}
                        onDelete={onDelete}
                        isArchived={isArchived} // Pass the archived state to PopupMenu
                        onClose={() => console.log("Popup closed")} // Example onClose handler
                    />
                )}
            </div>
            <div className="card-body whitespace-nowrap overflow-hidden text-ellipsis">
                <div className="flex items-center justify-center">
                    <h3 className="staff-member-name whitespace-nowrap overflow-hidden text-ellipsis">
                        {name}
                        {isArchived && " (Archived)"}
                    </h3>
                    {isPrivate && (
                        <FaLock
                            style={{ color: "black" }}
                            className="mt-2 ml-1.5"
                        />
                    )}{" "}
                    {/* Lock icon in black */}
                </div>
            </div>
            <div className="card-footer items-center">
                <a href={`/communityInner?communityId=${communityID}`}>
                    <button
                        className="justify-center text-blue-500 font-semibold px-5 rounded-3xl border border-blue-500 bg-transparent hover:bg-blue-700 hover:text-white"
                        aria-label="Visit"
                    >
                        Visit
                    </button>
                </a>
            </div>
        </div>
    );
};

export default CommunityCard;
