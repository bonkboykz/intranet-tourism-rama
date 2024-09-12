import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import AddMemberPopup from "../AddMemberPopup";
import { MemberCard } from "./MemberCard";

export function Members({
    members,
    communityID,
    onRefetch,
    searchInput,
    loggedInID,
}) {
    const [activePopupId, setActivePopupId] = useState(null);
    const closePopup = () => {
        setActivePopupId(null);
    };
    const [searchResults, setSearchResults] = useState([]);

    const handleRemove = async (id) => {
        const url = `/api/communities/communities/${communityID}/delete-member`;

        try {
            const response = await axios.post(url, {
                user_id: String(id),
            });

            if (![200, 201, 204].includes(response.status)) {
                console.error("Failed to delete member:", response.statusText);
                throw new Error("Failed to delete member.");
            }

            console.log("Member deleted successfully.");

            if (id === loggedInID) {
                window.location.reload();
            } else {
                onRefetch();
            }
        } catch (error) {
            console.error("Error deleting member:", error);
        }

        closePopup();
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

    const [showInvite, setShowInvite] = useState(false);

    // const handleInviteClick = () => {
    //     setShowInvite(true);
    // };

    // const handleCloseInvite = () => {
    //     setShowInvite(false);
    // };

    const handleNewMemberAdded = () => {
        onRefetch();
    };

    useEffect(() => {
        const filteredMembers = members.filter((member) =>
            member.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setSearchResults(filteredMembers);
    }, [searchInput, members]);

    const handleAssign = async (user_id) => {
        try {
            const rolesResponse = await axios.post(
                `/api/communities/communities/${communityID}/invite-community-admin`,
                {
                    user_id: user_id,
                    community_id: communityID,
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

    const getDepartmentIdFromQuery = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("department_id");
    };

    const displayedMembers = searchResults.length > 0 ? searchResults : members;

    return (
        <>
            <div className="flex justify-between gap-5 mt-10 max-md:flex-wrap max-md:max-w-full">
                <section className="flex flex-col w-full">
                    <div className="flex gap-5 mb-2 whitespace-nowrap">
                        <h2 className="text-2xl font-bold text-black grow">
                            Members
                            <span className="ml-4 text-xl mt-0.5 font-semibold text-stone-300">
                                {displayedMembers.length}
                            </span>
                        </h2>
                    </div>
                    {displayedMembers.map((member, index) => (
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
                            titles={
                                member.business_post_titles
                                    ? member.business_post_titles
                                    : "No Title Avialable"
                            }
                            isActive={member.is_active}
                            activePopupId={activePopupId}
                            setActivePopupId={setActivePopupId}
                            onAssign={() => handleAssign(member.user_id)}
                            onRemove={() => handleRemove(member.user_id)}
                            closePopup={closePopup}
                        />
                    ))}
                </section>
            </div>

            {showInvite && (
                <AddMemberPopup
                    isAddMemberPopupOpen={showInvite}
                    setIsAddMemberPopupOpen={setShowInvite}
                    departmentId={getDepartmentIdFromQuery()}
                    onNewMemberAdded={handleAddMember}
                />
            )}
        </>
    );
}
