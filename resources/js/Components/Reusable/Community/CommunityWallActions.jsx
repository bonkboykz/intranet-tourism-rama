import { useContext } from "react";
import axios from "axios";

import { CommunityContext } from "@/Pages/CommunityContext";

export function CommunityWallActions({
    hasJoined,
    handleJoinOrExit,
    handleAddMember,
}) {
    const { role, is_member, type, communityID, isJoinRequestPending } =
        useContext(CommunityContext);

    const createJoinRequest = async () => {
        try {
            const response = await axios.post(`/api/createJoinGroupRequest`, {
                group_id: communityID,
            });

            if ([200, 201, 204].includes(response.status)) {
                // TODO: Change this to a toast notification
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (type === "public") {
        return (
            <button
                className={`px-4 py-2 text-white rounded-full ${
                    hasJoined ? "bg-[#FF5437]" : "bg-[#FF5437] hover:bg-red-700"
                }`}
                onClick={handleJoinOrExit}
            >
                {hasJoined ? "Exit Group" : "Join"}
            </button>
        );
    }

    if (["superadmin", "admin"].includes(role)) {
        return (
            <button
                className="px-4 py-2 text-white bg-[#FF5437] rounded-full hover:bg-red-700"
                onClick={handleAddMember}
            >
                Invite
            </button>
        );
    }

    if (is_member) {
        return (
            <button
                className="px-4 py-2 text-white bg-[#FF5437] rounded-full hover:bg-red-700"
                onClick={handleJoinOrExit}
            >
                Exit Group
            </button>
        );
    }

    if (isJoinRequestPending) {
        return (
            <button
                className="px-4 py-2 text-white bg-[#FF5437] rounded-full hover:bg-red-700"
                disabled
            >
                Request Pending
            </button>
        );
    }

    return (
        <button
            className="px-4 py-2 text-white bg-[#FF5437] rounded-full hover:bg-red-700"
            onClick={createJoinRequest}
        >
            Join
        </button>
    );
}
