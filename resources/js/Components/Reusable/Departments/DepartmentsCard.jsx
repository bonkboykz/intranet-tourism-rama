// DepartmentsCard.jsx
import React, { useRef } from "react";

import deleteIcon from "../../../../../public/assets/deleteicon.svg";
import defaultImage from "../../../../../public/assets/dummyStaffImage.png";

import "./css/DepartmentsCard.css";

const DepartmentsCard = ({
    name,
    imageUrl,
    onDeleteClick,
    departmentID,
    isMember = false,
    role,
}) => {
    const threeDotButtonRef = useRef(null);

    if (!isMember) {
        return null;
    }

    return (
        <div className="staff-member-card">
            <div className="card-header">
                <img
                    src={imageUrl || defaultImage}
                    alt={`${name} Banner`}
                    className="staff-member-image"
                />
                {role === "superadmin" && (
                    <button
                        className="status-button"
                        onClick={() => onDeleteClick(departmentID)}
                        ref={threeDotButtonRef}
                    >
                        <img
                            style={{ width: "40px" }}
                            src={deleteIcon}
                            alt="Delete Button"
                        />
                    </button>
                )}
            </div>
            <div className="card-body">
                <h3 className="staff-member-name">{name}</h3>
            </div>
            {isMember && (
                <div className="card-footer items-center justify-center">
                    <a href={`/departmentInner?departmentId=${departmentID}`}>
                        <button
                            className="justify-center text-primary font-semibold px-5 rounded-3xl border border-blue-500 bg-transparent hover:bg-primary-hover hover:text-white"
                            aria-label="Visit"
                        >
                            Visit
                        </button>
                    </a>
                </div>
            )}
        </div>
    );
};

export default DepartmentsCard;
