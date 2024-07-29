// import React, { useState, useEffect } from 'react';
// import { usePage } from '@inertiajs/react';
// import PageTitle from '../Components/Reusable/PageTitle';
// import FeaturedEvents from '../Components/Reusable/FeaturedEventsWidget/FeaturedEvents';
// import WhosOnline from '../Components/Reusable/WhosOnlineWidget/WhosOnline';
// import './css/StaffDirectory.css';
// import { ProfileHeader, ProfileNav, Popup } from "@/Components/Profile";
// import { ProfileBio, ProfileIcons, SearchInput, SearchButton, Table } from "@/Components/ProfileTabbar";
// import Example from '@/Layouts/DashboardLayoutNew';
// import { ImageProfile, VideoProfile } from '@/Components/ProfileTabbar/Gallery';
// import { ShareYourThoughts, Filter, OutputData } from '@/Components/Reusable/WallPosting';
// import '../Components/Profile/profile.css';
// import { useCsrf } from '@/composables';

// function SaveNotification({ title, content, onClose }) {
//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//             <div className="p-2 rounded-3xl w-4xl">
//                 <section className="flex flex-col px-2.5 pt-16 font-bold text-center bg-white rounded-xl shadow-custom w-[380px] h-[165px]">
//                     <div className="flex flex-col w-full">
//                         <h2 className="text-xl text-neutral-800">{title}</h2>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }

// export default function Profile() {
//     const csrfToken = useCsrf();
//     const { props } = usePage();
//     const { id, authToken } = props; // Ensure authToken is passed via Inertia
//     const [polls, setPolls] = useState([]);
//     const [activeTab, setActiveTab] = useState("bio");
//     const [isSaveNotificationOpen, setIsSaveNotificationOpen] = useState(false);
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [photo, setPhoto] = useState("https://cdn.builder.io/api/v1/image/assets/TEMP/e2529a8d6493a4752f7510057ac1d7c1f0535b2b08af30702ea115fd3e80f513?apiKey=285d536833cc4168a8fbec258311d77b&");
//     const [formData, setFormData] = useState({
//         name: "",
//         username: "",
//         email: "",
//         department: "",
//         unit: "",
//         jobtitle: "",
//         position: "",
//         grade: "",
//         location: "",
//         phone: "",
//         dateofbirth: "",
//         whatsapp: "",
//     });
//     const [originalFormData, setOriginalFormData] = useState(formData);
//     const [originalPhoto, setOriginalPhoto] = useState(photo);
//     const [isEditing, setIsEditing] = useState(false);
//     const [profileData, setProfileData] = useState({
//         backgroundImage: "",
//         profileImage: "",
//         name: "", // Initialize with empty string or placeholder
//         username: "",
//         status: "Online",
//         icon1: "/assets/EditButton.svg",
//         icon2: "https://cdn.builder.io/api/v1/image/assets/TEMP/c509bd2e6bfcd3ab7723a08c590219ec47ac648338970902ce5e506f7e419cb7?",
//     });
//     const [userData, setUserData] = useState({});

//     useEffect(() => {
//         console.log("Fetching user data...");
//         fetch(`/api/crud/users/${id}?with[]=profile&with[]=employmentPost.department&with[]=employmentPost.businessPost&with[]=employmentPost.businessUnit`, {
//             method: "GET",
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Network response was not ok");
//                 }
//                 return response.json();
//             })
//             .then(({ data }) => {
//                 console.log('hello', data);
//                 setProfileData(pv => ({
//                     ...pv, ...data,
//                     backgroundImage: data.profile && data.profile.cover_photo ? `/storage/${data.profile.cover_photo}` : 'https://cdn.builder.io/api/v1/image/assets/TEMP/51aef219840e60eadf3805d1bd5616298ec00b2df42d036b6999b052ac398ab5?',
//                     profileImage: data.profile && data.profile.image ? data.profile.image : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${data.name}`,
//                     username: "@" + data.username,
//                 }));

//                 setFormData((pv) => ({
//                     ...pv,
//                     name: data.name,
//                     username: data.username || "N/A",
//                     email: data.email,
//                     department: data.employment_post?.department?.name || "N/A",
//                     unit: data.employment_post?.business_unit?.name || "N/A",
//                     jobtitle: data.employment_post?.title || "N/A",
//                     position: data.employment_post?.business_post?.title || "N/A",
//                     grade: data.employment_post?.schema_grade || "N/A",
//                     location: data.employment_post?.location || "N/A",
//                     dateofbirth: data.profile?.dob || "N/A",
//                     phone: data.profile?.work_phone || "N/A",
//                     whatsapp: data.profile?.phone_no || "N/A",
//                 }));

//                 setOriginalFormData(data); // Set original form data
//                 setOriginalPhoto(data.profile && data.profile.image ? data.profile.image : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${data.name}`); // Set original photo
//             })
//             .catch((error) => {
//                 console.error("Error fetching user data:", error);
//             });
//     }, [id]);

//     const openSaveNotification = () => {
//         setIsSaveNotificationOpen(true);
//     };

//     const closeSaveNotification = () => {
//         setIsSaveNotificationOpen(false);
//         window.location.reload();
//     };

//     const handleSaveNotification = () => {
//         closeSaveNotification();
//     };

