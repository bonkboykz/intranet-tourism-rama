import React, { useState } from "react";
import { useContext } from "react";

import { DepartmentContext } from "@/Pages/DepartmentContext";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import PopupMenu from "./DepartmentsPopUp";

const ThreeDotButton = ({ selectedDepartmentId }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen((prev) => !prev);
    };

    const handleAssign = () => {
        console.log("Reporting Structure");
        setIsPopupOpen(false);
    };

    const { hasRole } = usePermissions();

    const canHandleOrdering = hasRole("superadmin");

    if (!canHandleOrdering) {
        return null;
    }

    return (
        <div className="relative">
            <button onClick={togglePopup} className="p-2 mt-1">
                <img
                    src="/assets/threedots.svg"
                    alt="Menu"
                    className="h-5 w-[15]"
                />
            </button>
            {isPopupOpen && (
                <PopupMenu
                    onAssign={handleAssign}
                    selectedDepartmentId={selectedDepartmentId}
                    onClose={() => setIsPopupOpen(false)}
                />
            )}
        </div>
    );
};

export default ThreeDotButton;
