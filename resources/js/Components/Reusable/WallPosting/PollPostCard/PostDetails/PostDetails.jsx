import { useContext } from "react";

import { CommunityContext } from "@/Pages/CommunityContext";
import { DepartmentContext } from "@/Pages/DepartmentContext";
import { usePermissions } from "@/Utils/hooks/usePermissions";

export function PostDetails({
    isClosed,
    onEdit,
    onDelete,
    onClose,
    onExport,
    popupRef,
    onAnnouncement,
    isAnnounced,
}) {
    const { hasRole } = usePermissions();

    const isSuperAdmin = hasRole("superadmin");
    const { isAdmin: isCommunityAdmin } = useContext(CommunityContext);
    const { isAdmin: isDepartmentAdmin } = useContext(DepartmentContext);

    const canMakeAnnouncement =
        isSuperAdmin || isCommunityAdmin || isDepartmentAdmin;

    return (
        <div
            className="absolute bg-white border-2 rounded-xl p-1 shadow-custom mt-16 right-0 w-[180px] h-auto z-10"
            ref={popupRef}
        >
            <p
                className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                onClick={onEdit}
            >
                <img
                    className="w-6 h-6 mr-2"
                    src="/assets/edit_poll.svg"
                    alt="Edit"
                />
                Edit
            </p>
            <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
            {!isClosed && (
                <>
                    <p
                        className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                        onClick={onClose}
                    >
                        <img
                            className="w-6 h-6 mr-2"
                            src="/assets/lock_poll.svg"
                            alt="Close"
                        />
                        Close poll
                    </p>
                    <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
                </>
            )}

            <p
                className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                onClick={onExport}
            >
                <img
                    className="w-6 h-6 mr-2"
                    src="/assets/export_poll.svg"
                    alt="Export"
                />
                Export
            </p>
            <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
            <p
                className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                onClick={onDelete}
            >
                <img
                    className="w-6 h-6 mr-2"
                    src="/assets/delete_poll.svg"
                    alt="Delete"
                />
                Delete poll
            </p>
            {canMakeAnnouncement && (
                <>
                    <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
                    <p
                        className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                        onClick={onAnnouncement}
                    >
                        <img
                            className="w-6 h-6 mr-2"
                            src="/assets/AnnounceIcon.svg"
                            alt="Announcement"
                        />
                        {isAnnounced ? "Unannounce" : "Announce"}
                    </p>
                </>
            )}
        </div>
    );
}
