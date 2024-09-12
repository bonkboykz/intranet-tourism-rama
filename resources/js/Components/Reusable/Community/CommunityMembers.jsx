import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useCsrf } from "@/composables";

import AddMemberPopup from "./CommunityMemberPopup";
import { MemberCard } from "./Members/MemberCard";

function CommunityMembers({ communityID, loggedInID }) {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [showInvite, setShowInvite] = useState(false);
    const [activePopupId, setActivePopupId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const csrfToken = useCsrf();

    const getDepartmentIdFromQuery = () => {
        const params = new URLSearchParams(location.search);
        return params.get("departmentId");
    };

    const fetchAdmins = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get(
                `/api/communities/communities/${communityID}/admins`
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to fetch admins");
            }

            const adminsData = response.data.data || [];
            console.log(response);
            setAdmins(adminsData);
        } catch (e) {
            console.error("Error fetching admins:", e);
        }

        setIsLoading(false);
    };

    const fetchMembersAndAdmins = async () => {
        setIsLoading(true);
        const departmentId = communityID;
        const membersUrl = `/api/communities/community_members?community_id=${communityID}`;
        const rolesUrl = `/api/permission/model-has-roles?filter=3`;

        try {
            const [membersResponse, rolesResponse] = await Promise.all([
                fetch(membersUrl, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-Token": csrfToken,
                    },
                }),
                fetch(rolesUrl, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-Token": csrfToken,
                    },
                }),
            ]);

            if (!membersResponse.ok) {
                throw new Error("Failed to fetch members");
            }
            if (!rolesResponse.ok) {
                throw new Error("Failed to fetch roles");
            }

            const membersData = await membersResponse.json();
            const rolesData = await rolesResponse.json();

            const fetchedMembers = membersData || [];
            fetchedMembers.sort((a, b) => a.order - b.order);

            console.log("MEMBERS DATA", membersData);

            const adminRoleEntries = Array.isArray(rolesData.data.data)
                ? rolesData.data.data
                : [];

            // Cross-check to determine which members are admins
            const fetchedAdmins = fetchedMembers.filter((member) =>
                adminRoleEntries.some(
                    (roleEntry) =>
                        parseInt(roleEntry.model_id, 10) ===
                            parseInt(member.user_id, 10) &&
                        parseInt(roleEntry.community_id, 10) ===
                            parseInt(departmentId)
                )
            );

            const fetchedNonAdmins = fetchedMembers.filter(
                (member) => !fetchedAdmins.includes(member)
            );

            // Flagging admins and members
            const updatedAdmins = fetchedAdmins.map((admin) => ({
                ...admin,
                flag: "admin",
            }));
            const updatedNonAdmins = fetchedNonAdmins.map((nonAdmin) => ({
                ...nonAdmin,
                flag: "member",
            }));

            // setAdmins(updatedAdmins);
            setMembers(updatedNonAdmins);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
        fetchMembersAndAdmins();
    }, []);

    console.log("MEMBERS", members);
    console.log("ADMINS", admins);

    useEffect(() => {
        const filteredMembers = members.filter((member) =>
            member.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setSearchResults(filteredMembers);
    }, [searchInput, members]);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleInviteClick = () => {
        setShowInvite(true);
    };

    const handleCloseInvite = () => {
        setShowInvite(false);
    };

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

            console.log("Admin assigned successfully.");
            await fetchAdmins();
        } catch (error) {
            console.error("Error assigning admin:", error);
        }

        closePopup();
    };

    const handleDemotion = async (member) => {
        try {
            const rolesResponse = await axios.post(
                `/api/communities/communities/${communityID}/revoke-community-admin`,
                {
                    user_id: member.user_id,
                    community_id: communityID,
                }
            );

            if (![200, 201, 204].includes(rolesResponse.status)) {
                console.error(
                    "Failed to demote user:",
                    rolesResponse.statusText
                );
            }

            console.log("User demoted successfully.");
            await fetchAdmins();
        } catch (error) {
            console.error("Error demoting user:", error);
        }

        closePopup();
    };

    const handleRemove = async (id) => {
        const url = `/api/communities/communities/${communityID}/delete-member`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-Token": csrfToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: String(id),
                }),
            });

            if (response.ok) {
                console.log("Member deleted successfully.");
                console.log("ID", id);
                console.log("LOGGED IN ID", loggedInID);
                if (id === loggedInID) {
                    window.location.reload();
                } else {
                    await fetchMembersAndAdmins();
                }
            } else {
                const errorData = await response.json();
                console.error(
                    "Failed to delete member:",
                    errorData.message || response.statusText
                );
            }
        } catch (error) {
            console.error("Error deleting member:", error);
        }

        closePopup();
    };

    const handleAdminRemove = async (member) => {
        const url = `/api/department/employment_posts/${member.employment_post_id}`;

        try {
            // Delete the member from the department
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-Token": csrfToken,
                },
            });

            if (response.ok) {
                console.log("Member deleted successfully.");

                // Check if the member is an admin and fetch their roles
                if (member.flag === "admin") {
                    const rolesUrl = `/api/permission/model-has-roles?model_id=${member.user_id}`;

                    const rolesResponse = await fetch(rolesUrl, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "X-CSRF-Token": csrfToken,
                        },
                    });

                    if (rolesResponse.ok) {
                        const rolesData = await rolesResponse.json();
                        const existingRoles = Array.isArray(rolesData.data.data)
                            ? rolesData.data.data
                            : [];

                        let communityId = null;
                        existingRoles.forEach((role) => {
                            if (role.community_id) {
                                communityId = role.community_id;
                            }
                        });

                        // Filter out the admin role for this department
                        const updatedRoles = existingRoles.filter(
                            (role) => !(role.role_id === 2)
                        );

                        console.log("UPDATED ROLES", updatedRoles);

                        const rolesPayload = {
                            role_id: updatedRoles.map((role) => role.role_id),
                            model_id: member.user_id,
                            community_id: communityId,
                        };

                        console.log("ROLES PAYLOAD", rolesPayload);

                        // Post the updated roles
                        const updateRolesResponse = await fetch(
                            "/api/permission/model-has-roles",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-CSRF-Token": csrfToken,
                                },
                                body: JSON.stringify(rolesPayload),
                            }
                        );

                        if (updateRolesResponse.ok) {
                            console.log("Admin role removed successfully.");
                        } else {
                            console.error(
                                "Failed to update roles:",
                                updateRolesResponse.statusText
                            );
                        }
                    } else {
                        console.error(
                            "Failed to fetch roles:",
                            rolesResponse.statusText
                        );
                    }
                }

                // Refresh the members and admins list after deletion
                await fetchMembersAndAdmins();
            } else {
                console.error("Failed to delete member:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting member:", error);
        }

        closePopup();
    };

    const closePopup = () => {
        setActivePopupId(null);
    };

    const handleNewMemberAdded = (newMember) => {
        fetchMembersAndAdmins();
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

    const displayedMembers = searchResults.length > 0 ? searchResults : members;

    return (
        <section className="flex flex-col h-auto max-w-full p-6 rounded-3xl max-md:px-5">
            {isLoading ? (
                <div className="loading-screen">Loading...</div>
            ) : (
                <>
                    <div className="flex items-center gap-3.5 text-base font-bold text-white max-md:flex-wrap max-md:max-w-full">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleSearchChange}
                            className="flex-grow px-4 py-2 bg-gray-100 border-gray-100 rounded-full text-md text-neutral-800 max-md:px-5 max-md:max-w-full"
                            placeholder="Search Member"
                        />
                        <button
                            onClick={handleSearchChange}
                            className="items-center justify-center px-4 py-2 text-center bg-[#4780FF] rounded-full hover:bg-blue-700 text-md whitespace-nowrap"
                        >
                            Search
                        </button>
                    </div>

                    <header className="flex self-start gap-5 mt-6 whitespace-nowrap">
                        <h1 className="text-2xl font-bold text-black">Admin</h1>
                        <span className="text-xl mt-0.5 font-semibold text-stone-300">
                            {admins.length}
                        </span>
                    </header>

                    {admins.map((admin, index) => {
                        console.log("admin", admin);

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
                                    employment_post_id={
                                        member.employment_post_id
                                    }
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
                                    onAssign={() =>
                                        handleAssign(member.user_id)
                                    }
                                    onRemove={() =>
                                        handleRemove(member.user_id)
                                    }
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
            )}
        </section>
    );
}

export default CommunityMembers;
