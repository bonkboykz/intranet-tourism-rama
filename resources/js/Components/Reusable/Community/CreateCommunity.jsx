// import React, { useState, useEffect } from "react";
// import { useCsrf } from "@/composables";

// function Header({ title }) {
//   return (
//     <header className="flex gap-5 items-start self-center px-5 w-full text-2xl font-bold text-center max-w-[358px] text-neutral-800">
//       <h1 className="flex-auto mt-3">{title}</h1>
//     </header>
//   );
// }

// function Avatar({ src, alt, onImageChange }) {
//   const handleClick = () => {
//     document.getElementById("avatarInput").click();
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div
//         className="relative flex items-center justify-center bg-gray-200 cursor-pointer rounded-xl w-[400px] h-[300px]"
//         onClick={handleClick}
//       >
//         <img
//           loading="lazy"
//           src={src}
//           alt={alt}
//           className="aspect-square w-[400px] h-[133px] rounded-xl border-4 border-gray-200 object-cover object-center"
//         />
//       </div>
//       <input
//         type="file"
//         accept="image/*"
//         id="avatarInput"
//         onChange={(e) => onImageChange(e.target.files[0])}
//         className="hidden"
//       />
//     </div>
//   );
// }

// function UserInfo({ name, role, src }) {
//   return (
//     <div className="flex gap-4 items-center justify-start w-full mt-2 text-neutral-800">
//       <img
//         loading="lazy"
//         src={src}
//         alt=""
//         className="shrink-0 aspect-square w-[42px] h-[42px] rounded-full object-cover object-center"
//       />
//       <div className="flex flex-col grow shrink-0 self-start mt-1.5 basis-0 w-fit">
//         <p className="text-lg font-bold">{name}</p>
//         <p className="-mt-1 text-sm">{role}</p>
//       </div>
//     </div>
//   );
// }

// function Card({
//   title,
//   imgSrc,
//   imgAlt,
//   user,
//   description,
//   cancelText,
//   createText,
//   onCancel,
//   onCreate,
// }) {
//   const [communityName, setCommunityName] = useState("");
//   const [imageSrc, setImageSrc] = useState(imgSrc);
//   const [imageBase64, setImageBase64] = useState(""); // Base64 image string
//   const [selectedType, setSelectedType] = useState("");
//   const [communityDescription, setCommunityDescription] = useState("");
//   const csrfToken = useCsrf();

