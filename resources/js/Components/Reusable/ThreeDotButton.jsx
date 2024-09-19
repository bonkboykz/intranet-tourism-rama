import React, { useEffect, useRef, useState } from "react";

import PopupMenu from "./PopupMenu";

const ThreeDotButton = ({ selectedDepartmentId }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const buttonRef = useRef(null);
    const popupRef = useRef(null);

    const togglePopup = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsPopupOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (
            buttonRef.current &&
            !buttonRef.current.contains(event.target) &&
            popupRef.current &&
            !popupRef.current.contains(event.target)
        ) {
            setIsPopupOpen(false);
        }
    };

    useEffect(() => {
        if (isPopupOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPopupOpen]);

    const handleAssign = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("Assign Reporting Structure");
        setIsPopupOpen(false);
    };

    return (
        <div>
            <button ref={buttonRef} onClick={togglePopup} className="p-2">
                <img
                    src="/assets/threedots.svg"
                    alt="Menu"
                    className="h-5 w-[50px]"
                />
            </button>
            {isPopupOpen && (
                <div ref={popupRef}>
                    <PopupMenu
                        onAssign={handleAssign}
                        selectedDepartmentId={selectedDepartmentId}
                        onClose={() => setIsPopupOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default ThreeDotButton;
