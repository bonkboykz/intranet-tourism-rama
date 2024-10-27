import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import axios from "axios";
import { CircleXIcon } from "lucide-react";

import { useCsrf } from "@/composables";
import { cn } from "@/Utils/cn";
import { getProfileImage } from "@/Utils/getProfileImage";
import { usePermissions } from "@/Utils/hooks/usePermissions";
import useUserData from "@/Utils/hooks/useUserData";
import { toastError } from "@/Utils/toast";

import getCroppedImg from "./cropImgCommunity";

import "./css/CreateCommunity.css"; // Ensure this CSS file includes styles for the scrollbar and other elements

// Header Component
function Header({ title }) {
    return (
        <header className="flex gap-5 items-start self-center px-5 w-full text-2xl font-bold text-center max-w-[358px] text-neutral-800">
            <h1 className="flex-auto mt-3">{title}</h1>
        </header>
    );
}

// Banner Component with "Save Crop" Button
function Banner({
    src,
    alt,
    onImageChange,
    cropMode,
    setCropMode,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    onSaveCrop, // New prop for handling save crop
    cropDisabled = true,
}) {
    const handleClick = () => {
        if (!cropMode) {
            document.getElementById("avatarInput").click();
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div
                className="relative flex items-center justify-center bg-gray-200 cursor-pointer rounded-xl w-full max-w-md h-[133px] overflow-hidden"
                onClick={handleClick}
            >
                {src && cropMode ? (
                    <>
                        <Cropper
                            image={src}
                            crop={crop}
                            zoom={zoom}
                            aspect={3 / 1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            className="rounded-xl"
                        />
                        {/* Save Crop Button */}
                        <button
                            className="absolute bottom-2 right-2 px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={onSaveCrop}
                        >
                            Save Crop
                        </button>
                    </>
                ) : (
                    <img
                        loading="lazy"
                        src={src || "/assets/uploadAnImage.svg"}
                        alt={alt}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            {!cropMode && (
                <input
                    type="file"
                    accept="image/*"
                    id="avatarInput"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            onImageChange(e.target.files[0]);
                        }
                    }}
                    className="hidden"
                />
            )}
            {src && !cropMode && (
                <button
                    disabled={cropDisabled}
                    className={cn(
                        "mt-4 px-4 py-2 font-bold text-white bg-primary rounded-full",
                        !cropDisabled && "hover:bg-primary-hover"
                    )}
                    onClick={() => setCropMode(true)}
                >
                    Crop Image
                </button>
            )}
        </div>
    );
}

// UserInfo Component
function UserInfo({ name, role, src }) {
    return (
        <div className="flex gap-4 items-center justify-start w-full mt-2 text-neutral-800">
            <img
                loading="lazy"
                src={src}
                alt={`${name}'s profile`}
                className="shrink-0 aspect-square w-[42px] h-[42px] rounded-full object-cover object-center"
            />
            <div className="flex flex-col grow shrink-0 self-start mt-1.5 basis-0 w-fit">
                <p className="text-lg font-bold">{name}</p>
                <p className="-mt-1 text-sm">{role}</p>
            </div>
        </div>
    );
}

// Card Component with Cropping Functionality
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
    const [originalImageSrc, setOriginalImageSrc] = useState(imgSrc);
    const [originalImageBase64, setOriginalImageBase64] = useState("");
    const [imageSrc, setImageSrc] = useState(imgSrc);
    const [imageBase64, setImageBase64] = useState(""); // Base64 image string
    const [selectedType, setSelectedType] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [cropMode, setCropMode] = useState(false); // Define cropMode and setCropMode
    const csrfToken = useCsrf();

    // Callback when cropping is complete
    const onCropCompleteCallback = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Handle image selection
    const handleImageChange = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            setImageSrc(reader.result);
            setOriginalImageSrc(reader.result);
            const base64Original = await blobToBase64(file);
            setOriginalImageBase64(base64Original);
            // Set imageBase64 to original if not cropping
            setImageBase64(base64Original);
        };
        reader.readAsDataURL(file);
    };

    // Function to handle saving the cropped image
    const showCroppedImage = useCallback(async () => {
        try {
            console.log("Starting image cropping...");
            const croppedBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            const croppedImageUrl = URL.createObjectURL(croppedBlob);
            console.log("Cropped image created:", croppedImageUrl);
            setImageSrc(croppedImageUrl); // Update imageSrc to the cropped image
            const base64 = await blobToBase64(croppedBlob);
            setImageBase64(base64);
            setCropMode(false); // Exit crop mode
        } catch (e) {
            console.error("Error cropping image:", e);
            toastError("Failed to crop image");
        }
    }, [imageSrc, croppedAreaPixels]);

    // Check user permissions
    const { hasRole } = usePermissions();
    const isSuperAdmin = hasRole("superadmin");

    // Handle form submission
    const handleSubmit = async () => {
        if (!communityName.trim()) {
            toast.error("Community name is required.");
            return;
        }
        if (!selectedType) {
            toast.error("Please select a community type.");
            return;
        }

        const data = {
            name: communityName,
            type: selectedType,
            created_by: user.name,
            updated_by: user.name,
        };

        if (imageBase64 || originalImageBase64) {
            data.banner = imageBase64 || originalImageBase64;
            if (imageBase64) {
                data.banner_original = originalImageBase64;
            }
        }

        if (communityDescription) {
            data.description = communityDescription;
        }

        try {
            if (!isSuperAdmin) {
                const response = await axios.post(
                    `/api/createCommunityCreateRequest`,
                    data,
                    {
                        headers: {
                            "X-CSRF-Token": csrfToken,
                        },
                    }
                );

                if ([200, 201, 204].includes(response.status)) {
                    toast.success("Community create request sent");
                    onCreate();
                }

                return;
            }

            const response = await axios.post(
                "/api/communities/communities",
                data,
                {
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to create community");
            }

            toast.success("Community created successfully!");
            onCreate();
            // Optionally, you can redirect or reset the form here
        } catch (error) {
            console.error("Error creating community:", error.message);
            toast.error("Failed to create community", {
                icon: <CircleXIcon className="w-6 h-6 text-white" />,
                theme: "colored",
            });
        }
    };

    // Utility function to convert blob to base64
    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const isDefaultImage = imageSrc === imgSrc;

    return (
        <section className="flex flex-col py-2.5 bg-white rounded-3xl max-w-[442px]">
            <Header title={title} />
            <div className="flex flex-col items-center px-6 mt-3 w-full">
                <Banner
                    src={imageSrc}
                    alt={imgAlt}
                    onImageChange={handleImageChange}
                    cropMode={cropMode}
                    setCropMode={setCropMode} // Pass setCropMode
                    crop={crop}
                    setCrop={setCrop}
                    zoom={zoom}
                    setZoom={setZoom}
                    onCropComplete={onCropCompleteCallback}
                    onSaveCrop={showCroppedImage} // Pass the save crop handler
                    cropDisabled={isDefaultImage}
                />
                <input
                    type="text"
                    placeholder="Community name"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    className="self-stretch mt-7 text-2xl font-extrabold text-neutral-800 border border-solid border-neutral-300 rounded-md p-2"
                />
                <textarea
                    placeholder="Description"
                    value={communityDescription}
                    onChange={(e) => setCommunityDescription(e.target.value)}
                    className="justify-center items-start px-3.5 py-3 mt-4 max-w-full text-base font-semibold text-neutral-800 w-full rounded-md border border-solid border-neutral-300"
                    rows={4}
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
                        className="justify-center px-4 py-2 font-bold text-white bg-primary hover:bg-primary-hover rounded-3xl"
                        onClick={handleSubmit}
                    >
                        {createText}
                    </button>
                </div>
            </div>
        </section>
    );
}

// Main CreateCommunity Component
export default function CreateCommunity({ id, onCancel, onCreate }) {
    const user = useUserData();

    return (
        <div className="scrollable-container overflow-auto p-4">
            <Card
                title="Create New Community"
                imgSrc="/assets/uploadAnImage.svg"
                imgAlt="Community Header Photo"
                user={{
                    name: user.name,
                    role: "Admin",
                    profileImage: getProfileImage(user.profile, user.name),
                }}
                description="Describe your community here..."
                cancelText="Cancel"
                createText="Create"
                onCancel={onCancel}
                onCreate={onCreate}
            />
        </div>
    );
}
