import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { usePage } from "@inertiajs/react";

import { useCsrf } from "@/composables";

import getCroppedImg from "./cropImgCommunity";

function Header({ title }) {
    return (
        <header className="flex gap-5 items-start self-center px-5 w-full text-2xl font-bold text-center max-w-[358px] text-neutral-800">
            <h1 className="flex-auto mt-0">{title}</h1>
        </header>
    );
}

function Avatar({ src, alt, onImageChange }) {
    const [previewSrc, setPreviewSrc] = useState(src);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [cropping, setCropping] = useState(false);

    const handleClick = () => {
        document.getElementById("avatarInput").click();
    };

    const handleImageChange = (file) => {
        if (file && file instanceof Blob) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewSrc(objectUrl);
            setCropping(true);
        } else {
            console.error("Invalid file input:", file);
        }
    };

    let banner = "";

    if (previewSrc && typeof previewSrc === "string") {
        if (previewSrc.startsWith("banner/")) {
            banner = `/storage/${previewSrc}`;
        } else {
            banner = previewSrc;
        }
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCrop = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                previewSrc,
                croppedAreaPixels
            );
            onImageChange(croppedImage);
            setPreviewSrc(URL.createObjectURL(croppedImage));
            setCropping(false);
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, previewSrc, onImageChange]);

    const handleRepositionClick = async () => {
        setCropping(true);
        // Re-fetch the original image from the server
        try {
            const response = await fetch(banner);
            if (!response.ok) {
                throw new Error("Failed to fetch the image for repositioning");
            }
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setPreviewSrc(objectUrl);
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };

    return (
        <div className="flex flex-col items-center object-cover object-center">
            {cropping ? (
                <>
                    <div className="relative w-[400px] h-[300px]">
                        <Cropper
                            image={previewSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={3 / 1} // Aspect ratio for banner
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="flex justify-end w-full mt-4 space-x-2">
                        <button
                            onClick={handleCrop}
                            className="px-4 py-2 text-white font-bold bg-blue-500 rounded-full hover:bg-blue-700"
                        >
                            Apply Crop
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {previewSrc ? (
                        <div className="flex flex-col items-center">
                            <img
                                loading="lazy"
                                src={banner}
                                alt={alt}
                                className="cursor-pointer w-[400px] h-[133px] rounded-xl border-4 border-gray-200 object-cover object-center"
                                onClick={handleClick}
                            />
                            <button
                                onClick={handleRepositionClick}
                                className="mt-2 px-4 py-2 text-white font-bold bg-blue-500 rounded-full hover:bg-blue-700"
                            >
                                Reposition Image
                            </button>
                        </div>
                    ) : (
                        <p>No image available</p>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        id="avatarInput"
                        onChange={(e) => handleImageChange(e.target.files[0])}
                        className="hidden"
                    />
                </>
            )}
        </div>
    );
}

function Card({
    title,
    imgSrc,
    imgAlt,
    department,
    cancelText,
    saveText,
    onCancel,
    onSave,
}) {
    const [departmentName, setDepartmentName] = useState(
        department?.name || ""
    );
    const [initialDepartmentName, setInitialDepartmentName] = useState(
        department?.name || ""
    );

    const [imageSrc, setImageSrc] = useState(department?.banner || imgSrc);
    const [initialImageSrc, setInitialImageSrc] = useState(
        department?.banner || imgSrc
    );
    const [imageFile, setImageFile] = useState(null); // New state to hold the file object

    const [selectedType, setSelectedType] = useState(department?.type || "");
    const [initialSelectedType, setInitialSelectedType] = useState(
        department?.type || ""
    );

    const [departmentDescription, setDepartmentDescription] = useState(
        department?.description || ""
    );
    const [initialDepartmentDescription, setInitialDepartmentDescription] =
        useState(department?.description || "");

    const [error, setError] = useState("");
    const csrfToken = useCsrf();
    const { props } = usePage();
    const { authToken } = props;

    useEffect(() => {
        setDepartmentName(department?.name || "");
        setInitialDepartmentName(department?.name || "");

        setImageSrc(department?.banner || imgSrc);
        setInitialImageSrc(department?.banner || imgSrc);

        setSelectedType(department?.type || "");
        setInitialSelectedType(department?.type || "");

        setDepartmentDescription(department?.description || "");
        setInitialDepartmentDescription(department?.description || "");
    }, [department, imgSrc]);

    const handleImageChange = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result); // Use base64 string as the image source
            setImageFile(reader.result); // Store the base64 string
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setError(""); // Reset any previous errors

        const formData = new FormData();
        formData.append("_method", "PUT");

        // Ensure description is always a string
        const finalDescription = departmentDescription || ""; // Default to empty string if null/undefined

        // Append the current or updated values
        formData.append("name", departmentName);
        formData.append("description", finalDescription); // Ensure it is a string
        formData.append("type", selectedType);

        if (imageFile) {
            formData.append("banner", imageFile);
        } else {
            formData.append("banner", initialImageSrc);
        }

        const options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "X-CSRF-Token": csrfToken,
                Authorization: `Bearer ${authToken}`,
            },
            body: formData,
        };

        const url = `/api/communities/communities/${department?.id}`;

        try {
            const response = await fetch(url, options);
            const text = await response.text();

            if (!response.ok) {
                console.error("Server response not OK:", text);
                throw new Error("Failed to save department");
            }

            const responseData = text ? JSON.parse(text) : {};
            console.log("Department saved:", responseData.data);

            if (onSave) onSave(responseData.data);

            window.location.reload();
        } catch (error) {
            console.error("Error saving department:", error.message);
            setError("An error occurred while saving the department.");
        }
    };

    return (
        <section className="flex flex-col py-6 bg-white rounded-2xl shadow-sm max-w-[442px] w-full px-10">
            <Header title={title} />
            <div className="flex flex-col items-center w-full px-6 ">
                <Avatar
                    src={imageSrc}
                    alt={imgAlt}
                    onImageChange={handleImageChange}
                />
                <input
                    type="text"
                    placeholder="Community name"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="self-stretch text-2xl font-extrabold border border-solid rounded-md mt-6 text-neutral-800 border-neutral-300"
                />
                <input
                    type="text"
                    placeholder="Community description"
                    value={departmentDescription}
                    onChange={(e) => setDepartmentDescription(e.target.value)}
                    className="self-stretch mt-3 border border-solid rounded-md text-neutral-800 border-neutral-300 font-bold"
                />
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                <div className="flex justify-end w-full mt-4 space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-black font-bold"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-white font-bold bg-blue-500 rounded-full hover:bg-blue-700"
                    >
                        {saveText}
                    </button>
                </div>
            </div>
        </section>
    );
}

const EditCommunity = ({ department, onCancel, onSave }) => (
    <Card
        title="Edit Community"
        imgSrc="/assets/upload.png"
        imgAlt="Community Banner"
        department={department}
        cancelText="Cancel"
        saveText="Save"
        onCancel={onCancel}
        onSave={onSave}
    />
);

export default EditCommunity;
