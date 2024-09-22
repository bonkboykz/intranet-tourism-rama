import { useState } from "react";
import axios from "axios";

import { MemberCard } from "./MemberCard";

export function Admins({ admins, communityID, onRefetch }) {
    const [activePopupId, setActivePopupId] = useState(null);
    const closePopup = () => {
        setActivePopupId(null);
    };

    const handleDemotion = async (admin, withRemove = false) => {
        try {
            const rolesResponse = await axios.post(
                `/api/communities/communities/${communityID}/revoke-community-admin`,
                {
                    user_id: admin.id,
                    community_id: communityID,
                    ...(withRemove == true && { remove: true }),
                }
            );

            if (![200, 201, 204].includes(rolesResponse.status)) {
                console.error(
                    "Failed to demote user:",
                    rolesResponse.statusText
                );
            }

            console.log("User demoted successfully.");
            onRefetch();
        } catch (error) {
            console.error("Error demoting user:", error);
        }

        closePopup();
    };

    const handleAdminRemove = async (member) => {
        await handleDemotion(member, true);
    };

    return (
        <>
            <header className="flex self-start gap-5 mt-6 whitespace-nowrap">
                <h1 className="text-2xl font-bold text-black">Admin</h1>
                <span className="text-xl mt-0.5 font-semibold text-stone-300">
                    {admins.length}
                </span>
            </header>

            {admins.map((admin, index) => {
                return (
                    <MemberCard
                        key={index}
                        id={admin.id}
                        flag="admin"
                        employment_post_id={admin.employment_post_id}
                        imageUrl={
                            admin.staff_image ||
                            "/assets/dummyStaffPlaceHolder.jpg"
                        }
                        name={admin.name}
                        titles={
                            admin.business_post_titles
                                ? admin.business_post_titles
                                : "No Title Avialable"
                        }
                        isActive={admin.is_active}
                        activePopupId={activePopupId}
                        setActivePopupId={setActivePopupId}
                        onAssign={() => handleDemotion(admin)}
                        onRemove={() => handleAdminRemove(admin)}
                        closePopup={closePopup}
                    />
                );
            })}
        </>
    );
}
