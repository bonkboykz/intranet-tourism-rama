import React, { useState, useEffect, useRef } from "react";
import AddMemberPopup from "../Reusable/AddMemberPopup";
import { useCsrf } from "@/composables";
import { set } from "date-fns";

function Avatar({ src, alt, className, status }) {
    let source = null;

    if (src.startsWith("staff_image/")) {
        source = `/storage/${src}`;
    } else {
        source =
            src === "/assets/dummyStaffPlaceHolder.jpg"
                ? src
                : `/avatar/${src}`;
    }
    // const imageUrl = src === '/assets/dummyStaffPlaceHolder.jpg' ? src : `/avatar/full/${src}`;
    return (
        <div className="relative items-center justify-end h-16">
            <img loading="lazy" src={source} alt={alt} className={className} />
            {status === 1 && (
                <div className="absolute bottom-0 right-0 border-2 border-white bg-red-500 rounded-full w-[12px] h-[12px] mb-1"></div>
            )}
            {status === 2 && (
                <div className="absolute bottom-0 right-0 border-2 border-white bg-green-500 rounded-full w-[12px] h-[12px] mb-1"></div>
            )}
        </div>
    );
}

function UserInfo({ name, role, isActive }) {
    return (
        <div className="flex flex-col ml-2">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{name} </h2>
                {isActive && (
                    <span className="font-semibold text-red-500 text-l">
                        (Deactivated)
                    </span>
                )}
            </div>
            <p className="text-xs font-medium">{role}</p>
        </div>
    );
}

function UserCard({ src, alt, name, role, status }) {
    return (
        <div className="flex p-2 text-neutral-800 hover:bg-blue-100 rounded-2xl align-center">
            <Avatar
                src={src}
                alt={alt}
                className="shrink-0 aspect-[0.95] w-[62px] rounded-full mb-4"
                status={status}
            />
            <UserInfo name={name} role={role} />
        </div>
    );
}

