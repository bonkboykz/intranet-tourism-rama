import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { usePermissions } from "@/Utils/hooks/usePermissions";

import { Admins } from "./Members/Admins";
import { Members } from "./Members/Members";

function DepartmentMembers({ departmentID, loggedInID }) {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [showInvite, setShowInvite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [adminSearchResults, setAdminSearchResults] = useState([]);

    const fetchAdmins = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get(
                `/api/department/departments/${departmentID}/admins`
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

    const fetchMembers = async () => {
        setIsLoading(true);
        const membersUrl = `/api/department/employment_posts?department_id=${departmentID}`;

        // console.log(membersUrl);

        try {
            const response = await axios.get(membersUrl);

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to fetch members");
            }

            const membersData = response.data.data;

            const fetchedMembers = membersData || [];
            fetchedMembers.sort((a, b) => a.order - b.order);

            // console.log("MEMBERS", fetchedMembers);
            // setAdmins(updatedAdmins);
            setMembers(fetchedMembers);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
        fetchMembers();
    }, []);

    console.log("MEMBERS", members);
    console.log("ADMINS", admins);

    useEffect(() => {
        const fileteredAdmins = admins.filter((admin) =>
            admin.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        const filteredMembers = members.filter((member) =>
            member.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setAdminSearchResults(fileteredAdmins);
        setSearchResults(filteredMembers);
    }, [searchInput, members, admins]);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleInviteClick = () => {
        setShowInvite(true);
    };

    const handleCloseInvite = () => {
        setShowInvite(false);
    };

    console.log("SHOW INVITE", showInvite);

    if (isLoading) {
        return (
            <div className="loading-screen flex w-full justify-center items-center">
                <Loader2 className="w-12 h-10 animate-spin" />
            </div>
        );
    }

    const displayedAdmins =
        adminSearchResults.length > 0 ? adminSearchResults : [];
    const displayedMembers = searchResults.length > 0 ? searchResults : [];

    const nonAdminUsers = displayedMembers.filter(
        (member) => !admins.some((admin) => admin.id === member.user_id)
    );

    const { hasPermission } = usePermissions();

    const canInvite = hasPermission(
        `add remove staff members from the same department ${departmentID}`
    );

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
                            className="items-center justify-center px-4 py-2 text-center bg-[#4780FF] rounded-full hover:bg-primary-hover text-md whitespace-nowrap"
                        >
                            Search
                        </button>
                        {canInvite && (
                            <button
                                onClick={handleInviteClick}
                                className="flex items-center justify-center px-4 py-2 text-center bg-[#FF5437] rounded-full hover:bg-secondary-hover text-md whitespace-nowrap"
                            >
                                <img
                                    src="/assets/plus.svg"
                                    alt="Plus icon"
                                    className="w-3 h-3 mr-2"
                                />
                                Member
                            </button>
                        )}
                    </div>

                    <Admins
                        admins={displayedAdmins}
                        departmentID={departmentID}
                        onRefetch={() => {
                            fetchAdmins();
                            fetchMembers();
                        }}
                    />

                    <Members
                        members={nonAdminUsers}
                        departmentID={departmentID}
                        onRefetch={() => {
                            fetchAdmins();
                            fetchMembers();
                        }}
                        loggedInID={loggedInID}
                        setShowInvite={setShowInvite}
                        showInvite={showInvite}
                    />
                </>
            )}
        </section>
    );
}

export default DepartmentMembers;
