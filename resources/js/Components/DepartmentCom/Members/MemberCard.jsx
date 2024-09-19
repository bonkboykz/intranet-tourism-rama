import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";

import { PopupMenuAdmin } from "@/Components/Reusable/Community/Members/PopupMenuAdmin";
import { DepartmentContext } from "@/Pages/DepartmentContext";
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
    activePopupId,
    setActivePopupId,
    closePopup,
}) => {
    const popupRef = useRef(null);
    const buttonRef = useRef(null);

    // const handleDotClick = () => {
    //   if (activePopupId === id) {
    //     closePopup();
    //   } else {
    //     setActivePopupId(id);
    //   }
    // };

    const handleDotClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (activePopupId === id) {
            closePopup();
        } else {
            setActivePopupId(id);
        }
    };

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (
    //             popupRef.current &&
    //             !popupRef.current.contains(event.target) &&
    //             buttonRef.current &&
    //             !buttonRef.current.contains(event.target)
    //         ) {
    //             closePopup();
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [popupRef, closePopup]);

    const { hasRole } = usePermissions();
    const { isAdmin, user } = useContext(DepartmentContext);

    const canAssignAdmin = hasRole("superadmin") || isAdmin;

    // TODO: add if member is himself
    const canRemoveMember = hasRole("superadmin") || isAdmin || user?.id === id;

    const showThreeDots = canAssignAdmin || canRemoveMember;

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
                    {activePopupId === id && (
                        <div ref={popupRef}>
                            {flag === "admin" ? (
                                <PopupMenuAdmin
                                    onRemove={() =>
                                        onRemove(employment_post_id)
                                    }
                                    onAssign={() => onAssign(id)}
                                    closePopup={closePopup}
                                />
                            ) : (
                                <PopupMenu
                                    onRemove={() =>
                                        onRemove(employment_post_id)
                                    }
                                    onAssign={() => onAssign(id)}
                                    closePopup={closePopup}
                                    canAssignAdmin={canAssignAdmin}
                                    canRemoveMember={canRemoveMember}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </a>
    );
};