const PopupMenuAdmin = ({ onRemove, onAssign, closePopup }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleRemoveClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setShowPopup(true);
    };

    const handleAssign = () => {
        event.preventDefault();
        event.stopPropagation();
        onAssign();
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleConfirmRemove = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemove();
        setShowPopup(false);
        closePopup();
    };

    return (
        <div className="relative">
            <div className="absolute right-0 z-50 bg-white border shadow-lg w-[190px] rounded-xl -mt-3">
                <button
                    onClick={handleAssign}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-t-xl"
                >
                    <img
                        src="/assets/personIcon.svg"
                        alt="Assign"
                        className="w-6 h-6 mr-2"
                    />
                    Assign as User
                </button>
                <button
                    onClick={handleRemoveClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-b-xl"
                >
                    <img
                        src="/assets/🦆 icon _image_.svg"
                        alt="Remove"
                        className="w-6 h-6 mr-2"
                    />
                    Remove
                </button>
            </div>

            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative p-8 bg-white shadow-lg rounded-2xl w-96">
                        <h2 className="mb-4 text-xl font-bold text-center">
                            Delete member?
                        </h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-6 py-2 text-base font-bold text-gray-400 bg-white border border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                onClick={handleClosePopup}
                            >
                                No
                            </button>
                            <button
                                className="px-8 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                onClick={handleConfirmRemove}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PopupMenu = ({ onRemove, onAssign, closePopup }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleRemoveClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setShowPopup(true);
    };

    const handleAssign = () => {
        event.preventDefault();
        event.stopPropagation();
        onAssign();
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleConfirmRemove = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemove();
        setShowPopup(false);
        closePopup();
    };

    return (
        <div className="relative">
            <div className="absolute right-0 z-50 bg-white border shadow-lg w-[190px] rounded-xl -mt-3">
                <button
                    onClick={handleAssign}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-t-xl"
                >
                    <img
                        src="/assets/personIcon.svg"
                        alt="Assign"
                        className="w-6 h-6 mr-2"
                    />
                    Assign as Admin
                </button>
                <button
                    onClick={handleRemoveClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-b-xl"
                >
                    <img
                        src="/assets/🦆 icon _image_.svg"
                        alt="Remove"
                        className="w-6 h-6 mr-2"
                    />
                    Remove
                </button>
            </div>

            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative p-8 bg-white shadow-lg rounded-2xl w-96">
                        <h2 className="mb-4 text-xl font-bold text-center">
                            Delete member?
                        </h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-6 py-2 text-base font-bold text-gray-400 bg-white border border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                onClick={handleClosePopup}
                            >
                                No
                            </button>
                            <button
                                className="px-8 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                onClick={handleConfirmRemove}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MemberCard = ({
    id,
    flag,
    employment_post_id,
    imageUrl,
    name,
    title,
    status,
    isActive,
    onAssign,
    onRemove,
    activePopupId,
    setActivePopupId,
    closePopup,
}) => {
    const popupRef = useRef(null);
    const buttonRef = useRef(null);

    // const handleDotClick = () => {
    //   if (activePopupId === id) {
    //     closePopup();
    //   } else {
    //     setActivePopupId(id);
    //   }
    // };

    const handleDotClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (activePopupId === id) {
            closePopup();
        } else {
            setActivePopupId(id);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                closePopup();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popupRef, closePopup]);

    return (
        <a href={`/user/${id}`}>
            <div className="relative flex p-2 text-neutral-800 rounded-2xl align-center hover:bg-blue-100">
                <Avatar
                    src={imageUrl}
                    className="shrink-0 aspect-[0.95] w-[62px] rounded-full mb-4"
                    status={status}
                />
                <UserInfo name={name} role={title} isActive={isActive} />
                <div className="ml-auto">
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
                    {activePopupId === id && (
                        <div ref={popupRef}>
                            {flag === "admin" ? (
                                <PopupMenuAdmin
                                    onRemove={() =>
                                        onRemove(employment_post_id)
                                    }
                                    onAssign={() => onAssign(id)}
                                    closePopup={closePopup}
                                />
                            ) : (
                                <PopupMenu
                                    onRemove={() =>
                                        onRemove(employment_post_id)
                                    }
                                    onAssign={() => onAssign(id)}
                                    closePopup={closePopup}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </a>
    );
};

function DpMembers() {
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

    const fetchMembersAndAdmins = async () => {
        setIsLoading(true);
        const departmentId = parseInt(getDepartmentIdFromQuery(), 10);
        const membersUrl = `/api/department/employment_posts?department_id=${departmentId}`;
        const rolesUrl = `/api/permission/model-has-roles?filter=2`;

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

            const fetchedMembers = membersData.members || [];
            fetchedMembers.sort((a, b) => a.order - b.order);

            const adminRoleEntries = Array.isArray(rolesData.data.data)
                ? rolesData.data.data
                : [];

            // Cross-check to determine which members are admins
            const fetchedAdmins = fetchedMembers.filter((member) =>
                adminRoleEntries.some(
                    (roleEntry) =>
                        parseInt(roleEntry.model_id, 10) ===
                            parseInt(member.user_id, 10) &&
                        parseInt(roleEntry.department_id, 10) === departmentId
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

            setAdmins(updatedAdmins);
            setMembers(updatedNonAdmins);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
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
            const rolesResponse = await fetch(
                `/api/permission/model-has-roles?model_id=${user_id}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN": csrfToken || "",
                    },
                }
            );

            if (!rolesResponse.ok) {
                console.error(
                    "Failed to fetch existing roles:",
                    rolesResponse.statusText
                );
                return;
            }

            const rolesData = await rolesResponse.json();
            const existingRoles = Array.isArray(rolesData.data.data)
                ? rolesData.data.data
                : [];

            const existingRoleIds = existingRoles.map((role) => role.role_id);
            const departmentId = getDepartmentIdFromQuery();

            console.log("EXISTING ROLES", existingRoles);

            let communityId = null;
            existingRoles.forEach((role) => {
                if (role.community_id) {
                    communityId = role.community_id;
                }
            });

            console.log("COMMUNITY_ID", communityId);

            if (!existingRoleIds.includes(2)) {
                existingRoleIds.push(2);
            }

            console.log("EXISTING ROLE IDS", existingRoleIds);

            const updatedRoles = {
                role_id: existingRoleIds,
                model_id: user_id,
                department_id: departmentId,
                community_id: communityId,
            };

            console.log("UPDATED ROLES", updatedRoles);

            const response = await fetch("/api/permission/model-has-roles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
                body: JSON.stringify(updatedRoles),
            });

            if (response.ok) {
                console.log("Admin assigned successfully.");
                await fetchMembersAndAdmins();
            } else {
                console.error("Failed to assign admin:", response.statusText);
            }
        } catch (error) {
            console.error("Error assigning admin:", error);
        }

        closePopup();
    };

    const handleDemotion = async (member) => {
        try {
            const rolesUrl = `/api/permission/model-has-roles?model_id=${member.user_id}`;

            const rolesResponse = await fetch(rolesUrl, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-Token": csrfToken || "",
                },
            });

            if (rolesResponse.ok) {
                const rolesData = await rolesResponse.json();
                const existingRoles = Array.isArray(rolesData.data.data)
                    ? rolesData.data.data
                    : [];

                // get community ids
                let communityId = null;
                existingRoles.forEach((role) => {
                    if (role.community_id) {
                        communityId = role.community_id;
                    }
                });

                console.log("EXISTING ROLES", existingRoles);

                const updatedRoles = existingRoles.filter(
                    (role) => !(role.role_id === 2)
                );

                console.log("UPDATED ROLES", updatedRoles);

                if (!updatedRoles.some((role) => role.role_id === 4)) {
                    updatedRoles.push({
                        role_id: 4,
                        model_id: member.user_id,
                    });
                }

                console.log("UPDATED ROLES", updatedRoles);

                const rolesPayload = {
                    role_id: updatedRoles.map((role) => role.role_id),
                    model_id: member.user_id,
                    department_id: member.department_id,
                    community_id: communityId,
                };

                console.log("ROLES PAYLOAD", rolesPayload);

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
                    console.log("User demoted successfully.");
                    await fetchMembersAndAdmins();
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
        } catch (error) {
            console.error("Error demoting user:", error);
        }

        closePopup();
    };

    const handleRemove = async (id) => {
        const url = `/api/department/employment_posts/${id}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-Token": csrfToken,
                },
            });

            if (response.ok) {
                console.log("Member deleted successfully.");
                await fetchMembersAndAdmins();
            } else {
                console.error("Failed to delete member:", response.statusText);
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

                        // Check if the user has role ID 4; if not, add it
                        if (!updatedRoles.some((role) => role.role_id === 4)) {
                            updatedRoles.push({
                                role_id: 4,
                                model_id: member.user_id,
                            });
                        }

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

    console.log("SHOW INVITE", showInvite);

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
                        <button
                            onClick={handleInviteClick}
                            className="flex items-center justify-center px-4 py-2 text-center bg-[#FF5437] rounded-full hover:bg-red-700 text-md whitespace-nowrap"
                        >
                            <img
                                src="/assets/plus.svg"
                                alt="Plus icon"
                                className="w-3 h-3 mr-2"
                            />
                            Member
                        </button>
                    </div>

                    <header className="flex self-start gap-5 mt-6 whitespace-nowrap">
                        <h1 className="text-2xl font-bold text-black">Admin</h1>
                        <span className="text-xl mt-0.5 font-semibold text-stone-300">
                            {admins.length}
                        </span>
                    </header>

                    {admins.map((admin, index) => (
                        <MemberCard
                            key={index}
                            id={admin.user_id}
                            flag={admin.flag}
                            employment_post_id={admin.employment_post_id}
                            imageUrl={
                                admin.staff_image ||
                                "/assets/dummyStaffPlaceHolder.jpg"
                            }
                            name={admin.name}
                            title={admin.business_post_title}
                            isActive={admin.is_active}
                            activePopupId={activePopupId}
                            setActivePopupId={setActivePopupId}
                            onAssign={() => handleDemotion(admin)}
                            onRemove={() => handleAdminRemove(admin)}
                            closePopup={closePopup}
                        />
                    ))}

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
                                    title={member.business_post_title}
                                    isActive={member.is_active}
                                    activePopupId={activePopupId}
                                    setActivePopupId={setActivePopupId}
                                    onAssign={() =>
                                        handleAssign(member.user_id)
                                    }
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
                            departmentId={getDepartmentIdFromQuery()}
                            onNewMemberAdded={handleAddMember}
                        />
                    )}
                </>
            )}
        </section>
    );
}

export default DpMembers;
