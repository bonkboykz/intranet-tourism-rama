import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { usePage } from "@inertiajs/react";
import axios from "axios";

import { FileTable } from "@/Components/FileManagement";
import { Popup, ProfileHeader, ProfileNav } from "@/Components/Profile";
import {
    ProfileBio,
    ProfileIcons,
    SearchButton,
    SearchInput,
    Table,
} from "@/Components/ProfileTabbar";
import { ProfileDepartment } from "@/Components/ProfileTabbar";
import { ImageProfile, VideoProfile } from "@/Components/ProfileTabbar/Gallery";
import {
    Filter,
    OutputData,
    ShareYourThoughts,
} from "@/Components/Reusable/WallPosting";
import { WallContext } from "@/Components/Reusable/WallPosting/WallContext";
import { useCsrf } from "@/composables";
import Example from "@/Layouts/DashboardLayoutNew";
import { usePermissions } from "@/Utils/hooks/usePermissions";
import useUserData from "@/Utils/hooks/useUserData";

import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import { OnlineUsersContext, OnlineUsersProvider } from "./OnlineUsersContext"; // Import the context

import "./css/StaffDirectory.css";
import "../Components/Profile/profile.css";

function SaveNotification({ title, content, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-2xl">
                <section className="flex flex-col font-bold text-center bg-green-100 rounded-2xl shadow-custom py-4 px-8">
                    <div className="flex flex-col w-full">
                        <h2 className="text-xl text-green-800">{title}</h2>
                    </div>
                </section>
            </div>
        </div>
    );
}