//     const handleFormDataChange = (newData) => {
//         setFormData(newData);
//     };

//     const handlePhotoChange = (newPhoto) => {
//         setPhoto(newPhoto);
//     };

//     const handleSave = () => {
//         setOriginalFormData(formData);
//         setOriginalPhoto(photo);
//         setIsEditing(false);
//         openSaveNotification();
//         setTimeout(closeSaveNotification, 1200);
//     };

//     const handleCancel = () => {
//         // setFormData(originalFormData);
//         // setPhoto(originalPhoto);
//         setIsEditing(false);
//     };

//     const handleEdit = () => {
//         setIsEditing(true);
//     };

//     const handleSelectFile = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const formData = new FormData();
//             formData.append('cover_photo', file);
//             formData.append('user_id', id); // Add user_id to the form data
//             formData.append('_method', 'PUT'); // Add _method to the form data
    
//             const url = `/api/profile/profiles/${profileData.profile?.id}`;
    
//             console.log("CSRF Token:", csrfToken);
//             console.log("Auth Token:", authToken);
    
//             try {
//                 console.log('Uploading profile photo with payload:', {
//                     cover_photo: file,
//                     user_id: id,
//                 });
    
//                 fetch(url, {
//                     method: 'POST',
//                     body: formData,
//                     headers: {
//                         'Accept': 'application/json',
//                         'X-CSRF-TOKEN': csrfToken || '', // Provide an empty string if csrfToken is null
//                         'Authorization': `Bearer ${authToken}`,
//                     },
//                 })
//                 .then(async response => {
//                     if (!response.ok) {
//                         const error = await response.json();
//                         return await Promise.reject(error);
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     if (data.success) {
//                         setPhoto(URL.createObjectURL(file));
//                         setIsPopupOpen(false);
//                         console.log('File uploaded successfully:', data);
//                     } else {
//                         console.error('Error uploading file:', data);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error uploading file:', error);
//                 });
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         }
//     };

//     const departments = [
//         { name: "Department 1", unit: formData.unit, jobtitle: formData.jobtitle, position: formData.position, location: formData.location, phone: formData.phone },
//         { name: "Department 2", unit: formData.unit, jobtitle: formData.jobtitle, position: formData.position, location: formData.location, phone: formData.phone },
//     ];

//     return (
//         <Example>
//             <main className="xl:pl-96 w-full">
//                 <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
//                     <div>
//                         <div className="w-full bg-white h-[485px] shadow-custom rounded-lg">
//                             <ProfileHeader
//                                 backgroundImage={profileData.backgroundImage}
//                                 profileImage={profileData.profileImage ?? 'https://cdn.builder.io/api/v1/image/assets/TEMP/19dbe4d9d7098d561e725a31b63856fbbf81097ff193f1e5b04be40ccd3fe081?'}
//                                 name={profileData.name}
//                                 username={profileData.username}
//                                 status={profileData.status}
//                                 onEditBanner={() => setIsPopupOpen(true)}
//                                 rounded={true}
//                                 userId={id}
//                                 profileId={profileData.profile?.id}
//                             />
//                             <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />
//                             {activeTab === "activities" && (
//                                 <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 flex flex-col items-center ">
//                                     <ShareYourThoughts userId={id} postType={'post'} onCreatePoll={handleCreatePoll} />
//                                     <Filter className="mr-10" />
//                                     <div className="mb-20"></div>
//                                     <OutputData polls={polls} showUserPosts={true} userId={id} />
//                                 </div>
//                             )}
//                             {activeTab === "bio" && (
//                                 <>
//                                 <section className="flex flex-col w-full gap-2 px-8 py-4 mt-6 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full">
//                                     <div className="flex items-center justify-between">
//                                         <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">Bio Information</div>
//                                         <ProfileIcons
//                                             icon1={profileData.icon1}
//                                             onEdit={handleEdit}
//                                             isFirstIcon
//                                         />
//                                     </div>
//                                     <div className="flex-auto my-auto max-md:max-w-full">
//                                         <div className="flex gap-5 flex-col md:flex-row max-md:gap-0">
//                                             <ProfileBio
//                                                 name={formData.name}
//                                                 photo={profileData.profileImage}
//                                                 username={formData.username}
//                                                 email={formData.email}
//                                                 grade={formData.grade}
//                                                 dateofbirth={formData.dateofbirth}
//                                                 whatsapp={formData.whatsapp}
//                                                 icon2={profileData.icon2}
//                                                 isEditing={isEditing}
//                                                 onFormDataChange={handleFormDataChange}
//                                                 onPhotoChange={handlePhotoChange}
//                                             />
//                                         </div>
//                                         <div className="flex justify-end">
//                                             <ProfileIcons
//                                                 icon2={profileData.icon2}
//                                                 onEdit={handleEdit}
//                                                 isFirstIcon
//                                             />
//                                         </div>
//                                         {isEditing && (
//                                             <div className="flex justify-end mt-4 pb-3">
//                                                 <button onClick={handleCancel} className="bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full">Cancel</button>
//                                                 <button onClick={handleSave} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">Save</button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </section>
//                                     <div className="separator"></div>
//                                     {departments.map((dept, index) => (
//                                         <section key={index} className="flex flex-col w-full gap-2 px-8 py-4 mt-3 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full">
//                                             <div className="flex items-center justify-between">
//                                         <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">{dept.name}</div>
//                                         <ProfileIcons
//                                             icon1={profileData.icon1}
//                                             onEdit={handleEdit}
//                                             isFirstIcon
//                                         />
//                                         </div>
//                                         <div className="flex-auto my-auto max-md:max-w-full">
//                                             <div className="flex gap-5 flex-col md:flex-row max-md:gap-0">
//                                                 <ProfileBio
//                                                     department={dept.name}
//                                                     unit={dept.unit}
//                                                     jobtitle={dept.jobtitle}
//                                                     position={dept.position}
//                                                     location={dept.location}
//                                                     phone={dept.phone}
//                                                     isEditing={isEditing}
//                                                     onFormDataChange={handleFormDataChange}
//                                                 />
//                                             </div>
//                                             {isEditing && (
//                                                 <div className="flex justify-end mt-4">
//                                                     <button onClick={handleCancel} className=" bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full">Cancel</button>
//                                                     <button onClick={handleSave} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">Save</button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </section>
//                                     ))}
//                                 </>
//                             )}
//                             {activeTab === "gallery" && (
//                                 <section>
//                                     <ImageProfile selectedItem="All" userId={id} />
//                                     <VideoProfile selectedItem="All" userId={id} />
//                                 </section>
//                             )}
//                             {activeTab === "files" && (
//                                 <div>
//                                     <div className="flex gap-4 whitespace-nowrap">
//                                         <SearchInput />
//                                         <SearchButton />
//                                     </div>
//                                     <Table userId={id} />
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </main>
//             <aside className="fixed bottom-0 left-20 top-16 hidden w-1/4 max-w-sm overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 xl:block">
//                 <style>
//                 {`
//                     aside::-webkit-scrollbar {
//                         width: 0px !important;
//                         background: transparent !important;
//                     }
//                     aside {
//                         scrollbar-width: none !important; /* For Firefox */
//                         -ms-overflow-style: none;  /* IE and Edge */
//                     }
//                 `}
//                 </style>
//                 <div className="file-directory-header">
//                     <PageTitle title="My Profile" />
//                 </div>
//                 <hr className="file-directory-underline" />
//                 <div>
//                     <FeaturedEvents />
//                     <WhosOnline />
//                 </div>
//             </aside>
//             {isSaveNotificationOpen && (
//                 <SaveNotification title="Changes saved successfully" onClose={closeSaveNotification} />
//             )}
//             {isPopupOpen && (
//                 <Popup 
//                     title="Edit Banner Photo" 
//                     onClose={() => setIsPopupOpen(false)} 
//                     onSave={handleSave}
//                     onSelectFile={handleSelectFile}
//                 />
//             )}
//         </Example>
//     );
// }

