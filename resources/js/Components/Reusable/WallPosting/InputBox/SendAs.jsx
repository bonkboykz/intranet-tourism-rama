import { useContext } from "react";
import { useState } from "react";

import { usePermissions } from "@/Utils/hooks/usePermissions";
import useUserData from "@/Utils/hooks/useUserData";

export function SendAs({ postAs, onChange, departmentId, communityId }) {
    const { isSuperAdmin, id } = useUserData();

    const { hasRole } = usePermissions();

    const [postAsOpen, setPostAsOpen] = useState(false);

    const isCommunityAdmin = hasRole(`community admin ${communityId}`);
    const isDeparmtentAdmin = hasRole(`department admin ${departmentId}`);

    const togglePostAsDropdown = () => {
        setPostAsOpen(!postAsOpen);
    };

    const handlePostAsSelect = (option) => {
        onChange(option);
        setPostAsOpen(false);
    };

    if (!departmentId && !communityId) {
        return null;
    }

    if (!isSuperAdmin && !isCommunityAdmin && !isDeparmtentAdmin) {
        return null;
    }

    return (
        <div className="relative inline-block text-left flex self-end">
            <button
                onClick={togglePostAsDropdown}
                className="px-4 py-2 text-sm font-medium   rounded-md focus:outline-none"
            >
                {postAs}
                <span className="ml-2">▼</span>
            </button>
            {postAsOpen && (
                <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1">
                        <li
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                                handlePostAsSelect("Post as a member")
                            }
                        >
                            Post as a member
                        </li>
                        <li
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                                handlePostAsSelect("Post as an admin")
                            }
                        >
                            Post as an admin
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
