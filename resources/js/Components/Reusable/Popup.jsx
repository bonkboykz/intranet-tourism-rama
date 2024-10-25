import React from "react";
import ReactDOM from "react-dom";

import "./Popup.css"; // Make sure to create the relevant CSS for styling

export function IconButton({ icon, alt, onClick }) {
    return (
        <div
            className="shrink-0 w-6 aspect-square cursor-pointer"
            onClick={onClick}
        >
            <img src={icon} alt={alt} />
        </div>
    );
}

const Popup = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div
                className="popup-content rounded-2xl max-md:mx-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="popup-close w-full flex justify-end">
                    <IconButton
                        icon="/assets/cancel.svg"
                        alt="Close icon"
                        onClick={onClose}
                    />
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Popup;
