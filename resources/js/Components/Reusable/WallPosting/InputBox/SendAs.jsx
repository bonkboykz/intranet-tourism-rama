import useUserData from "@/Utils/hooks/useUserData";
import { WallContext } from "../WallContext";
import { useContext } from "react";
import { useState } from "react";

export function SendAs({ postAs, onChange }) {
    const { variant: wallVariant } = useContext(WallContext);
    const { isSuperAdmin, id } = useUserData();

    const [postAsOpen, setPostAsOpen] = useState(false);

    const togglePostAsDropdown = () => {
        setPostAsOpen(!postAsOpen);
    };

    const handlePostAsSelect = (option) => {
        onChange(option);
        setPostAsOpen(false);
    };

    if (!["community", "department"].includes(wallVariant)) {
        return null;
    }

    if (!isSuperAdmin) {
        return null;
    }

    console.log("Send as", wallVariant, isSuperAdmin);

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
