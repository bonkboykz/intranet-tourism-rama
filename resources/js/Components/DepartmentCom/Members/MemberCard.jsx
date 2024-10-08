import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

import { PopupMenuAdmin } from "@/Components/Reusable/Community/Members/PopupMenuAdmin";
import { DepartmentContext } from "@/Pages/DepartmentContext";
import { useClickOutside } from "@/Utils/hooks/useClickOutside";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import { Avatar } from "./Avatar";
import { PopupMenu } from "./PopupMenu";
import { UserInfo } from "./UserInfo";

export const MemberCard = ({
    id,
    flag,
    employment_post_id,
    imageUrl,
    name,
    title,
    status,
    isActive,
    onAssign,
    onRemove,
}) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleDotClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setShowPopup(!showPopup);
    };

    const { hasRole } = usePermissions();
    const { isAdmin } = useContext(DepartmentContext);

    const canAssignAdmin = hasRole("superadmin") || isAdmin;

    const canRemoveMember = hasRole("superadmin") || isAdmin;

    const showThreeDots = canAssignAdmin || canRemoveMember;

    const [showModal, setShowModal] = useState(false);

    const handleConfirmRemove = (event) => {
        event.preventDefault();
        event.stopPropagation();

        onRemove(employment_post_id);
        setShowModal(false);
    };

    const { buttonRef, popupRef, modalRef } = useClickOutside(() => {
        setShowPopup(false);
        setShowModal(false);
    });

    return (
        <a href={`/user/${id}`}>
            <div className="relative flex p-2 text-neutral-800 rounded-2xl align-center hover:bg-blue-100">
                <Avatar
                    src={imageUrl}
                    className="shrink-0 aspect-[0.95] w-[62px] rounded-full mb-4"
                    status={status}
                />
                <UserInfo name={name} role={title} isActive={isActive} />
                <div className="ml-auto">
                    {showThreeDots && (
                        <button
                            ref={buttonRef}
                            onClick={handleDotClick}
                            className="relative p-2"
                        >
                            <img
                                src="/assets/threedots.svg"
                                alt="Menu"
                                className="h-8 w-9"
                            />
                        </button>
                    )}
                    {showPopup && (
                        <div ref={popupRef}>
                            {flag === "admin" ? (
                                <PopupMenuAdmin
                                    onRemove={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowPopup(false);
                                        setShowModal(true);
                                    }}
                                    onAssign={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowPopup(false);
                                        onAssign(id);
                                    }}
                                />
                            ) : (
                                <PopupMenu
                                    onRemove={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowPopup(false);
                                        setShowModal(true);
                                    }}
                                    onAssign={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowPopup(false);
                                        onAssign(id);
                                    }}
                                    canAssignAdmin={canAssignAdmin}
                                    canRemoveMember={canRemoveMember}
                                />
                            )}
                        </div>
                    )}

                    {showModal &&
                        createPortal(
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                <div
                                    className="relative p-8 bg-white shadow-lg rounded-2xl w-96"
                                    ref={modalRef}
                                >
                                    <h2 className="mb-4 text-xl font-bold text-center">
                                        Delete member?
                                    </h2>
                                    <div className="flex justify-center space-x-4">
                                        <button
                                            className="px-6 py-2 text-base font-bold text-gray-400 bg-white border border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                            onClick={() => {
                                                setShowModal(false);
                                            }}
                                        >
                                            No
                                        </button>
                                        <button
                                            className="px-8 py-2 font-bold text-white bg-primary rounded-full hover:bg-primary-hover"
                                            onClick={handleConfirmRemove}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}
                </div>
            </div>
        </a>
    );
};
