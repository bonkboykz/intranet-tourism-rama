import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";

import { CommunityContext } from "@/Pages/CommunityContext";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import { Avatar } from "./Avatar";
import { PopupMenu } from "./PopupMenu";
import { PopupMenuAdmin } from "./PopupMenuAdmin";
import { UserInfo } from "./UserInfo";

export const MemberCard = ({
    id,
    flag,
    employment_post_id,
    imageUrl,
    name,
    titles,
    status,
    isActive,
    onAssign,
    onRemove,
    closePopup,
}) => {
    const popupRef = useRef(null);
    const buttonRef = useRef(null);

    const [showPopup, setShowPopup] = useState(false);

    const handleDotClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setShowPopup(!showPopup);
    };

    const modalAdminRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickedInsideOfPopup = popupRef.current?.contains(
                event.target
            );
            const isClickedInsideOfModal = modalRef.current?.contains(
                event.target
            );
            const isClickedInsideOfModalAdmin = modalAdminRef.current?.contains(
                event.target
            );

            const isClickedInsideOfButton = buttonRef.current?.contains(
                event.target
            );

            // console.log(event.target);

            // console.log(
            //     "isClickedInsideOfPopup",
            //     isClickedInsideOfPopup,
            //     popupRef.current
            // );
            // console.log(
            //     "isClickedInsideOfModal",
            //     isClickedInsideOfModal,
            //     modalRef.current
            // );
            // console.log(
            //     "isClickedInsideOfModalAdmin",
            //     isClickedInsideOfModalAdmin,
            //     modalAdminRef.current
            // );
            // console.log(
            //     "isClickedInsideOfButton",
            //     isClickedInsideOfButton,
            //     buttonRef.current
            // );

            if (
                !isClickedInsideOfPopup &&
                !isClickedInsideOfModal &&
                !isClickedInsideOfModalAdmin &&
                !isClickedInsideOfButton
            ) {
                setShowPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closePopup]);

    const { hasRole } = usePermissions();
    const { isAdmin, user } = useContext(CommunityContext);

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
                <UserInfo name={name} titles={titles} isActive={isActive} />
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
                                    onRemove={() =>
                                        onRemove(employment_post_id)
                                    }
                                    onAssign={() => onAssign(id)}
                                    closePopup={closePopup}
                                    modalRef={modalAdminRef}
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
                                    modalRef={modalRef}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </a>
    );
};