// import React, { useState, useEffect } from 'react';
// import { usePage } from '@inertiajs/react';
// import PageTitle from '../Components/Reusable/PageTitle';
// import FeaturedEvents from '../Components/Reusable/FeaturedEventsWidget/FeaturedEvents';
// import WhosOnline from '../Components/Reusable/WhosOnlineWidget/WhosOnline';
// import './css/StaffDirectory.css';
// import { ProfileHeader, ProfileNav, Popup } from "@/Components/Profile";
// import { ProfileBio, ProfileIcons, SearchInput, SearchButton, Table } from "@/Components/ProfileTabbar";
// import Example from '@/Layouts/DashboardLayoutNew';
// import { ImageProfile, VideoProfile } from '@/Components/ProfileTabbar/Gallery';
// import { ShareYourThoughts, Filter, OutputData } from '@/Components/Reusable/WallPosting';
// import '../Components/Profile/profile.css';
// import { useCsrf } from '@/composables';

// function SaveNotification({ title, onClose }) {
//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//             <div className="p-2 rounded-3xl w-4xl">
//                 <section className="flex flex-col px-2.5 pt-16 font-bold text-center bg-white rounded-xl shadow-custom w-[380px] h-[165px]">
//                     <div className="flex flex-col w-full">
//                         <h2 className="text-xl text-neutral-800">{title}</h2>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }

// export default function Profile() {
//     const csrfToken = useCsrf();
//     const { props } = usePage();
//     const { id, authToken, user_id } = props;
//     const [polls, setPolls] = useState([]);
//     const [activeTab, setActiveTab] = useState("bio");
//     const [isSaveNotificationOpen, setIsSaveNotificationOpen] = useState(false);
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [photo, setPhoto] = useState("https://cdn.builder.io/api/v1/image/assets/TEMP/e2529a8d6493a4752f7510057ac1d7c1f0535b2b08af30702ea115fd3e80f513?apiKey=285d536833cc4168a8fbec258311d77b&");
//     const [formData, setFormData] = useState({
//         name: "",
//         username: "",
//         email: "",
//         department: "",
//         unit: "",
//         jobtitle: "",
//         position: "",
//         grade: "",
//         location: "",
//         phone: "",
//         dateofbirth: "",
//         whatsapp: "",
//     });
//     const [originalFormData, setOriginalFormData] = useState(formData);
//     const [originalPhoto, setOriginalPhoto] = useState(photo);
//     const [isEditing, setIsEditing] = useState(false);
//     const [profileData, setProfileData] = useState({
//         backgroundImage: "",
//         profileImage: "",
//         name: "", 
//         username: "",
//         status: "Online",
//         icon1: "/assets/EditButton.svg",
//         icon2: "https://cdn.builder.io/api/v1/image/assets/TEMP/c509bd2e6bfcd3ab7723a08c590219ec47ac648338970902ce5e506f7e419cb7?",
//     });
//     const [userData, setUserData] = useState({});

