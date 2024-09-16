import { useContext } from "react";

import { CommunityContext } from "@/Pages/CommunityContext";
import { DepartmentContext } from "@/Pages/DepartmentContext";
import { usePermissions } from "@/Utils/hooks/usePermissions";

export function PostDetails({ onEdit, onDelete, onAnnouncement }) {
    const { hasRole } = usePermissions();

    const isSuperAdmin = hasRole("superadmin");
    const { isAdmin: isCommunityAdmin } = useContext(CommunityContext);
    const { isAdmin: isDepartmentAdmin } = useContext(DepartmentContext);

    const canMakeAnnouncement =
        isSuperAdmin || isCommunityAdmin || isDepartmentAdmin;

    return (
        <div className="absolute bg-white border-2 rounded-xl p-1 shadow-custom mt-16 right-0 w-[180px] h-auto z-10">
            <p
                className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                onClick={onEdit}
            >
                <img
                    className="w-6 h-6 mr-2"
                    src="/assets/EditIcon.svg"
                    alt="Edit"
                />
                Edit
            </p>
            <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
            <p
                className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                onClick={onDelete}
            >
                <img
                    className="w-6 h-6 mr-2"
                    src="/assets/DeleteIcon.svg"
                    alt="Delete"
                />
                Delete
            </p>
            <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
            {canMakeAnnouncement && (
                <p
                    className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                    onClick={onAnnouncement}
                >
                    <img
                        className="w-6 h-6 mr-2"
                        src="/assets/AnnounceIcon.svg"
                        alt="Announcement"
                    />
                    Announcement
                </p>
            )}
        </div>
    );
}
