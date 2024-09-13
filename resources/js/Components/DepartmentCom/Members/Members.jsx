import { useState } from "react";
import axios from "axios";

import AddMemberPopup from "@/Components/Reusable/AddMemberPopup";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import { MemberCard } from "./MemberCard";

export const Members = ({
    members,
    onRefetch,
    departmentID,
    showInvite,
    setShowInvite,
}) => {
    const [activePopupId, setActivePopupId] = useState(null);
    const closePopup = () => {
        setActivePopupId(null);
    };

    const handleNewMemberAdded = () => {
        onRefetch();
    };

    const handleAddMember = (newMemberData) => {
        const newMember = {
            user_id: newMemberData.id,
            image:
                newMemberData.imageUrl || "/assets/dummyStaffPlaceHolder.jpg",
            name: newMemberData.name || "",
            business_post_title: newMemberData.role || "",
            is_active: newMemberData.isDeactivated || false,
        };

        handleNewMemberAdded(newMember);
    };

    const handleRemove = async (id) => {
        const url = `/api/department/employment_posts/${id}`;

        try {
            const response = await axios.delete(url);

            if (response.ok) {
                console.log("Member deleted successfully.");
                await onRefetch();
            } else {
                console.error("Failed to delete member:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting member:", error);
        }

        closePopup();
    };

    const handleAssign = async (user_id) => {
        try {
            const rolesResponse = await axios.post(
                `/api/department/departments/${departmentID}/invite-department-admin`,
                {
                    user_id: user_id,
                    department_id: departmentID,
                }
            );

            if (![200, 201, 204].includes(rolesResponse.status)) {
                console.error(
                    "Failed to assign admin:",
                    rolesResponse.statusText
                );
                return;
            }

            console.log("Admin promoted successfully.");
            onRefetch();
        } catch (error) {
            console.error("Error assigning admin:", error);
        }

        closePopup();
    };

    return (
        <>
            <div className="flex justify-between gap-5 mt-10 max-md:flex-wrap max-md:max-w-full">
                <section className="flex flex-col w-full">
                    <div className="flex gap-5 mb-2 whitespace-nowrap">
                        <h2 className="text-2xl font-bold text-black grow">
                            Members
                            <span className="ml-4 text-xl mt-0.5 font-semibold text-stone-300">
                                {members.length}
                            </span>
                        </h2>
                    </div>

                    {members.map((member, index) => (
                        <MemberCard
                            key={index}
                            id={member.user_id}
                            flag={member.flag}
                            employment_post_id={member.employment_post_id}
                            imageUrl={
                                member.staff_image ||
                                "/assets/dummyStaffPlaceHolder.jpg"
                            }
                            name={member.name}
                            title={member.business_post_title}
                            isActive={member.is_active}
                            activePopupId={activePopupId}
                            setActivePopupId={setActivePopupId}
                            onAssign={() => handleAssign(member.user_id)}
                            onRemove={handleRemove}
                            closePopup={closePopup}
                        />
                    ))}
                </section>
            </div>
            {showInvite && (
                <AddMemberPopup
                    isAddMemberPopupOpen={showInvite}
                    setIsAddMemberPopupOpen={setShowInvite}
                    departmentId={departmentID}
                    onNewMemberAdded={handleAddMember}
                />
            )}
        </>
    );
};