//     useEffect(() => {
//         fetchUserData();
//     }, [id]);

//     const fetchUserData = async () => {
//         try {
//             const response = await fetch(`/api/users/users/${id}?with[]=profile&with[]=employmentPost.department&with[]=employmentPost.businessPost&with[]=employmentPost.businessUnit`, {
//                 method: "GET",
//             });
//             if (!response.ok) throw new Error("Network response was not ok");
//             const { data } = await response.json();

//             setProfileData(pv => ({
//                 ...pv, ...data,
//                 backgroundImage: data.profile && data.profile.cover_photo ? `/storage/${data.profile.cover_photo}` : 'https://cdn.builder.io/api/v1/image/assets/TEMP/51aef219840e60eadf3805d1bd5616298ec00b2df42d036b6999b052ac398ab5?',
//                 profileImage: data.profile && data.profile.image ? data.profile.image : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${data.name}`,
//                 username: "@" + data.username,
//             }));

//             const updatedFormData = {
//                 name: data.name,
//                 username: data.username || "N/A",
//                 email: data.email,
//                 department: data.employment_post?.department?.name || "N/A",
//                 unit: data.employment_post?.business_unit?.name || "N/A",
//                 jobtitle: data.employment_post?.title || "N/A",
//                 position: data.employment_post?.business_post?.title || "N/A",
//                 grade: data.employment_post?.schema_grade || "N/A",
//                 location: data.employment_post?.location || "N/A",
//                 dateofbirth: data.profile?.dob || "N/A",
//                 phone: data.profile?.work_phone || "N/A",
//                 whatsapp: data.profile?.phone_no || "N/A",
//             };

//             setFormData(updatedFormData);
//             setOriginalFormData(updatedFormData);
//             setOriginalPhoto(data.profile && data.profile.image ? data.profile.image : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${data.name}`);
//         } catch (error) {
//             console.error("Error fetching user data:", error);
//         }
//     };

//     const openSaveNotification = () => {
//         setIsSaveNotificationOpen(true);
//     };

//     const closeSaveNotification = () => {
//         setIsSaveNotificationOpen(false);
//         // window.location.reload();
//     };

//     const handleSaveNotification = () => {
//         closeSaveNotification();
//     };

//     const handleFormDataChange = (newData) => {
//         setFormData(newData);
//     };

//     const handlePhotoChange = (newPhoto) => {
//         setPhoto(newPhoto);
//     };

//     const handleSave = async () => {
//         const payload = {
//             ...formData,
//             image: photo,
//             user_id: id
//         };
    
//         console.log("Payload being sent to the server:", payload);
    
//         try {
//             const response = await fetch(`/api/users/users/${id}?with[]=profile&with[]=employmentPost.department&with[]=employmentPost.businessPost&with[]=employmentPost.businessUnit`, {
//                 method: "PUT",
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRF-TOKEN': csrfToken,
//                     'Authorization': `Bearer ${authToken}`,
//                 },
//                 body: JSON.stringify(payload)
//             });
//             if (!response.ok) throw new Error("Network response was not ok");
//             setOriginalFormData(formData);
//             setOriginalPhoto(photo);
//             setIsEditing(false);
//             openSaveNotification();
//             setTimeout(closeSaveNotification, 1200);
//         } catch (error) {
//             console.error("Error saving user data:", error);
//         }
//     };
    

//     const handleCancel = () => {
//         setFormData(originalFormData);
//         setPhoto(originalPhoto);
//         setIsEditing(false);
//     };

//     const handleEdit = () => {
//         setIsEditing(true);
//     };

//     const handleSelectFile = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const fileUrl = URL.createObjectURL(file);
//             setPhoto(fileUrl);
//             setSelectedFile(file);
//             setIsPopupOpen(false);
//             setIsPopupOpen(true);
//         }
//     };

//     const handleCreatePoll = (newPoll) => {
//         setPolls([...polls, newPoll]);
//     };

//     const departments = [
//         { name: "Department 1", unit: formData.unit, jobtitle: formData.jobtitle, position: formData.position, location: formData.location, phone: formData.phone },
//         { name: "Department 2", unit: formData.unit, jobtitle: formData.jobtitle, position: formData.position, location: formData.location, phone: formData.phone },
//     ];

