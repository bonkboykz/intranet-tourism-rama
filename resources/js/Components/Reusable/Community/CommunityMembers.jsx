import React, { useEffect, useState } from "react";
import { toast,ToastContainer } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { Admins } from "./Members/Admins";
import { Members } from "./Members/Members";

import "react-toastify/dist/ReactToastify.css";

function CommunityMembers({ communityID, loggedInID }) {
    const [searchInput, setSearchInput] = useState("");
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
            setAdmins(adminsData);
        } catch (e) {
            toast.error("Error fetching admins", {
                position: "top-right",
                icon: <Loader2 className="w-6 h-6 text-white" />,
            });
            console.error("Error fetching admins:", e);
        }

        setIsLoading(false);
    };

    const fetchMembers = async () => {
        setIsLoading(true);
        const membersUrl = `/api/communities/community_members?community_id=${communityID}`;

        try {
            const response = await axios.get(membersUrl);

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to fetch members");
            }

            const membersData = response.data;
            const fetchedMembers = membersData || [];
            fetchedMembers.sort((a, b) => a.order - b.order);

            setMembers(fetchedMembers);
        } catch (error) {
            toast.error("Error fetching members", {
                position: "top-right",
                icon: <Loader2 className="w-6 h-6 text-white" />,
            });
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
        fetchMembers();
    }, []);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const [searchResults, setSearchResults] = useState([]);
    const [adminSearchResults, setAdminSearchResults] = useState([]);

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

    const displayedAdmins =
        adminSearchResults.length > 0 ? adminSearchResults : [];
    const displayedMembers = searchResults.length > 0 ? searchResults : [];

    const nonAdminUsers = displayedMembers.filter(
        (member) => !admins.some((admin) => admin.id === member.user_id)
    );

    const handleDemotion = async (admin, withRemove = false) => {
        try {
            const rolesResponse = await axios.post(
                `/api/communities/communities/${communityID}/revoke-community-admin`,
                {
                    user_id: admin.id,
                    community_id: communityID,
                    ...(withRemove && { remove: true }),
                }
            );

            if (![200, 201, 204].includes(rolesResponse.status)) {
                console.error(
                    "Failed to demote user:",
                    rolesResponse.statusText
                );
                toast.error("Failed to demote user", {
                    position: "top-right",
                    icon: <Loader2 className="w-6 h-6 text-white" />,
                });
                return;
            }

            if (admin.id === loggedInID) {
                window.location.reload();
                return;
            }

            toast.success("User demoted successfully", {
                position: "top-right",
                icon: <Loader2 className="w-6 h-6 text-white" />,
            });

            fetchAdmins();
            fetchMembers();
        } catch (error) {
            console.error("Error demoting user:", error);
            toast.error("Error demoting user", {
                position: "top-right",
                icon: <Loader2 className="w-6 h-6 text-white" />,
            });
        }
    };

    const handleAdminRemove = async (admin) => {
        if (admins.length === 1) {
            toast.error("Community name is required.");
            return;
        }
        await handleDemotion(admin, true);
    };

    if (isLoading) {
        return (
            <div className="loading-screen flex w-full justify-center items-center">
                <Loader2 className="w-12 h-10 animate-spin" />
            </div>
        );
    }

    return (
        <section className="flex flex-col h-auto max-w-full p-6 rounded-3xl max-md:px-5">
            <ToastContainer />
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
            </div>

            <Admins
                admins={displayedAdmins}
                communityID={communityID}
                onRefetch={() => {
                    fetchAdmins();
                    fetchMembers();
                }}
                loggedInID={loggedInID}
                onRemoveAdmin={handleAdminRemove} // Pass handleAdminRemove to Admins
            />

            <Members
                members={nonAdminUsers}
                communityID={communityID}
                onRefetch={() => {
                    fetchAdmins();
                    fetchMembers();
                }}
                searchInput={searchInput}
                loggedInID={loggedInID}
            />
        </section>
    );
}

export default CommunityMembers;
