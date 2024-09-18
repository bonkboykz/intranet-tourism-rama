import * as React from "react";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { usePage } from "@inertiajs/react";
import { add, set } from "date-fns";

import { FileTable } from "@/Components/FileManagement";
import {
    Filter,
    OutputData,
    ShareYourThoughts,
} from "@/Components/Reusable/WallPosting";
import { useCsrf } from "@/composables";
import { CommunityContext } from "@/Pages/CommunityContext";

import defaultImage from "../../../../../public/assets/dummyStaffPlaceHolder.jpg";
import { SearchButton, SearchInput, Table } from "../../ProfileTabbar";
import { ImageProfile, VideoProfile } from "../../ProfileTabbar/Gallery";
import { WallContext } from "../WallPosting/WallContext";
import CmMembers from "./CommunityMembers";
import { CommunityWallActions } from "./CommunityWallActions";
import EditCommunity from "./EditCommunity";

function HeaderSection({
    communityID,
    departmentHeader,
    departmentBanner,
    departmentDescription,
    onEditClick,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [textContent, setTextContent] = useState("");

    useEffect(() => {
        setTextContent(departmentDescription || ""); // Ensure textContent is always a string
    }, [departmentDescription]);

    const handleEditClick = () => {
        onEditClick(true); // Notify parent to open the edit popup
    };

    const handleInputChange = (e) => {
        setTextContent(e.target.value);
    };

    const handleSaveClick = async () => {
        try {
            const updatedDescription = textContent;

            const response = await fetch(
                `/api/communities/communities/${communityID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ description: updatedDescription }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update description");
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating description:", error);
        }
    };

    // console.log(departmentBanner);

    // Check if departmentBanner is defined and a string
    let banner = null;
    if (
        typeof departmentBanner === "string" &&
        departmentBanner.startsWith("banner/")
    ) {
        banner = `/storage/${departmentBanner}`;
    } else {
        banner = departmentBanner || "/assets/defaultCommunity.png";
    }

    const { isAdmin } = useContext(CommunityContext);

    return (
        <header className="flex overflow-hidden relative flex-col px-11 py-9 w-[875px] h-[291.67px] text-white max-md:px-5 w-full rounded-t-xl max-md:-mt-12">
            <img
                loading="lazy"
                src={banner}
                className="absolute inset-0 object-cover size-full"
                alt=""
            />
            <div className="relative flex justify-between w-full gap-0 py-2 max-md:flex-wrap max-md:max-w-full">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold drop-shadow-lg text-start shadow-neutral-100">
                        {departmentHeader}
                    </h1>
                </div>
                <div className="flex content-center self-start justify-between gap-5 text-sm font-medium"></div>
            </div>
            <div className="relative -mt-2 font-medium text-md max-md:max-w-full drop-shadow-lg">
                {isEditing ? (
                    <textarea
                        className="w-full h-32 p-2 text-white bg-inherit focus:outline-none focus:ring focus:ring-blue-500"
                        value={textContent}
                        onChange={handleInputChange}
                    />
                ) : (
                    textContent
                )}
            </div>
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/d4ed48051cb5cb802fc585e5dc4525ddee2547b00e05bf15b875d0202cc7db34?apiKey=d66b6c2c936f4300b407b67b0a5e8c4d&"
                className="mt-6 aspect-square w-[30px]"
                alt="Section Icon"
            />
            {isAdmin && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-start gap-4 py-4 px-11 max-md:px-5">
                    {isEditing ? (
                        <button
                            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-md"
                            onClick={handleSaveClick}
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            className="flex items-center justify-center w-8 h-8 px-1 py-1 mb-4 text-white bg-blue-500 rounded-full"
                            onClick={handleEditClick}
                        >
                            <img
                                src="/assets/pencil.svg"
                                alt="Edit Icon"
                                className="w-4 h-4 "
                            />
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}

function Navigation({ communityID, departmentName, type }) {
    const [activeTab, setActiveTab] = useState("Post");
    const [polls, setPolls] = useState([]);
    const [hasJoined, setHasJoined] = useState(false);
    const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const csrfToken = useCsrf();
    const { props } = usePage();
    const { id } = props;
    let debounceTimeout;

    const checkMembership = async () => {
        try {
            const url = `api/communities/community_members?user_id=${id}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-Token": csrfToken,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const isMember = data.some(
                    (member) =>
                        String(member.community_id) === String(communityID)
                );
                setHasJoined(isMember);
            } else {
                console.error("Failed to fetch membership data");
            }
        } catch (error) {
            console.error("Error checking membership:", error);
        }
    };

    useEffect(() => {
        checkMembership();
    }, [id, communityID]);

    const fetchAllSearchResults = async (query) => {
        setError("");
        setLoading(true);
        let allResults = [];

        try {
            const response = await fetch(
                `/api/users/users?search=${query}&disabledPagination=true&with[]=profile&with[]=employmentPosts.department&with[]=employmentPosts.businessPost&with[]=employmentPosts.businessUnit`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const responseText = await response.text();
            const data = responseText ? JSON.parse(responseText) : {};

            allResults = data.data;

            setSearchResults(allResults);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setError("Failed to fetch search results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        clearTimeout(debounceTimeout);

        if (searchTerm.trim() !== "") {
            debounceTimeout = setTimeout(() => {
                fetchAllSearchResults(searchTerm);
            }, 1000);
        } else {
            setSearchResults([]);
            setLoading(false);
        }

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm]);

    const handleCreatePoll = (poll) => {
        setPolls((prevPolls) => [...prevPolls, poll]);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const addPublicMember = async () => {
        const url = `api/communities/communities/${communityID}/add-member`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-Token": csrfToken,
            },
        };

        const body = {
            user_id: String(id),
        };

        try {
            const response = await fetch(url, {
                ...options,
                body: JSON.stringify(body),
            });
            if (response.ok) {
                console.log("Member added successfully");
                setHasJoined(true);

                // TODO: refactor this hack
                window.location.reload();
            } else {
                throw new Error("Failed to add member");
            }
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const removePublicMember = async () => {
        const url = `api/communities/communities/${communityID}/delete-member`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-Token": csrfToken,
            },
        };

        const body = {
            user_id: String(id),
        };

        try {
            const response = await fetch(url, {
                ...options,
                body: JSON.stringify(body),
            });
            if (response.ok) {
                console.log("Member removed successfully");
                // TODO: refactor this hack
                window.location.reload();
            } else {
                throw new Error("Failed to remove member");
            }
        } catch (error) {
            console.error("Error removing member:", error);
        }
    };

    const handleJoinOrExit = () => {
        if (hasJoined) {
            removePublicMember();
        } else {
            addPublicMember();
        }
    };

    const handleAddMember = () => {
        setIsAddMemberPopupOpen(true);
    };

    const handleSelectPerson = async (person) => {
        try {
            // Fetch the current community members
            const response = await fetch(
                `/api/communities/community_members?community_id=${communityID}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch community members.");
            }

            const members = await response.json();

            // Check if the selected person is already in the community
            const isAlreadyMember = members.some(
                (member) => String(member.user_id) === String(person.id)
            );

            if (isAlreadyMember) {
                setErrorMessage(
                    `${person.name} is already a member of this community.`
                );
            } else if (selectedUsers.some((user) => user.id === person.id)) {
                setSelectedUsers(
                    selectedUsers.filter((user) => user.id !== person.id)
                );
            } else {
                setSelectedUsers([...selectedUsers, person]);
            }
        } catch (error) {
            console.error("Error checking membership:", error);
        }
    };

    const handleDeselectPerson = (person) => {
        setSelectedUsers(selectedUsers.filter((user) => user.id !== person.id));
    };

    const handleAddMembersToCommunity = async () => {
        try {
            for (const user of selectedUsers) {
                await fetch(
                    `api/communities/communities/${communityID}/add-member`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "X-CSRF-Token": csrfToken,
                        },
                        body: JSON.stringify({ user_id: String(user.id) }),
                    }
                );
            }
            console.log("All selected members added successfully");
            setIsAddMemberPopupOpen(false);
            setSelectedUsers([]);

            // TODO: refactor this hack
            window.location.reload();
        } catch (error) {
            console.error("Error adding members:", error);
        }
    };

    const getImageSource = (imageUrl) => {
        console.log("imageURL", imageUrl);
        if (imageUrl === defaultImage) {
            return defaultImage;
        }
        if (imageUrl.startsWith("staff_image/")) {
            return `/storage/${imageUrl}`;
        } else {
            return imageUrl === "/assets/dummyStaffPlaceHolder.jpg"
                ? imageUrl
                : `/avatar/${imageUrl}`;
        }
    };

    const renderTitles = (employmentPosts) => {
        if (!employmentPosts || employmentPosts.length === 0) {
            return (
                <span className="font-light text-gray-600">
                    No title available
                </span>
            );
        }

        const uniqueTitles = [
            ...new Set(
                employmentPosts
                    .map((post) => post.business_post?.title)
                    .filter(Boolean)
            ),
        ];

        if (uniqueTitles.length === 0) {
            return (
                <span className="font-light text-gray-600">
                    No title available
                </span>
            );
        }

        return uniqueTitles.map((title, index) => (
            <div key={index} className="font-light text-gray-600">
                {title}
            </div>
        ));
    };

    const [filterType, setFilterType] = useState(null);

    const { userId, isMember } = useContext(CommunityContext);

    const [fileSearchTerm, setFileSearchTerm] = useState("");

    return (
        <WallContext.Provider
            value={{
                variant: "community",
                loggedInUserId: userId,
            }}
        >
            <div className="flex flex-col">
                <nav className="flex items-start w-full gap-5 py-6 text-sm font-semibold text-center bg-white shadow-custom px-9 rounded-b-2xl text-stone-300 max-md:flex-wrap max-md:max-w-full">
                    <div
                        className={`cursor-pointer ${
                            activeTab === "Post" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleTabClick("Post")}
                    >
                        Post
                    </div>
                    <div
                        className={`cursor-pointer ${
                            activeTab === "Gallery" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleTabClick("Gallery")}
                    >
                        Gallery
                    </div>
                    <div
                        className={`cursor-pointer ${
                            activeTab === "Files" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleTabClick("Files")}
                    >
                        Files
                    </div>
                    <div
                        className={`cursor-pointer ${
                            activeTab === "Members" ? "text-blue-500" : ""
                        }`}
                        onClick={() => handleTabClick("Members")}
                    >
                        Members
                    </div>
                    <div className="ml-auto">
                        <CommunityWallActions
                            hasJoined={hasJoined}
                            handleJoinOrExit={handleJoinOrExit}
                            handleAddMember={handleAddMember}
                        />
                    </div>
                </nav>

                <div className="relative">
                    {activeTab === "Members" && (
                        <div className="flex justify-center w-full mt-4">
                            <div className="max-w-[900px] w-full border-inherit rounded-2xl shadow-2xl">
                                <CmMembers
                                    communityID={communityID}
                                    loggedInID={id}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "Files" && (
                        <div>
                            <div className="flex gap-4 ml-12 whitespace-nowrap">
                                <SearchInput
                                    onSearch={setFileSearchTerm}
                                    searchTerm={fileSearchTerm}
                                />
                                <SearchButton />
                            </div>
                            <FileTable
                                communityId={communityID}
                                searchTerm={fileSearchTerm}
                            />
                        </div>
                    )}

                    {activeTab === "Gallery" && (
                        <section>
                            <ImageProfile
                                selectedItem="All"
                                accessableType="Community"
                                accessableId={communityID}
                                filterBy="community"
                            />
                            <VideoProfile
                                selectedItem="All"
                                accessableType="Community"
                                accessableId={communityID}
                                filterBy="community"
                            />
                        </section>
                    )}

                    {activeTab === "Post" && (
                        <div className="flex flex-col max-w-[1000px] shadow-2xl pb-6 rounded-xl mt-6">
                            {/* TODO: if not a member -> don't show */}
                            <div className="max-w-[875px] w-full whitespace-nowrap absolute content-items pb-8">
                                {isMember && (
                                    <ShareYourThoughts
                                        userId={userId}
                                        onCreatePoll={handleCreatePoll}
                                        includeAccessibilities={true}
                                        communityId={communityID}
                                        filterType="Department"
                                        filterId={communityID}
                                    />
                                )}
                                <Filter
                                    onFilterChange={(filter) =>
                                        setFilterType(filter)
                                    }
                                />
                                <br />
                                <OutputData
                                    polls={polls}
                                    communityId={communityID}
                                    postType={filterType}
                                    variant="community"
                                />
                            </div>
                        </div>
                    )}
                    {/* Invite Popup */}
                    {isAddMemberPopupOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-2xl pt-7 px-4 py-4 w-[400px]">
                                <h1 className="flex justify-start mx-2 mb-4 text-2xl font-bold text-neutral-800">
                                    Add staff
                                </h1>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedUsers.map((user) => (
                                        <span
                                            key={user.id}
                                            className="flex items-center px-3 py-1 text-blue-700 bg-blue-100 rounded-full"
                                        >
                                            {user.name}
                                            <button
                                                className="ml-2 text-red-500"
                                                onClick={() =>
                                                    handleDeselectPerson(user)
                                                }
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search name"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    className="w-full px-4 py-2 mb-4 bg-gray-200 border border-gray-200 rounded-full"
                                />
                                <div className="overflow-y-auto max-h-[290px] pl-2 custom-scrollbar">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-64">
                                            <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        searchResults.map((person, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center p-2 cursor-pointer"
                                                onClick={() =>
                                                    handleSelectPerson(person)
                                                }
                                            >
                                                <img
                                                    src={getImageSource(
                                                        person.profile
                                                            ?.staff_image ||
                                                            defaultImage
                                                    )}
                                                    alt={person.name}
                                                    className="object-cover w-10 h-10 mr-4 rounded-full"
                                                />
                                                <div>
                                                    <div className="text-lg font-bold">
                                                        {person.name}
                                                    </div>
                                                    <div className="font-light text-gray-600">
                                                        {renderTitles(
                                                            person.employment_posts
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {errorMessage && (
                                    <div className="mt-2 text-red-500">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="flex justify-end mt-4">
                                    <button
                                        className="px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                        onClick={handleAddMembersToCommunity}
                                    >
                                        Add Members
                                    </button>
                                    <button
                                        className="px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700"
                                        onClick={() => {
                                            setIsAddMemberPopupOpen(false);
                                            setSelectedUsers([]);
                                            setSearchResults([]);
                                            setSearchTerm("");
                                            setErrorMessage("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </WallContext.Provider>
    );
}

function Adminsection({
    communityID,
    departmentHeader,
    departmentDescription,
    type,
    departmentBanner,
}) {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [departmentData, setDepartmentData] = useState(null);

    // Fetch the department data here
    const fetchDepartmentData = async () => {
        try {
            const response = await fetch(
                `/api/communities/communities/${communityID}`
            ); // Use departmentID

            if (!response.ok) {
                throw new Error("Failed to fetch department data");
            }

            const department = await response.json();

            setDepartmentData(department.data);
        } catch (error) {
            console.error("Error fetching department data:", error);
        }
    };

    useEffect(() => {
        fetchDepartmentData();
    }, [communityID]);

    // console.log("DEPARTMENT BANNER", departmentBanner);
    console.log("COMMUNITY ID", communityID);

    const handleEditClick = (isOpen) => {
        setIsEditPopupOpen(isOpen);
    };

    const handleSave = (updatedDepartment) => {
        setDepartmentData(updatedDepartment);
        setIsEditPopupOpen(false);
        // window.location.reload(true);
    };

    const handleCancel = () => {
        setIsEditPopupOpen(false);
    };

    useEffect(() => {
        // Fetch the latest department data if required
        fetchDepartmentData();
    }, [isEditPopupOpen]);

    if (!departmentData) {
        return null;
    }

    return (
        <div className="w-[875px]">
            <HeaderSection
                communityID={communityID}
                departmentHeader={departmentHeader}
                departmentBanner={departmentBanner} // Use departmentData.banner here
                departmentDescription={departmentDescription}
                onEditClick={handleEditClick}
            />
            <Navigation
                communityID={communityID}
                departmentName={departmentHeader}
                type={type}
            />
            {isEditPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <EditCommunity
                        department={departmentData}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </div>
            )}
        </div>
    );
}

export default function CommunityWall({
    communityID,
    departmentHeader,
    departmentDescription,
    departmentBanner,
    type,
}) {
    return (
        <div className="flex flex-wrap mx-auto my-20 text-black justify-left max-w-7xl gap-y-10">
            <Adminsection
                communityID={communityID}
                departmentHeader={departmentHeader}
                departmentDescription={departmentDescription}
                departmentBanner={departmentBanner}
                type={type}
            />
        </div>
    );
}