//     return (
//         <Example>
//             <main className="xl:pl-96 w-full">
//                 <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
//                     <div>
//                         <div className="w-full bg-white h-[485px] shadow-custom rounded-lg">
//                             <ProfileHeader
//                                 backgroundImage={profileData.backgroundImage}
//                                 profileImage={profileData.profileImage ?? 'https://cdn.builder.io/api/v1/image/assets/TEMP/19dbe4d9d7098d561e725a31b63856fbbf81097ff193f1e5b04be40ccd3fe081?'}
//                                 name={profileData.name}
//                                 username={profileData.username}
//                                 status={profileData.status}
//                                 onEditBanner={() => setIsPopupOpen(true)}
//                                 rounded={true}
//                                 userId={id}
//                                 profileId={profileData.profile?.id}
//                             />
//                             <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />
//                             {activeTab === "activities" && (
//                                 <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 flex flex-col items-center ">
//                                     <ShareYourThoughts userId={id} postType={'post'} onCreatePoll={handleCreatePoll} />
//                                     <Filter className="mr-10" />
//                                     <div className="mb-20"></div>
//                                     <OutputData polls={polls} showUserPosts={true} userId={id} />
//                                 </div>
//                             )}
//                             {activeTab === "bio" && (
//                                 <>
//                                 <section className="flex flex-col w-full gap-2 px-8 py-4 mt-6 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full">
//                                     <div className="flex items-center justify-between">
//                                         <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">Bio Information</div>
//                                         <ProfileIcons
//                                             icon1={profileData.icon1}
//                                             onEdit={handleEdit}
//                                             isFirstIcon
//                                         />
//                                     </div>
//                                     <div className="flex-auto my-auto max-md:max-w-full">
//                                         <div className="flex gap-5 flex-col md:flex-row max-md:gap-0">
//                                             <ProfileBio
//                                                 name={formData.name}
//                                                 photo={profileData.profileImage}
//                                                 username={formData.username}
//                                                 email={formData.email}
//                                                 grade={formData.grade}
//                                                 dateofbirth={formData.dateofbirth}
//                                                 whatsapp={formData.whatsapp}
//                                                 icon2={profileData.icon2}
//                                                 isEditing={isEditing}
//                                                 onFormDataChange={handleFormDataChange}
//                                                 onPhotoChange={handlePhotoChange}
//                                             />
//                                         </div>
//                                         <div className="flex justify-end">
//                                             <ProfileIcons
//                                                 icon2={profileData.icon2}
//                                                 onEdit={handleEdit}
//                                                 isFirstIcon
//                                             />
//                                         </div>
//                                         {isEditing && (
//                                             <div className="flex justify-end mt-4 pb-3">
//                                                 <button onClick={handleCancel} className="bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full">Cancel</button>
//                                                 <button onClick={handleSave} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">Save</button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </section>
//                                     <div className="separator"></div>
//                                     {departments.map((dept, index) => (
//                                         <section key={index} className="flex flex-col w-full gap-2 px-8 py-4 mt-3 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full">
//                                             <div className="flex items-center justify-between">
//                                         <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">{dept.name}</div>
//                                         <ProfileIcons
//                                             icon1={profileData.icon1}
//                                             onEdit={handleEdit}
//                                             isFirstIcon
//                                         />
//                                         </div>
//                                         <div className="flex-auto my-auto max-md:max-w-full">
//                                             <div className="flex gap-5 flex-col md:flex-row max-md:gap-0">
//                                                 <ProfileBio
//                                                     // department={dept.name}
//                                                     unit={dept.unit}
//                                                     jobtitle={dept.jobtitle}
//                                                     position={dept.position}
//                                                     location={dept.location}
//                                                     phone={dept.phone}
//                                                     isEditing={isEditing}
//                                                     onFormDataChange={handleFormDataChange}
//                                                 />
//                                             </div>
//                                             {isEditing && (
//                                                 <div className="flex justify-end mt-4">
//                                                     <button onClick={handleCancel} className=" bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full">Cancel</button>
//                                                     <button onClick={handleSave} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">Save</button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </section>
//                                     ))}
//                                 </>
//                             )}
//                             {activeTab === "gallery" && (
//                                 <section>
//                                     <ImageProfile selectedItem="All" userId={id} />
//                                     <VideoProfile selectedItem="All" userId={id} />
//                                 </section>
//                             )}
//                             {activeTab === "files" && (
//                                 <div>
//                                     <div className="flex gap-4 whitespace-nowrap">
//                                         <SearchInput />
//                                         <SearchButton />
//                                     </div>
//                                     <Table userId={id} />
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </main>
//             <aside className="fixed bottom-0 left-20 top-16 hidden w-1/4 max-w-sm overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 xl:block">
//                 <style>
//                 {`
//                     aside::-webkit-scrollbar {
//                         width: 0px !important;
//                         background: transparent !important;
//                     }
//                     aside {
//                         scrollbar-width: none !important; /* For Firefox */
//                         -ms-overflow-style: none;  /* IE and Edge */
//                     }
//                 `}
//                 </style>
//                 <div className="file-directory-header">
//                     <PageTitle title="My Profile" />
//                 </div>
//                 <hr className="file-directory-underline" />
//                 <div>
//                     <FeaturedEvents />
//                     <WhosOnline />
//                 </div>
//             </aside>
//             {isSaveNotificationOpen && (
//                 <SaveNotification title="Changes saved successfully" onClose={closeSaveNotification} />
//             )}
//             {isPopupOpen && (
//                 <Popup 
//                     title="Edit Banner Photo" 
//                     onClose={() => setIsPopupOpen(false)} 
//                     onSave={handleSave}
//                     onSelectFile={handleSelectFile}
//                 />
//             )}
//         </Example>
//     );
// }

