import React, { useContext, useEffect, useState } from "react";
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

function ProfileContent() {
    const csrfToken = useCsrf();
    const { props } = usePage();
    const { id, authToken } = props;
    const { onlineUsers } = useContext(OnlineUsersContext); // Access online users from context
    const [polls, setPolls] = useState([]);
    const [activeTab, setActiveTab] = useState("bio");
    const [isSaveNotificationOpen, setIsSaveNotificationOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingDepartments, setIsEditingDepartments] = useState([]); // Dynamic editing state array
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
        dateofbirth: "",
        whatsapp: "",
        photo: "",
        employmentPosts: [], // Initialize with an empty array
    });

    const [originalFormData, setOriginalFormData] = useState(formData);
    const [profileData, setProfileData] = useState({
        backgroundImage: "",
        profileImage: "",
        name: "",
        username: "",
        status: onlineUsers.some((onlineUser) => onlineUser.id === id)
            ? "Online"
            : "Offline", // Set initial status based on context
        icon1: "/assets/EditButton.svg",
        icon2: "https://cdn.builder.io/api/v1/image/assets/TEMP/c509bd2e6bfcd3ab7723a08c590219ec47ac648338970902ce5e506f7e419cb7?",
    });
    const [filterType, setFilterType] = useState(null);

    useEffect(() => {
        fetch(
            `/api/users/users/${id}?with[]=profile&with[]=employmentPosts.department&with[]=employmentPosts.businessPost&with[]=employmentPosts.businessUnit`,
            {
                method: "GET",
            }
        )
            .then((response) => response.json())
            .then(({ data }) => {
                console.log("User data:", data);

                setProfileData((pv) => ({
                    ...pv,
                    ...data,
                    backgroundImage:
                        data.profile && data.profile.cover_photo
                            ? `/storage/${data.profile.cover_photo}`
                            : "https://cdn.builder.io/api/v1/image/assets/TEMP/51aef219840e60eadf3805d1bd5616298ec00b2df42d036b6999b052ac398ab5?",
                    profileImage: data.profile?.image || "",
                }));

                const sortedEmploymentPosts =
                    data.employment_posts
                        ?.slice()
                        .sort((a, b) => a.id - b.id) ?? [];

                setFormData({
                    name: data.name,
                    username: data.username || "N/A",
                    email: data.email,
                    dateofbirth: data.profile?.dob || "",
                    phone: data.profile?.work_phone || "",
                    whatsapp: data.profile?.phone_no || "",
                    photo: data.profile?.staff_image,
                    employmentPosts: sortedEmploymentPosts,
                });

                setOriginalFormData({
                    name: data.name,
                    username: data.username || "N/A",
                    email: data.email,
                    dateofbirth: data.profile?.dob || "",
                    phone: data.profile?.work_phone || "",
                    whatsapp: data.profile?.phone_no || "",
                    photo: data.profile?.staff_image,
                    employmentPosts: sortedEmploymentPosts,
                });

                // Initialize isEditingDepartments array
                setIsEditingDepartments(sortedEmploymentPosts.map(() => false));
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, [id]);

    useEffect(() => {
        // Update status dynamically when onlineUsers change
        setProfileData((prevData) => ({
            ...prevData,
            status: onlineUsers.some((onlineUser) => onlineUser.id === id)
                ? "Online"
                : "Offline",
        }));
    }, [onlineUsers, id]);

    const openSaveNotification = () => {
        setIsSaveNotificationOpen(true);
    };

    const closeSaveNotification = () => {
        setIsSaveNotificationOpen(false);
        window.location.reload();
    };

    const handleFormDataChange = (newData, index) => {
        const updatedEmploymentPosts = [...formData.employmentPosts];
        updatedEmploymentPosts[index] = {
            ...updatedEmploymentPosts[index],
            ...newData,
        };

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
        userFormData.append("user_id", id);

        return fetch(`/api/users/users/${id}`, {
            method: "POST",
            body: userFormData,
            headers: {
                Accept: "application/json",
                "X-CSRF-TOKEN": csrfToken || "",
                Authorization: `Bearer ${authToken}`,
            },
        });
    };

    const handleSaveBio = async (newFormData) => {
        try {
            const FfData = new FormData();
            FfData.append("user_id", id);
            FfData.append("_method", "PUT");

            if (newFormData.email) FfData.append("email", newFormData.email);
            if (newFormData.dateofbirth)
                FfData.append("dob", newFormData.dateofbirth);
            // if (newFormData.whatsapp) FfData.append('phone_no', newFormData.whatsapp);

            if (newFormData.whatsapp) {
                FfData.append("phone_no", newFormData.whatsapp);
            } else {
                FfData.append("phone_no", "null");
            }

            if (newFormData.name) FfData.append("name", newFormData.name);

            if (newFormData.photo instanceof File) {
                FfData.append("photo", newFormData.photo);
            } else if (
                newFormData.photo &&
                newFormData.photo.startsWith("data:image")
            ) {
                const blob = await (await fetch(newFormData.photo)).blob();
                FfData.append("staff_image", blob, "profile_image.png");
            }

            const [profileResponse, userResponse] = await Promise.all([
                axios.post(
                    `/api/profile/profiles/${profileData.profile?.id}`,
                    FfData
                ),
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
            const employmentPost = formData.employmentPosts[index];

            if (!employmentPost || !employmentPost.id) {
                throw new Error(
                    `Employment post ID is not available for department ${
                        index + 1
                    }`
                );
            }

            const FfData = new FormData();
            FfData.append("_method", "PUT");
            FfData.append("department_id", employmentPost.department_id);
            FfData.append("business_unit_id", employmentPost.business_unit_id);
            FfData.append("business_post_id", employmentPost.business_post_id);
            FfData.append(
                "business_grade_id",
                employmentPost.business_grade_id
            );
            FfData.append("location", employmentPost.location);
            FfData.append("work_phone", employmentPost.work_phone);
            FfData.append("position", employmentPost.position);
            FfData.append("user_id", id);

            const response = await fetch(
                `/api/department/employment_posts/${employmentPost.id}`,
                {
                    method: "POST",
                    body: FfData,
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN": csrfToken || "",
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
            value={{ loggedInUserId: id, variant: "profile" }}
        >
            <Example>
            <main className="z-0 min-h-screen w-full bg-gray-100 flex-row flex justify-center items-start gap-20 md:gap-12">
                {/* left widgets */}
                <div className="z-0 pl-10 pt-10 pb-20 overflow-y-auto h-auto w-full max-w-[330px] max-h-[100vh] sticky top-0 hidden md:hidden lg:block no-scrollbar">
                    <div className="file-directory-header">
                        <PageTitle title="Your Profile" />
                    </div>
                    <hr className="file-directory-underline" />
                    <div>
                        <FeaturedEvents />
                        <WhosOnline />
                    </div>
                </div>

                {/* main content */}
                <div className="flex flex-col justify-center w-full max-w-[1200px] max-md:px-6 mr-10 max-md:ml-10 lg:ml-0 md:ml-10">
                        <div className="profile-header ml-9 h-[400px] max-md:h-[385px] bg-white shadow-custom rounded-b-lg">
                            <div className="flex-col w-full flex bg-white h-auto rounded-b-lg">
                                <ProfileHeader
                                    backgroundImage={
                                        profileData.backgroundImage
                                    }
                                    profileImage={profileData.profileImage}
                                    name={profileData.name}
                                    username={profileData.username}
                                    status={profileData.status}
                                    onEditBanner={() => setIsPopupOpen(true)}
                                    rounded={true}
                                    userId={id}
                                    profileId={profileData.profile?.id}
                                />
                                <ProfileNav
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                />
                            </div>
                            {activeTab === "activities" && (
                                <div className=" flex px-20 w-full justify-center lg:py-6 bg-gray-100 flex-col items-center ">
                                    <ShareYourThoughts
                                        userId={id}
                                        postType={"post"}
                                        onCreatePoll={handleCreatePoll}
                                    />
                                    {/* <Filter className="mr-10" /> */}
                                    <Filter
                                        className="mr-10"
                                        onFilterChange={handleFilterChange}
                                    />
                                    <div className="mb-20"></div>
                                    <OutputData
                                        polls={polls}
                                        showUserPosts={true}
                                        userId={id}
                                        postType={filterType}
                                    />
                                </div>
                            )}
                            {activeTab === "bio" && (
                                <>
                                    <section className="flex flex-col w-full gap-2 px-8 py-4 mt-6 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full">
                                        <div className="flex items-center justify-between">
                                            <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">
                                                Bio Information
                                            </div>
                                            <ProfileIcons
                                                icon1={profileData.icon1}
                                                icon2={profileData.icon2}
                                                user_id={profileData.id}
                                                user_name={profileData.name}
                                                user_title={employmentPostTitle}
                                                onEdit={() => handleEditBio()}
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
                                                    onEditBio={handleEditBio}
                                                    onCancelBio={
                                                        handleCancelBio
                                                    }
                                                    onSaveBio={handleSaveBio}
                                                    userId={id}
                                                />
                                            </div>
                                        </div>
                                    </section>
                                    <div className="separator"></div>
                                    {formData.employmentPosts &&
                                        formData.employmentPosts.length > 0 &&
                                        formData.employmentPosts.map(
                                            (employmentPost, index) => (
                                                // console.log("lllll", employmentPost),

                                                <section
                                                    key={index}
                                                    className="flex flex-col w-full gap-2 px-8 py-4 mt-3 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full"
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
                                                                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
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
                                        userId={id}
                                        filterBy="user"
                                    />
                                    <VideoProfile
                                        selectedItem="All"
                                        userId={id}
                                        filterBy="user"
                                    />
                                </section>
                            )}
                            {activeTab === "files" && (
                                <div>
                                    <div className="flex gap-4 whitespace-nowrap">
                                        <SearchInput
                                            onSearch={setFileSearchTerm}
                                            searchTerm={fileSearchTerm}
                                        />
                                        <SearchButton />
                                    </div>
                                    <FileTable
                                        userId={id}
                                        searchTerm={fileSearchTerm}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {isSaveNotificationOpen && (
                    <SaveNotification
                        title="Changes saved successfully"
                        onClose={closeSaveNotification}
                    />
                )}
                {isPopupOpen && (
                    <Popup
                        title="Edit Cover Photo"
                        onClose={() => setIsPopupOpen(false)}
                        onSave={handleSaveBio}
                        imgSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/51aef219840e60eadf3805d1bd5616298ec00b2df42d036b6999b052ac398ab5"
                        profileData={profileData}
                        id={id}
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

export default function Profile() {
    return (
        <OnlineUsersProvider>
            <ProfileContent />
        </OnlineUsersProvider>
    );
}
