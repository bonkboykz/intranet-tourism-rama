import React from "react";
import Modal from "react-modal";

import { CancelIcon } from "../Icons/CancelIcon";

const Popup = ({ isOpen, onClose, children }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            bodyOpenClassName="!overflow-hidden"
            style={{
                content: {
                    top: "54%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxWidth: "665px",
                    padding: "0",
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    zIndex: "1000",
                },
            }}
        >
            <button onClick={onClose} className="modal-close-button pt-3 px-2">
                <CancelIcon className="w-6 h-6" />
            </button>
            {children}
        </Modal>
    );
};

export default Popup;
