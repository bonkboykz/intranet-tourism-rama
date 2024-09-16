import * as React from "react";
import { useEffect, useState } from "react";
import { useContext } from "react";

import {
    Filter,
    OutputData,
    ShareYourThoughts,
} from "@/Components/Reusable/WallPosting";
import { DepartmentContext } from "@/Pages/DepartmentContext";

import DepartmentMembers from "./DepartmentCom/DepartmentMembers";
import { FileTable } from "./FileManagement";
import { SearchButton, SearchInput, Table } from "./ProfileTabbar";
import { ImageProfile, VideoProfile } from "./ProfileTabbar/Gallery";
import EditDepartments from "./Reusable/Departments/EditDepartments"; // Import EditDepartments
import { WallContext } from "./Reusable/WallPosting/WallContext";

function HeaderSection({
    departmentID,
    departmentHeader,
    departmentBanner,
    departmentDescription,
    onEditClick,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [textContent, setTextContent] = useState("");

    useEffect(() => {
        setTextContent(departmentDescription);
    }, [departmentDescription]);

    const handleEditClick = () => {
        onEditClick(true); // Notify parent to open the edit popup
    };

    const handleInputChange = (e) => {
        const newDescription = e.target.value;
        setTextContent(newDescription);
    };

    const handleSaveClick = async () => {
        try {
            const updatedDescription = textContent;

            const response = await fetch(
                `/api/department/departments/${departmentID}`,
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

    console.log(departmentBanner);

    let banner = null;

    if (departmentBanner.startsWith("banner/")) {
        banner = `/storage/${departmentBanner}`;
    } else {
        banner = departmentBanner;
    }

    const { isAdmin } = useContext(DepartmentContext);

    return (
        <header className="flex overflow-hidden relative flex-col px-11 py-9 h-[291.67px] max-md:h-[calc(66vw)] text-white max-md:px-5 w-full rounded-t-xl max-md:-mt-12">
            <img
                loading="lazy"
                src={
                    banner ||
                    "https://cdn.builder.io/api/v1/image/assets/TEMP/bdd4e4b7e0f9ec45df838993c39761806ac75e1cc6917f44849c00849e5e2f19?apiKey=d66b6c2c936f4300b407b67b0a5e8c4d&"
                }
                className="absolute inset-0 object-cover size-full"
                alt=""
            />
            <div className="relative flex justify-between w-full gap-0 max-md:flex-wrap max-md:max-w-full py-2">
                <div className="flex flex-col">
                    <h1 className="text-3xl drop-shadow-lg text-start font-extrabold ">
                        {departmentHeader}
                    </h1>
                    {/* sini text ikut contrast */}
                    {/* <h1 className="text-3xl drop-shadow-lg font-extrabold text-white mix-blend-difference">{departmentHeader}</h1> */}
                </div>
                <div className="flex content-center self-start justify-between gap-5 text-sm font-medium"></div>
            </div>
            <div className="relative -mt-2 text-md font-medium max-md:max-w-full drop-shadow-lg">
                {isEditing ? (
                    <textarea
                        className="w-full h-32 p-2 text-white bg-inherit focus:outline-none focus:ring focus:ring-blue-500"
                        value={textContent}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p className="line-clamp-4 overflow-hidden text-ellipsis">
                        {textContent}
                    </p>
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

function Navigation({ userId, departmentID, departmentName }) {
    const [activeTab, setActiveTab] = useState("Post"); // Default active tab set to 'Post'
    const [polls, setPolls] = useState([]);
    const [birthdaysToday, setBirthdaysToday] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            let allUsers = [];
            let page = 1;
            let hasMoreData = true;

            while (hasMoreData) {
                try {
                    const response = await fetch(
                        `/api/users/users?page=${page}&with[]=profile&with[]=employmentPosts.department&with[]=employmentPosts.businessPost&with[]=employmentPosts.businessUnit`,
                        {
                            method: "GET",
                        }
                    );

                    const result = await response.json();
                    const { data } = result;

                    // console.log("RESULTT", result);

                    // Append the current page's users to the allUsers array
                    allUsers = [...allUsers, ...data.data];

                    // Check if there are more pages to fetch
                    hasMoreData = data.next_page_url !== null;
                    page++;
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    hasMoreData = false;
                }
            }

            // Get today's date in MM-DD format
            const today = new Date().toISOString().slice(5, 10);

            // Filter users whose birthday is today
            const bdayToday = allUsers.filter((user) => {
                const dob = user.profile?.dob;
                return dob && dob.slice(5, 10) === today;
            });

            console.log("Filtered Birthdays Today", bdayToday);

            // Set the filtered list to state
            setBirthdaysToday(bdayToday);
        };

        fetchAllUsers();
    }, []);

    const handleCreatePoll = (poll) => {
        setPolls((prevPolls) => [...prevPolls, poll]);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const { isMember } = useContext(DepartmentContext);

    console.log(isMember);

    const [searchTerm, setSearchTerm] = useState("");

    return (
        <WallContext.Provider
            value={{ variant: "department", loggedInUserId: userId }}
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
                </nav>

                <div className="relative">
                    {activeTab === "Members" && (
                        <div className="flex justify-center w-full mt-4">
                            <div className="max-w-[900px] w-full border-inherit rounded-2xl shadow-2xl">
                                <DepartmentMembers
                                    departmentID={departmentID}
                                    loggedInID={userId}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "Files" && (
                        <div>
                            <div className="flex gap-4 ml-12 whitespace-nowrap">
                                <SearchInput
                                    onSearch={setSearchTerm}
                                    searchTerm={searchTerm}
                                />
                                <SearchButton />
                            </div>
                            <FileTable
                                departmentId={departmentID}
                                searchTerm={searchTerm}
                            />
                        </div>
                    )}

                    {activeTab === "Gallery" && (
                        <section>
                            <ImageProfile
                                selectedItem="All"
                                accessableType="Department"
                                accessableId={departmentID}
                                filterBy="department"
                            />
                            <VideoProfile
                                selectedItem="All"
                                accessableType="Department"
                                accessableId={departmentID}
                                filterBy="department"
                            />
                        </section>
                    )}

                    {activeTab === "Post" && (
                        <div className="flex flex-col max-w-[1000px] shadow-2xl pb-6 rounded-xl mt-6">
                            <div className="max-w-[875px] w-full whitespace-nowrap absolute content-items pb-8">
                                {isMember && (
                                    <ShareYourThoughts
                                        userId={userId}
                                        onCreatePoll={handleCreatePoll}
                                        includeAccessibilities={true}
                                        filterType="Community"
                                        filterId={departmentID}
                                        birthdaysToday={
                                            birthdaysToday.length > 0
                                                ? birthdaysToday
                                                : null
                                        }
                                        departmentId={departmentID}
                                    />
                                )}
                                <Filter />
                                <br />
                                <OutputData
                                    polls={polls}
                                    departmentId={departmentID}
                                    departmentName={departmentName}
                                    variant="department"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </WallContext.Provider>
    );
}

function Adminsection({
    departmentID,
    departmentHeader,
    departmentDescription,
    userId,
    departmentBanner,
}) {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [departmentData, setDepartmentData] = useState(null);

    useEffect(() => {
        // Fetch the department data here
        const fetchDepartmentData = async () => {
            try {
                const response = await fetch(
                    `/api/department/departments/${departmentID}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch department data");
                }

                const department = await response.json();
                setDepartmentData(department.data);
            } catch (error) {
                console.error("Error fetching department data:", error);
            }
        };

        fetchDepartmentData();
    }, [departmentID]);

    console.log("DEPARTMENT BANNER", departmentBanner);

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
    }, [isEditPopupOpen]);

    return (
        <div className="w-[875px]">
            <HeaderSection
                departmentID={departmentID}
                departmentHeader={departmentHeader}
                departmentBanner={departmentBanner} // Use departmentData.banner here
                departmentDescription={departmentDescription}
                onEditClick={handleEditClick}
            />
            <Navigation
                departmentID={departmentID}
                userId={userId}
                departmentName={departmentHeader}
            />
            {isEditPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <EditDepartments
                        department={departmentData}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </div>
            )}
        </div>
    );
}

export default function Adminwall({
    departmentID,
    departmentHeader,
    departmentDescription,
    departmentBanner,
    userId,
}) {
    return (
        <WallContext.Provider
            value={{ variant: "department", loggedInUserId: userId }}
        >
            <div className="flex flex-wrap mx-auto my-20 text-black justify-left max-w-7xl gap-y-10">
                <Adminsection
                    departmentID={departmentID}
                    departmentHeader={departmentHeader}
                    departmentDescription={departmentDescription}
                    departmentBanner={departmentBanner}
                    userId={userId}
                />
            </div>
        </WallContext.Provider>
    );
}