//   const handleImageChange = (file) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setImageSrc(reader.result);
//       setImageBase64(reader.result); // Set the base64 string
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async () => {
//     // Initialize the data object with required fields
//     const data = {
//       name: communityName,
//       type: selectedType,
//       created_by: user.name,
//       updated_by: user.name,
//     };

//     // Conditionally add optional fields
//     if (imageBase64) {
//       data.banner = imageBase64; // Only add if the banner is provided
//     }
//     if (communityDescription) {
//       data.description = communityDescription; // Only add if the description is provided
//     }

//     const options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "X-CSRF-Token": csrfToken,
//       },
//       body: JSON.stringify(data),
//     };

//     try {
//       const response = await fetch("/api/communities/communities", options);
//       const text = await response.text();

//       if (!response.ok) {
//         console.error("Server response not OK:", text);
//         throw new Error("Failed to create community");
//       }

//       const responseData = text ? JSON.parse(text) : {};
//       console.log("Community created:", responseData.data);
//       onCreate(responseData.data);
//       window.location.reload(); // Reload the page after successful creation
//     } catch (error) {
//       console.error("Error creating community:", error.message);
//     }
//   };

//   return (
//     <section className="flex flex-col py-2.5 bg-white rounded-3xl max-w-[442px]">
//       <Header title={title} />
//       <div className="flex flex-col items-center px-6 mt-3 w-full">
//         <Avatar src={imageSrc} alt={imgAlt} onImageChange={handleImageChange} />
//         <input
//           type="text"
//           placeholder="Community name"
//           value={communityName}
//           onChange={(e) => setCommunityName(e.target.value)}
//           className="self-stretch mt-7 text-2xl font-extrabold text-neutral-800 border border-solid border-neutral-300 rounded-md"
//         />
//         <input
//           type="text"
//           placeholder={description}
//           value={communityDescription}
//           onChange={(e) => setCommunityDescription(e.target.value)}
//           className="justify-center items-start px-3.5 py-7 mt-4 max-w-full text-base font-semibold whitespace-nowrap text-neutral-800 w-full rounded-md border border-solid border-neutral-300"
//         />
//         <UserInfo name={user.name} role={user.role} src={user.profileImage} />
//         <select
//           value={selectedType}
//           onChange={(e) => setSelectedType(e.target.value)}
//           className="mt-4 w-full text-base font-semibold text-neutral-800 border border-solid border-neutral-300 rounded-md"
//         >
//           <option value="">Select Type</option>
//           <option value="private">Private</option>
//           <option value="public">Public</option>
//         </select>
//         <div className="flex gap-5 justify-between self-end mt-6 text-sm text-center whitespace-nowrap">
//           <button
//             className="my-auto font-semibold text-neutral-800"
//             onClick={onCancel}
//           >
//             {cancelText}
//           </button>
//           <button
//             className="justify-center px-4 py-2 font-bold text-white bg-primary-500 hover:bg-primary-700 rounded-3xl"
//             onClick={handleSubmit}
//           >
//             {createText}
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default function CreateCommunity({ id, onCancel, onCreate }) {
//   const [user, setUserData] = useState({
//     name: "",
//     role: "Admin",
//     profileImage: "",
//   });

//   const fetchUser = async () => {
//     try {
//       const response = await fetch(`/api/users/users/${id}?with[]=profile`, {
//         method: "GET",
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const { data } = await response.json();
//       setUserData((pv) => ({
//         ...pv,
//         ...data,
//         name: data.name,
//         profileImage:
//           data.profile && data.profile.image
//             ? `/storage/${data.profile.image}`
//             : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${data.name}&rounded=true`,
//       }));
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [id]);

//   return (
//     <Card
//       title="Create New Community"
//       imgSrc="/assets/uploadAnImage.svg"
//       imgAlt="Community Header Photo"
//       user={user}
//       type="Type"
//       description="Description"
//       cancelText="Cancel"
//       createText="Create"
//       onCancel={onCancel}
//       onCreate={onCreate}
//     />
//   );
// }

import React, { useState, useEffect, useCallback } from "react";
import { useCsrf } from "@/composables";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImgCommunity";

function Header({ title }) {
    return (
        <header className="flex gap-5 items-start self-center px-5 w-full text-xl font-bold text-center max-w-[358px] text-neutral-800">
            <h1 className="flex-auto mt-3">{title}</h1>
        </header>
    );
}

function Avatar({ src, alt, onImageChange }) {
    const handleClick = () => {
        document.getElementById("avatarInput").click();
    };

    return (
        <div className="flex flex-col items-center">
            <div
                className="relative flex items-center justify-center bg-gray-200 cursor-pointer rounded-xl w-full max-w-[400px] h-[200px] md:h-[300px]"
                onClick={handleClick}
            >
                <img
                    loading="lazy"
                    src={src}
                    alt={alt}
                    className="aspect-[3/1] w-full h-full rounded-xl border-4 border-gray-200 object-cover object-center"
                />
            </div>
            <input
                type="file"
                accept="image/*"
                id="avatarInput"
                onChange={(e) => onImageChange(e.target.files[0])}
                className="hidden"
            />
        </div>
    );
}

function UserInfo({ name, role, src }) {
    return (
        <div className="flex gap-4 items-center justify-start w-full mt-2 text-neutral-800">
            <img
                loading="lazy"
                src={src}
                alt=""
                className="shrink-0 aspect-square w-10 h-10 rounded-full object-cover object-center"
            />
            <div className="flex flex-col grow shrink-0 self-start mt-1.5 basis-0 w-fit">
                <p className="text-lg font-bold">{name}</p>
                <p className="-mt-1 text-sm">{role}</p>
            </div>
        </div>
    );
}

function Card({
    title,
    imgSrc,
    imgAlt,
    user,
    description,
    cancelText,
    createText,
    onCancel,
    onCreate,
}) {
    const [communityName, setCommunityName] = useState("");
    const [imageSrc, setImageSrc] = useState(imgSrc);
    const [imageBase64, setImageBase64] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const csrfToken = useCsrf();

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleImageChange = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setImageBase64("");
            setCroppedImage(null); // Clear previous cropped image
        };
        reader.readAsDataURL(file);
    };

    const showCroppedImage = useCallback(async () => {
        try {
            if (croppedAreaPixels && imageSrc) {
                const croppedBlob = await getCroppedImg(
                    imageSrc,
                    croppedAreaPixels
                );
                const croppedImageUrl = URL.createObjectURL(croppedBlob);
                setCroppedImage(croppedImageUrl);
                const base64 = await blobToBase64(croppedBlob);
                setImageBase64(base64);
            }
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels]);

    const handleSubmit = async () => {
        const data = {
            name: communityName,
            type: selectedType,
            created_by: user.name,
            updated_by: user.name,
        };

        if (imageBase64) {
            data.banner = imageBase64;
        }
        if (communityDescription) {
            data.description = communityDescription;
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(
                "/api/communities/communities",
                options
            );
            const text = await response.text();

            if (!response.ok) {
                console.error("Server response not OK:", text);
                throw new Error("Failed to create community");
            }

            const responseData = text ? JSON.parse(text) : {};
            console.log("Community created:", responseData.data);
            onCreate(responseData.data);
            window.location.reload();
        } catch (error) {
            console.error("Error creating community:", error.message);
        }
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return (
        <section className="flex flex-col py-2.5 bg-white rounded-3xl max-w-[442px] mx-auto">
            <Header title={title} />
            <div className="flex flex-col items-center px-6 mt-3 w-full">
                <Avatar
                    src={croppedImage || imageSrc}
                    alt={imgAlt}
                    onImageChange={handleImageChange}
                />
                {imageSrc && (
                    <div className="relative w-full h-[200px] mt-3 max-w-[400px] md:h-[300px]">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={3 / 1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                )}
                {imageSrc && (
                    <button
                        className="justify-center px-4 py-2 mt-4 font-bold text-white bg-primary-500 hover:bg-primary-700 rounded-3xl"
                        onClick={showCroppedImage}
                    >
                        Crop & Save
                    </button>
                )}
                <input
                    type="text"
                    placeholder="Community name"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    className="self-stretch mt-7 text-xl font-extrabold text-neutral-800 border border-solid border-neutral-300 rounded-md p-2"
                />
                <input
                    type="text"
                    placeholder={description}
                    value={communityDescription}
                    onChange={(e) => setCommunityDescription(e.target.value)}
                    className="justify-center items-start px-3.5 py-4 mt-4 max-w-full text-base font-semibold whitespace-nowrap text-neutral-800 w-full rounded-md border border-solid border-neutral-300"
                />
                <UserInfo
                    name={user.name}
                    role={user.role}
                    src={user.profileImage}
                />
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mt-4 w-full text-base font-semibold text-neutral-800 border border-solid border-neutral-300 rounded-md p-2"
                >
                    <option value="">Select Type</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
                <div className="flex gap-5 justify-between self-end mt-6 text-sm text-center whitespace-nowrap">
                    <button
                        className="my-auto font-semibold text-neutral-800"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="justify-center px-4 py-2 font-bold text-white bg-primary-500 hover:bg-primary-700 rounded-3xl"
                        onClick={handleSubmit}
                    >
                        {createText}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default function CreateCommunity({ id, onCancel, onCreate }) {
    const [user, setUserData] = useState({
        name: "",
        role: "Admin",
        profileImage: "",
    });

    const fetchUser = async () => {
        try {
            const response = await fetch(
                `/api/users/users/${id}?with[]=profile`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const { data } = await response.json();
            setUserData((pv) => ({
                ...pv,
                ...data,
                name: data.name,
                profileImage:
                    data.profile && data.profile.image
                        ? `/storage/${data.profile.image}`
                        : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${data.name}&rounded=true`,
            }));
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <Card
                title="Create Community"
                imgSrc="https://via.placeholder.com/400x133?text=Community+Banner"
                imgAlt="Community Banner"
                user={user}
                description="Type your description here..."
                cancelText="Cancel"
                createText="Create"
                onCancel={onCancel}
                onCreate={onCreate}
            />
        </div>
    );
}