import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import PageTitle from '../Components/Reusable/PageTitle';
import FeaturedEvents from '../Components/Reusable/FeaturedEventsWidget/FeaturedEvents';
import WhosOnline from '../Components/Reusable/WhosOnlineWidget/WhosOnline';
import './css/StaffDirectory.css';
import { ProfileHeader, ProfileNav, Popup } from "@/Components/Profile";
import { ProfileBio, ProfileIcons, SearchInput, SearchButton, Table } from "@/Components/ProfileTabbar";
import Example from '@/Layouts/DashboardLayoutNew';
import { ImageProfile, VideoProfile } from '@/Components/ProfileTabbar/Gallery';
import { ShareYourThoughts, Filter, OutputData } from '@/Components/Reusable/WallPosting';
import '../Components/Profile/profile.css';
import { useCsrf } from '@/composables';
import { ProfileDepartment } from '@/Components/ProfileTabbar';

function SaveNotification({ title, content, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="p-2 rounded-3xl w-4xl">
                <section className="flex flex-col px-2.5 pt-16 font-bold text-center bg-white rounded-xl shadow-custom w-[380px] h-[165px]">
                    <div className="flex flex-col w-full">
                        <h2 className="text-xl text-neutral-800">{title}</h2>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function Profile() {
    const csrfToken = useCsrf();
    const { props } = usePage();
    const { id, authToken } = props; // Ensure authToken is passed via Inertia
    const [polls, setPolls] = useState([]);
    const [activeTab, setActiveTab] = useState("bio");
    const [isSaveNotificationOpen, setIsSaveNotificationOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [photo, setPhoto] = useState("https://cdn.builder.io/api/v1/image/assets/TEMP/e2529a8d6493a4752f7510057ac1d7c1f0535b2b08af30702ea115fd3e80f513?apiKey=285d536833cc4168a8fbec258311d77b&");
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
        department2: "",
        unit2: "",
        jobtitle2: "",
        position2: "",
        grade2: "",
        location2: "",
        phone2: "",
    });
    const [originalFormData, setOriginalFormData] = useState(formData);
    const [originalPhoto, setOriginalPhoto] = useState(photo);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingDepartment1, setIsEditingDepartment1] = useState(false);
    const [isEditingDepartment2, setIsEditingDepartment2] = useState(false);
    const [profileData, setProfileData] = useState({
        backgroundImage: "",
        profileImage: "",
        name: "", // Initialize with empty string or placeholder
        username: "",
        status: "Online",
        icon1: "/assets/EditButton.svg",
        icon2: "https://cdn.builder.io/api/v1/image/assets/TEMP/c509bd2e6bfcd3ab7723a08c590219ec47ac648338970902ce5e506f7e419cb7?",
    });
    const [userData, setUserData] = useState({});

    useEffect(() => {
        console.log("Fetching user data...");
        fetch(`/api/users/users/${id}?with[]=profile&with[]=employmentPost.department&with[]=employmentPost.businessPost&with[]=employmentPost.businessUnit`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(({ data }) => {
                console.log('hello', data);
                setProfileData(pv => ({
                    ...pv, ...data,
                    backgroundImage: data.profile && data.profile.cover_photo ? `/storage/${data.profile.cover_photo}` : 'https://cdn.builder.io/api/v1/image/assets/TEMP/51aef219840e60eadf3805d1bd5616298ec00b2df42d036b6999b052ac398ab5?',
                    profileImage: data.profile && data.profile.image ? data.profile.image : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${data.name}`,
                    username: "@" + data.username,
                }));

                setFormData((pv) => ({
                    ...pv,
                    name: data.name,
                    username: data.username || "N/A",
                    email: data.email,
                    department: data.employment_post?.department?.name || "N/A",
                    unit: data.employment_post?.business_unit?.name || "N/A",
                    jobtitle: data.employment_post?.title || "N/A",
                    position: data.employment_post?.business_post?.title || "N/A",
                    grade: data.employment_post?.schema_grade || "N/A",
                    location: data.employment_post?.location || "N/A",
                    dateofbirth: data.profile?.dob || "N/A",
                    phone: data.profile?.work_phone || "N/A",
                    whatsapp: data.profile?.phone_no || "N/A",
                }));

                setOriginalFormData((pv) => ({
                    ...pv,
                    name: data.name,
                    username: data.username || "N/A",
                    email: data.email,
                    department: data.employment_post?.department?.name || "N/A",
                    unit: data.employment_post?.business_unit?.name || "N/A",
                    jobtitle: data.employment_post?.title || "N/A",
                    position: data.employment_post?.business_post?.title || "N/A",
                    grade: data.employment_post?.schema_grade || "N/A",
                    location: data.employment_post?.location || "N/A",
                    dateofbirth: data.profile?.dob || "N/A",
                    phone: data.profile?.work_phone || "N/A",
                    whatsapp: data.profile?.phone_no || "N/A",
                }));
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, [id]);

    const openSaveNotification = () => {
        setIsSaveNotificationOpen(true);
    };

    const closeSaveNotification = () => {
        setIsSaveNotificationOpen(false);
        // window.location.reload();
    };

    const handleSaveNotification = () => {
        closeSaveNotification();
    };

    const handleFormDataChange = (newData) => {
        setFormData(newData);
    };

    const handlePhotoChange = (newPhoto) => {
        setPhoto(newPhoto);
    };



    const handleSaveBio = () => {
        setOriginalFormData(formData);
        setOriginalPhoto(photo);
        setIsEditingBio(false);
        openSaveNotification();
        setTimeout(closeSaveNotification, 1200);
    };

    const handleSaveDepartment1 = () => {
        setOriginalFormData(formData);
        setOriginalPhoto(photo);
        setIsEditingDepartment1(false);
        openSaveNotification();
        setTimeout(closeSaveNotification, 1200);
    };

    const handleSaveDepartment2 = () => {
        setOriginalFormData(formData);
        setOriginalPhoto(photo);
        setIsEditingDepartment2(false);
        openSaveNotification();
        setTimeout(closeSaveNotification, 1200);
    };

    const handleCancelBio = () => {
        setFormData(originalFormData);
        setPhoto(originalPhoto);
        setIsEditingBio(false);
    };

    const handleCancelDepartment1 = () => {
        setFormData(originalFormData);
        setPhoto(originalPhoto);
        setIsEditingDepartment1(false);
    };

    const handleCancelDepartment2 = () => {
        setFormData(originalFormData);
        setPhoto(originalPhoto);
        setIsEditingDepartment2(false);
    };

    const handleEditBio = () => {
        setIsEditingBio(true);
    };

    const handleEditDepartment1 = () => {
        setIsEditingDepartment1(true);
    };

    const handleEditDepartment2 = () => {
        setIsEditingDepartment2(true);
    };

    console.log("profileData", profileData.profile?.id)
    console.log("DD", formData.name);

    const handleSelectFile = (event) => {
        console.log("HH", event);
        const file = event.target.files[0];
        if (file) {
            const FfData = new FormData();
            console.log("LL", formData.name);
            FfData.append('cover_photo', file);
            FfData.append('user_id', id); // Add user_id to the form data
            FfData.append('_method', 'PUT'); // Add _method to the form data
            FfData.append('name', formData.name); // Add _method to the form data
    
            // const url = `/api/profile/profiles/${profileData.profile?.id}`;
            const url = `/api/profile/profiles/${id}?with[]=user`;
    
            console.log("CSRF Token:", csrfToken);
            console.log("Auth Token:", authToken);
    
            try {
                console.log('Uploading profile photo with payload:', {
                    cover_photo: file,
                    user_id: id,
                });
    
                fetch(url, {
                    method: 'POST',
                    body: FfData,
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '', // Provide an empty string if csrfToken is null
                        'Authorization': `Bearer ${authToken}`,
                    },
                })
                .then(async response => {
                    if (!response.ok) {
                        const error = await response.json();
                        return await Promise.reject(error);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        setPhoto(URL.createObjectURL(file));
                        setIsPopupOpen(false);
                        console.log('File uploaded successfully:', data);
                    } else {
                        console.error('Error uploading file:', data);
                    }
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    

    // // Dummy departments data
    // const departments = [
    //     { name: "Department 1", unit: formData.unit, jobtitle: formData.jobtitle, position: formData.position, location: formData.location, phone: formData.phone },
    //     { name: "Department 2", unit: formData.unit, jobtitle: formData.jobtitle, position: formData.position, location: formData.location, phone: formData.phone },
    // ];


    const handleCreatePoll = (poll) => {
      setPolls((prevPolls) => [...prevPolls, poll]);
    };

    console.log("PROFILEDATA", profileData.profile?.id);

    return (
        <Example>
            <main className="xl:pl-96 w-full">
                <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                    <div>
                        <div className="w-full bg-white h-[485px] shadow-custom rounded-lg">
                            <ProfileHeader
                                backgroundImage={profileData.backgroundImage}
                                profileImage={profileData.profileImage ?? 'https://cdn.builder.io/api/v1/image/assets/TEMP/19dbe4d9d7098d561e725a31b63856fbbf81097ff193f1e5b04be40ccd3fe081?'}
                                name={profileData.name}
                                username={profileData.username}
                                status={profileData.status}
                                onEditBanner={() => setIsPopupOpen(true)}
                                rounded={true}
                                userId={id}
                                profileId={profileData.profile?.id}
                            />
                            <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />
                            {activeTab === "activities" && (
                                <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 flex flex-col items-center ">
                                    <ShareYourThoughts userId={id} postType={'post'} onCreatePoll={handleCreatePoll} />
                                    <Filter className="mr-10" />
                                    <div className="mb-20"></div>
                                    <OutputData polls={polls} showUserPosts={true} userId={id} />
                                </div>
                            )}
                            {activeTab === "bio" && (
                                <>
                                <section className="flex flex-col w-full gap-2 px-8 py-4 mt-6 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full">
                                    <div className="flex items-center justify-between">
                                        <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">Bio Information</div>
                                        <ProfileIcons
                                            icon1={profileData.icon1}
                                            icon2={profileData.icon2}
                                            onEdit={handleEditBio}
                                            isFirstIcon
                                        />
                                    </div>
                                    <div className="flex-auto my-auto max-md:max-w-full">
                                        <div className="flex gap-5 flex-col md:flex-row max-md:gap-0">
                                        <ProfileBio
                                            photo={photo}
                                            username={formData.username}
                                            email={formData.email}
                                            dateofbirth={formData.dateofbirth}
                                            whatsapp={formData.whatsapp}
                                            isEditing={isEditingBio}
                                            onFormDataChange={setFormData}
                                            onPhotoChange={handlePhotoChange}
                                            originalFormData={originalFormData}
                                            onEditBio={handleEditBio}
                                            onCancelBio={handleCancelBio}
                                            onSaveBio={handleSaveBio}
                                        />
                                        </div>
                                        {/* {isEditingBio && (
                                            <div className="flex justify-end mt-4 pb-3">
                                                <button onClick={handleCancelBio} className="bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full">Cancel</button>
                                                <button onClick={handleSaveBio} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">Save</button>
                                            </div>
                                        )} */}
                                    </div>
                                </section>
                                <div className="separator"></div>
                                <section className="flex flex-col w-full gap-2 px-8 py-4 mt-3 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full">
                                    <div className="flex items-center justify-between">
                                        <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">Department 1 Information</div>
                                        <ProfileIcons
                                            icon1={profileData.icon1}
                                            onEdit={handleEditDepartment1}
                                            isFirstIcon
                                        />
                                    </div>
                                    <div className="flex-auto my-auto max-md:max-w-full">
                                        <div className="flex gap-5 flex-col md:flex-row max-md:gap-0">
                                            <ProfileDepartment
                                                department={formData.department}
                                                unit={formData.unit}
                                                jobtitle={formData.jobtitle}
                                                position={formData.position}
                                                grade={formData.grade}
                                                location={formData.location}
                                                phone={formData.phone}
                                                isEditing={isEditingDepartment1}
                                                onFormDataChange={handleFormDataChange}
                                                originalFormData={originalFormData}
                                            />
                                        </div>
                                        {isEditingDepartment1 && (
                                            <div className="flex justify-end mt-4 pb-3">
                                                <button onClick={handleCancelDepartment1} className="bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full">Cancel</button>
                                                <button onClick={handleSaveDepartment1} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">Save</button>
                                            </div>
                                        )}
                                    </div>
                                </section>
                                <div className="separator"></div>
                                <section className="flex flex-col w-full gap-2 px-8 py-4 mt-3 bg-white rounded-lg shadow-custom max-md:flex-wrap max-md:px-5 max-md:max-w-full">
                                    <div className="flex items-center justify-between">
                                        <div className="separator text-xl font-semibold mt-2 pl-4 justify-center">Department 2 Information</div>
                                        <ProfileIcons
                                            icon1={profileData.icon1}
                                            onEdit={handleEditDepartment2}
                                            isFirstIcon
                                        />
                                    </div>
                                    <div className="flex-auto my-auto max-md:max-w-full">
                                        <div className="flex gap-5 flex-col md:flex-row max-md:gap-0">
                                            <ProfileDepartment
                                                department={formData.department2}
                                                unit={formData.unit2}
                                                jobtitle={formData.jobtitle2}
                                                position={formData.position2}
                                                grade={formData.grade2}
                                                location={formData.location2}
                                                phone={formData.phone2}
                                                isEditing={isEditingDepartment2}
                                                onFormDataChange={handleFormDataChange}
                                                originalFormData={originalFormData}
                                            />
                                        </div>
                                        {isEditingDepartment2 && (
                                            <div className="flex justify-end mt-4 pb-3">
                                                <button onClick={handleCancelDepartment2} className="bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full">Cancel</button>
                                                <button onClick={handleSaveDepartment2} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">Save</button>
                                            </div>
                                        )}
                                    </div>
                                </section>
                                </>
                            )}
                            {activeTab === "gallery" && (
                                <section>
                                    <ImageProfile selectedItem="All" userId={id} />
                                    <VideoProfile selectedItem="All" userId={id} />
                                </section>
                            )}
                            {activeTab === "files" && (
                                <div>
                                    <div className="flex gap-4 whitespace-nowrap">
                                        <SearchInput />
                                        <SearchButton />
                                    </div>
                                    <Table userId={id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <aside className="fixed bottom-0 left-20 top-16 hidden w-1/4 max-w-sm overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 xl:block">
                <style>
                {`
                    aside::-webkit-scrollbar {
                        width: 0px !important;
                        background: transparent !important;
                    }
                    aside {
                        scrollbar-width: none !important; /* For Firefox */
                        -ms-overflow-style: none;  /* IE and Edge */
                    }
                `}
                </style>
                <div className="file-directory-header">
                    <PageTitle title="My Profile" />
                </div>
                <hr className="file-directory-underline" />
                <div>
                    <FeaturedEvents />
                    <WhosOnline />
                </div>
            </aside>
            {isSaveNotificationOpen && (
                <SaveNotification title="Changes saved successfully" onClose={closeSaveNotification} />
            )}
            {isPopupOpen && (
                <Popup 
                    title="Edit Banner Photo" 
                    onClose={() => setIsPopupOpen(false)} 
                    onSave={handleSaveBio}
                    onSelectFile={handleSelectFile}
                />
            )}
        </Example>
    );
}



