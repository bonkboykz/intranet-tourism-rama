import React, { useCallback, useEffect, useState } from "react";
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

import "./css/CreateCommunity.css"; // Import the CSS file where you added the scrollbar styles

function Header({ title }) {
    return (
        <header className="flex gap-5 items-start self-center px-5 w-full text-2xl font-bold text-center max-w-[358px] text-neutral-800">
            <h1 className="flex-auto mt-3">{title}</h1>
        </header>
    );
}

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
                    onChange={(e) => onImageChange(e.target.files[0])}
                    className="hidden"
                />
            )}
            {src && !cropMode && (
                <button
                    disabled={cropDisabled}
                    className={cn(
                        "mt-4 px-4 py-2 font-bold text-white bg-primary rounded-full ",
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

function UserInfo({ name, role, src }) {
    return (
        <div className="flex gap-4 items-center justify-start w-full mt-2 text-neutral-800">
            <img
                loading="lazy"
                src={src}
                alt=""
                className="shrink-0 aspect-square w-[42px] h-[42px] rounded-full object-cover object-center"
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
    const [originalImageSrc, setOriginalImageSrc] = useState(imgSrc);
    const [originalImageBase64, setOriginalImageBase64] = useState("");
    const [imageSrc, setImageSrc] = useState(imgSrc);
    const [imageBase64, setImageBase64] = useState(""); // Base64 image string
    const [selectedType, setSelectedType] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [cropMode, setCropMode] = useState(false);
    const csrfToken = useCsrf();

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleImageChange = (file) => {
        const reader = new FileReader();
        reader.onload = async () => {
            setImageSrc(reader.result);
            setOriginalImageSrc(reader.result);
            setOriginalImageBase64(await blobToBase64(file));
            const base64 = await blobToBase64(file);
            setImageBase64(base64); // Reset the base64 string when a new image is selected
            setCroppedImage(""); // Reset the cropped image when a new image is selected
        };
        reader.readAsDataURL(file);
    };

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            const croppedImageUrl = URL.createObjectURL(croppedBlob);
            setCroppedImage(croppedImageUrl);
            const base64 = await blobToBase64(croppedBlob);
            setImageBase64(base64);
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels]);

    const { hasRole } = usePermissions();
    const isSuperAdmin = hasRole("superadmin");

    const handleSubmit = async () => {
        const data = {
            name: communityName,
            type: selectedType,
            created_by: user.name,
            updated_by: user.name,
        };

        if (imageBase64) {
            data.banner = imageBase64;
            data.banner_original = originalImageBase64;
        }
        if (communityDescription) {
            data.description = communityDescription;
        }

        // console.log(data.banner.length);

        try {
            // console.log("Creating community:", data);

            if (!isSuperAdmin) {
                const response = await axios.post(
                    `/api/createCommunityCreateRequest`,
                    data
                );

                if ([200, 201, 204].includes(response.status)) {
                    toast.success("Community create request sent");

                    onCreate();
                }

                return;
            }

            const response = await axios.post(
                "/api/communities/communities",
                data
            );
            // const text = await response.text();
            // const responseData = response.data;

            if (![200, 201, 204].includes(response.status)) {
                // console.error("Server response not OK:", text);
                throw new Error("Failed to create community");
            }

            // const responseData = text ? JSON.parse(text) : {};
            // console.log("Community created:", responseData.data);
            onCreate();
            // window.location.reload();
        } catch (error) {
            console.error("Error creating community:", error.message);

            toast.error("Failed to create community", {
                icon: <CircleXIcon className="w-6 h-6 text-white" />,
                theme: "colored",
            });
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
                    setCropMode={setCropMode}
                    crop={crop}
                    setCrop={setCrop}
                    zoom={zoom}
                    setZoom={setZoom}
                    onCropComplete={onCropComplete}
                    cropDisabled={isDefaultImage}
                />
                <input
                    type="text"
                    placeholder="Community name"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    className="self-stretch mt-7 text-2xl font-extrabold text-neutral-800 border border-solid border-neutral-300 rounded-md"
                />
                <input
                    type="text"
                    placeholder={description}
                    value={communityDescription}
                    onChange={(e) => setCommunityDescription(e.target.value)}
                    className="justify-center items-start px-3.5 py-7 mt-4 max-w-full text-base font-semibold whitespace-nowrap text-neutral-800 w-full rounded-md border border-solid border-neutral-300"
                />
                <UserInfo
                    name={user.name}
                    role={user.role}
                    src={user.profileImage}
                />
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mt-4 w-full text-base font-semibold text-neutral-800 border border-solid border-neutral-300 rounded-md"
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

export default function CreateCommunity({ id, onCancel, onCreate }) {
    const user = useUserData();

    return (
        <div className="scrollable-container">
            <Card
                title="Create New Community"
                imgSrc="/assets/uploadAnImage.svg"
                imgAlt="Community Header Photo"
                user={{
                    name: user.name,
                    role: "Admin",
                    profileImage: getProfileImage(user.profile, user.name),
                }}
                type="Type"
                description="Description"
                cancelText="Cancel"
                createText="Create"
                onCancel={onCancel}
                onCreate={onCreate}
            />
        </div>
    );
}