function UserDetailContent() {
    const csrfToken = useCsrf();
    const { props } = usePage();
    const { user, selectedUserId, authToken } = props; // Ensure authToken is passed via Inertia
    const { onlineUsers } = useContext(OnlineUsersContext); // Access online users from context
    const [polls, setPolls] = useState([]);
    const [activeTab, setActiveTab] = useState("bio");
    const [isSaveNotificationOpen, setIsSaveNotificationOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        department: "",
        unit: "",
        jobtitle: "",
        position: "",
        grade: "",
        location: "",
        phone: "",
        dob: "",
        whatsapp: "",
        photo: "",
        employmentPosts: [], // Initialize with an empty array
    });
    const [originalFormData, setOriginalFormData] = useState(formData);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingDepartments, setIsEditingDepartments] = useState([
        false,
        false,
    ]);
    const [filterType, setFilterType] = useState(null);
    const [profileData, setProfileData] = useState({
        backgroundImage: "",
        profileImage: "",
        name: "", // Initialize with an empty string or placeholder
        username: "",
        status: onlineUsers.some((onlineUser) => onlineUser.id === user.id)
            ? "Online"
            : "Offline", // Set initial status based on context
        icon1: "/assets/EditButton.svg",
        icon2: "https://cdn.builder.io/api/v1/image/assets/TEMP/c509bd2e6bfcd3ab7723a08c590219ec47ac648338970902ce5e506f7e419cb7?",
        originalBackgroundImage: "",
    });
    const [userData, setUserData] = useState({});

    const { hasRole } = usePermissions();
    const loggedInUser = useUserData();
    const canEdit = loggedInUser.id === user.id || hasRole("superadmin");

    useEffect(() => {
        axios
            .get(`/api/users/users/${user.id}`, {
                params: {
                    with: ["profile"],
                },
            })
            .then(({ data: axiosData }) => {
                const data = axiosData.data;

                setProfileData((pv) => ({
                    ...pv,
                    ...data,
                    is_active: data.is_active,
                    icon1: canEdit ? pv.icon1 : "",
                    backgroundImage:
                        data.profile && data.profile.cover_photo
                            ? `/storage/${data.profile.cover_photo}`
                            : "https://cdn.builder.io/api/v1/image/assets/TEMP/51aef219840e60eadf3805d1bd5616298ec00b2df42d036b6999b052ac398ab5?",
                    profileImage: data.profile?.image || "",
                    originalBackgroundImage:
                        data.profile && data.profile.original_cover_photo
                            ? `/storage/${data.profile.original_cover_photo}`
                            : data.profile?.cover_photo ||
                              "https://cdn.builder.io/api/v1/image/assets/TEMP/51aef219840e60eadf3805d1bd5616298ec00b2df42d036b6999b052ac398ab5?",
                    // username: "@" + data.username,
                }));

                const sortedEmploymentPosts = data.employment_posts
                    .slice()
                    .sort((a, b) => a.id - b.id);

                setFormData({
                    name: data.name,
                    username: data.username || "N/A",
                    email: data.email,
                    dob: data.profile?.dob || "", // Use an empty string if no value
                    phone: data.profile?.work_phone || "", // Use an empty string if no value
                    whatsapp: data.profile?.phone_no || "", // Use an empty string if no value
                    photo:
                        data.profile?.staff_image || data.profile?.image || "",
                    employmentPosts: sortedEmploymentPosts,
                });

                setOriginalFormData({
                    name: data.name,
                    username: data.username || "N/A",
                    email: data.email,
                    dob: data.profile?.dob || "", // Ensure originalFormData is correctly set
                    phone: data.profile?.work_phone || "", // Ensure originalFormData is correctly set
                    whatsapp: data.profile?.phone_no || "", // Ensure originalFormData is correctly set
                    photo:
                        data.profile?.staff_image || data.profile?.image || "",
                    employmentPosts: sortedEmploymentPosts,
                });
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, [selectedUserId]);

    useEffect(() => {
        // Update status dynamically when onlineUsers change
        setProfileData((prevData) => ({
            ...prevData,
            status: onlineUsers.some((onlineUser) => onlineUser.id === user.id)
                ? "Online"
                : "Offline",
        }));
    }, [onlineUsers, user.id]);

    console.log("PDATA", profileData);

    const openSaveNotification = () => {
        toast.success("Changes saved successfully");
        setIsSaveNotificationOpen(true);
    };

    const closeSaveNotification = () => {
        // setIsSaveNotificationOpen(false);
        window.location.reload();
    };

    const handleSaveNotification = () => {
        closeSaveNotification();
    };

    const handleFormDataChange = (newData, index) => {
        // Clone the current form data
        const updatedEmploymentPosts = [...formData.employmentPosts];

        // Update the specific employment post by index
        updatedEmploymentPosts[index] = {
            ...updatedEmploymentPosts[index],
            ...newData,
        };

        // Update the form data state with the modified employment posts array
        setFormData((prevFormData) => ({
            ...prevFormData,
            employmentPosts: updatedEmploymentPosts,
            phone: newData.phone || prevFormData.phone,
        }));
    };

    const handlePhotoChange = (newPhoto) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            photo: newPhoto,
        }));
    };

    const updateUsername = async (newFormData) => {
        const userFormData = new FormData();
        userFormData.append("_method", "PUT");
        userFormData.append("name", newFormData.name);
        userFormData.append("user_id", user.id); // Add user_id to the form data

        return fetch(`/api/users/users/${user.id}`, {
            method: "POST",
            body: userFormData,
            headers: {
                Accept: "application/json",
                "X-CSRF-TOKEN": csrfToken || "", // Provide an empty string if csrfToken is null
                Authorization: `Bearer ${authToken}`,
            },
        });
    };

    const handleSaveBio = async (newFormData) => {
        try {
            const FfData = new FormData();

            // Compulsory fields
            FfData.append("user_id", user.id); // Add user_id to the form data
            FfData.append("_method", "PUT"); // Add _method to the form data

            // Conditional fields
            if (newFormData.email) {
                FfData.append("email", newFormData.email);
            }
            if (newFormData.dob) {
                FfData.append("dob", newFormData.dob);
            }
            if (newFormData.whatsapp) {
                FfData.append("phone_no", newFormData.whatsapp);
            }
            if (newFormData.name) {
                FfData.append("name", newFormData.name);
            }

            // Check if photo is a file or a URL
            if (newFormData.photo instanceof File) {
                FfData.append("photo", newFormData.photo);
            } else if (
                newFormData.photo &&
                newFormData.photo.startsWith("data:image")
            ) {
                // Convert base64 to file and append it to FormData
                const blob = await (await fetch(newFormData.photo)).blob();
                FfData.append("staff_image", blob, "profile_image.png");
            }

            const [profileResponse, userResponse] = await Promise.all([
                fetch(`/api/profile/profiles/${profileData.profile?.id}`, {
                    method: "POST",
                    body: FfData,
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN": csrfToken || "",
                        Authorization: `Bearer ${authToken}`,
                    },
                }),
                updateUsername(newFormData),
            ]);

            if (profileResponse.ok && userResponse.ok) {
                setOriginalFormData(newFormData);
                openSaveNotification();
                setTimeout(closeSaveNotification, 1200);
            } else {
                console.error(
                    "Error updating data:",
                    await profileResponse.json(),
                    await userResponse.json()
                );
            }
        } catch (error) {
            console.error("Error updating data:", error);
        }
        window.location.reload();
    };

    const handleSaveDepartment = async (index) => {
        try {
            // Get the employment post for the specified index
            const employmentPost = formData.employmentPosts[index]; // Get the employment_post object by index

            if (!employmentPost || !employmentPost.id) {
                throw new Error(
                    `Employment post ID is not available for department ${
                        index + 1
                    }`
                );
            }

            const FfData = new FormData();
            FfData.append("_method", "PUT"); // Add _method to the form data
            FfData.append("department_id", employmentPost.department_id);
            FfData.append("business_unit_id", employmentPost.business_unit_id);
            FfData.append("business_post_id", employmentPost.business_post_id);
            FfData.append(
                "business_grade_id",
                employmentPost.business_grade_id
            );
            FfData.append("is_hod", employmentPost.is_hod ? 1 : 0);
            FfData.append(
                "is_assistance",
                employmentPost.is_assistance ? 1 : 0
            );
            if (employmentPost.report_to) {
                FfData.append("report_to", employmentPost.report_to);
            }
            FfData.append("location", employmentPost.location);
            FfData.append("work_phone", employmentPost.work_phone);
            FfData.append("position", employmentPost.position);
            FfData.append("user_id", user.id); // Add user_id to the form data

            const response = await fetch(
                `/api/department/employment_posts/${employmentPost.id}`,
                {
                    method: "POST",
                    body: FfData,
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN": csrfToken || "", // Provide an empty string if csrfToken is null
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            setOriginalFormData(formData);
            setIsEditingDepartments((prev) =>
                prev.map((isEditing, i) => (i === index ? false : isEditing))
            );
            openSaveNotification();
            setTimeout(closeSaveNotification, 1200);
        } catch (error) {
            console.error(
                `Error updating Department ${index + 1} Information:`,
                error
            );
        }
        window.location.reload();
    };

    const handleCancelBio = () => {
        setFormData(originalFormData);
        setIsEditingBio(false);
    };

    const handleCancelDepartment = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            employmentPosts: prevFormData.employmentPosts.map((post, i) =>
                i === index
                    ? {
                          ...post,
                          department:
                              originalFormData.employmentPosts[index]
                                  .department || "N/A",
                          unit:
                              originalFormData.employmentPosts[index].unit ||
                              "N/A",
                          jobtitle:
                              originalFormData.employmentPosts[index]
                                  .jobtitle || "N/A",
                          position:
                              originalFormData.employmentPosts[index]
                                  .position || "N/A",
                          grade:
                              originalFormData.employmentPosts[index].grade ||
                              "N/A",
                          location:
                              originalFormData.employmentPosts[index]
                                  .location || "N/A",
                          phone:
                              originalFormData.employmentPosts[index].phone ||
                              "N/A",
                      }
                    : post
            ),
        }));
        setIsEditingDepartments((prev) =>
            prev.map((isEditing, i) => (i === index ? false : isEditing))
        );
    };

    const handleEditBio = () => {
        setIsEditingBio(true);
    };

    const handleEditDepartment = (index) => {
        setIsEditingDepartments((prev) =>
            prev.map((isEditing, i) => (i === index ? true : isEditing))
        );
    };

    const handleCreatePoll = (pollData) => {
        // Implement the logic to handle poll creation here.
        console.log("Poll data:", pollData);
        // You can use an API call to save the poll data, update the state, etc.
    };

    // Sort employmentPosts by id in ascending order (oldest id first)
    const sortedEmploymentPosts = formData.employmentPosts
        .slice()
        .sort((a, b) => a.id - b.id);

    // Attribute to tag guest profile
    const tag = "guest";

    const employmentPostTitle =
        profileData.employment_posts?.length > 0
            ? profileData.employment_posts[0].business_post.title
            : "";

    const handleFilterChange = (filter) => {
        setFilterType(filter);
    };

    const [fileSearchTerm, setFileSearchTerm] = useState("");

    return (
        <WallContext.Provider
            value={{ loggedInUserId: loggedInUser.id, variant: "user-wall" }}
        >
            <Example>
                <main className="z-0 min-h-screen w-full bg-gray-100 flex-row flex justify-center items-start gap-20 md:gap-12">
                    {/* left widgets */}
                    <div className="z-0 pl-10 pt-10 pb-20 overflow-y-auto h-auto w-full max-w-[330px] max-h-[100vh] sticky top-0 hidden md:hidden lg:block no-scrollbar">
                        <div className="file-directory-header">
                            <PageTitle title="User Profile" />
                        </div>
                        <hr className="file-directory-underline" />
                        <div>
                            <FeaturedEvents />
                            <WhosOnline />
                        </div>
                    </div>

                    {/* main content */}
                    <div className="flex flex-col justify-center w-full max-w-[1200px] max-sm:px-4 max-md:px-6 gap-6 items-center box-border max-sm:max-w-[100vw]">
                        <div className="profile-header my-0 mx-auto">
                            <div className="flex-col w-full flex bg-white h-auto">
                                <ProfileHeader
                                    backgroundImage={
                                        profileData.backgroundImage
                                    }
                                    profileImage={profileData.profileImage}
                                    name={profileData.name}
                                    username={profileData.username}
                                    status={profileData.status}
                                    onEditBanner={() => {
                                        if (!canEdit) return;

                                        setIsPopupOpen(true);
                                    }}
                                    rounded={true}
                                    userId={user.id}
                                    profileId={profileData.profile?.id}
                                    tag={tag}
                                />
                                <ProfileNav
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                />
                            </div>

                            <div className="flex-col w-full flex bg-none h-auto rounded-b-lg max-w-[875px]">
                                {activeTab === "activities" && (
                                    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 flex flex-col items-center ">
                                        {/* <ShareYourThoughts userId={user.id} postType={'post'} onCreatePoll={handleCreatePoll} /> */}
                                        <Filter
                                            className="mr-10"
                                            onFilterChange={handleFilterChange}
                                        />
                                        <div className="mb-20"></div>
                                        <OutputData
                                            polls={polls}
                                            showUserPosts={true}
                                            userId={user.id}
                                            postType={filterType}
                                        />
                                    </div>
                                )}
                                {activeTab === "bio" && (
                                    <>
                                        <section className="flex flex-col w-full gap-2 px-8 py-4 my-6 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full">
                                            <div className="flex items-center justify-between">
                                                <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">
                                                    Bio Information
                                                </div>
                                                <ProfileIcons
                                                    icon1={profileData.icon1}
                                                    icon2={profileData.icon2}
                                                    user_id={profileData.id}
                                                    user_name={profileData.name}
                                                    user_title={
                                                        employmentPostTitle
                                                    }
                                                    onEdit={() =>
                                                        handleEditBio()
                                                    }
                                                    isFirstIcon
                                                />
                                            </div>
                                            <div className="flex-auto my-auto max-md:max-w-full">
                                                <div className="flex gap-5 flex-col md:flex-row max-md:gap-0">
                                                    <ProfileBio
                                                        formData={formData}
                                                        isEditing={isEditingBio}
                                                        onFormDataChange={
                                                            setFormData
                                                        }
                                                        onPhotoChange={
                                                            handlePhotoChange
                                                        }
                                                        originalFormData={
                                                            originalFormData
                                                        }
                                                        onEditBio={
                                                            handleEditBio
                                                        }
                                                        onCancelBio={
                                                            handleCancelBio
                                                        }
                                                        onSaveBio={
                                                            handleSaveBio
                                                        }
                                                        userId={user.id} // Pass userId as a prop
                                                    />
                                                </div>
                                            </div>
                                        </section>
                                        <div className="separator"></div>
                                        {formData.employmentPosts &&
                                            formData.employmentPosts.length >
                                                0 &&
                                            formData.employmentPosts.map(
                                                (employmentPost, index) => (
                                                    <section
                                                        key={index}
                                                        className="flex flex-col w-full gap-2 px-8 py-4 mb-6 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">{`Department ${
                                                                index + 1
                                                            } Information`}</div>
                                                            <ProfileIcons
                                                                icon1={
                                                                    profileData.icon1
                                                                }
                                                                onEdit={() =>
                                                                    handleEditDepartment(
                                                                        index
                                                                    )
                                                                }
                                                                isFirstIcon
                                                            />
                                                        </div>

                                                        <div className="flex ml-4 flex-row space-x-36 mt-4 my-auto max-md:max-w-full md:flex-row max-md:gap-0">
                                                            <div className="text-base font-medium">
                                                                Status
                                                            </div>
                                                            <div
                                                                className={`status-badge ${
                                                                    profileData.is_active
                                                                        ? "bg-red-500"
                                                                        : "bg-green-500"
                                                                } text-white text-xs px-3 py-2   rounded-full`}
                                                            >
                                                                {profileData.is_active
                                                                    ? "Deactivated"
                                                                    : "Activated"}
                                                            </div>
                                                        </div>
                                                        <div className="flex-auto my-auto max-md:max-w-full">
                                                            <div className="flex gap-5 flex-col md:flex-row max-md:gap-0">
                                                                <ProfileDepartment
                                                                    department={
                                                                        employmentPost
                                                                            .department
                                                                            ?.name ||
                                                                        ""
                                                                    }
                                                                    departmentId={
                                                                        employmentPost.department_id
                                                                    }
                                                                    unit={
                                                                        employmentPost
                                                                            .business_unit
                                                                            ?.name ||
                                                                        ""
                                                                    }
                                                                    jobtitle={
                                                                        employmentPost
                                                                            .business_post
                                                                            ?.title ||
                                                                        ""
                                                                    }
                                                                    position={
                                                                        employmentPost.position ||
                                                                        "N/A"
                                                                    }
                                                                    grade={
                                                                        employmentPost
                                                                            .business_grade
                                                                            ?.code ||
                                                                        ""
                                                                    }
                                                                    is_hod={
                                                                        employmentPost.is_hod
                                                                    }
                                                                    is_assistance={
                                                                        employmentPost.is_assistance
                                                                    }
                                                                    report_to={
                                                                        employmentPost
                                                                            .supervisor
                                                                            ?.parent
                                                                            ?.user
                                                                            ?.name ||
                                                                        "N/A"
                                                                    }
                                                                    location={
                                                                        employmentPost.location ||
                                                                        "N/A"
                                                                    }
                                                                    phone={
                                                                        employmentPost.work_phone ||
                                                                        "N/A"
                                                                    }
                                                                    isEditing={
                                                                        isEditingDepartments[
                                                                            index
                                                                        ]
                                                                    }
                                                                    onFormDataChange={(
                                                                        newData
                                                                    ) =>
                                                                        handleFormDataChange(
                                                                            newData,
                                                                            index
                                                                        )
                                                                    }
                                                                    originalFormData={
                                                                        originalFormData
                                                                    }
                                                                />
                                                            </div>
                                                            {isEditingDepartments[
                                                                index
                                                            ] && (
                                                                <div className="flex justify-end mt-4 pb-3">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleCancelDepartment(
                                                                                index
                                                                            )
                                                                        }
                                                                        className="bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleSaveDepartment(
                                                                                index
                                                                            )
                                                                        }
                                                                        className="ml-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </section>
                                                )
                                            )}
                                    </>
                                )}

                                {activeTab === "gallery" && (
                                    <section>
                                        <ImageProfile
                                            selectedItem="All"
                                            userId={user.id}
                                            filterBy="user"
                                        />
                                        <VideoProfile
                                            selectedItem="All"
                                            userId={user.id}
                                            filterBy="user"
                                        />
                                    </section>
                                )}
                                {activeTab === "files" && (
                                    <div className="max-w-full">
                                        <div className="flex gap-4 whitespace-nowrap">
                                            <SearchInput
                                                onSearch={setFileSearchTerm}
                                                searchTerm={fileSearchTerm}
                                            />
                                            <SearchButton />
                                        </div>
                                        <FileTable
                                            userId={user.id}
                                            searchTerm={fileSearchTerm}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                {/* {isSaveNotificationOpen && (
                    <SaveNotification
                        title="Changes saved successfully"
                        onClose={closeSaveNotification}
                    />
                )} */}
                {isPopupOpen && (
                    <Popup
                        title="Edit Banner Photo"
                        onClose={() => setIsPopupOpen(false)}
                        onSave={handleSaveBio}
                        profileData={profileData}
                        id={user.id}
                        formData={formData}
                        csrfToken={csrfToken}
                        authToken={authToken}
                        setFormData={setFormData}
                    />
                )}
            </Example>
        </WallContext.Provider>
    );
}

export default function UserDetail() {
    return (
        <OnlineUsersProvider>
            <UserDetailContent />
        </OnlineUsersProvider>
    );
}
