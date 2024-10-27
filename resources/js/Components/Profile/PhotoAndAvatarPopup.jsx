import * as React from "react";
import { useEffect } from "react";
import axios from "axios";

function Avatar({ src, alt, isSelected, onClick }) {
    return (
        <img
            loading="lazy"
            src={
                src
                    ? src
                    : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${alt}`
            }
            alt={alt}
            className={`shrink-0 aspect-square w-[94px] cursor-pointer hover:scale-125 transition-transform duration-300 ${
                isSelected ? "border-4 border-blue-500" : ""
            }`}
            onClick={onClick}
        />
    );
}

function PhotoAndAvatarPopup({
    onClose,
    userId,
    csrfToken,
    authToken,
    profileImage,
    setProfileImage,
    userName,
    profileId,
}) {
    const [selectedAvatar, setSelectedAvatar] = React.useState(null);
    const [avatars, setAvatars] = React.useState([]);

    // Fetch avatar templates from the server
    const fetchAvatars = async () => {
        try {
            const response = await axios.get("/api/avatar-templates");
            const data = response.data.data
                .map((item) => {
                    return {
                        ...item,
                        background: item.background.includes("/assets")
                            ? item.background
                            : `/storage/${item.background}`,
                    };
                })
                .filter((item) => item.is_enabled);

            setAvatars(data);
        } catch (error) {
            console.error("Failed to fetch avatars:", error);
        }
    };

    useEffect(() => {
        fetchAvatars();
    }, []);

    const handleAvatarClick = (avatar) => {
        setSelectedAvatar(avatar.background);
    };

    const handleSaveClick = async () => {
        if (!selectedAvatar) {
            alert("Please select an avatar to save.");
            return;
        }

        try {
            console.log("Selected avatar URL:", selectedAvatar);
            // Fetch the selected avatar image as a blob
            const response = await fetch(selectedAvatar);
            const blob = await response.blob();

            // Create a file from the blob
            const file = new File(
                [blob],
                `background.${blob.type.split("/")[1]}`,
                { type: blob.type }
            );

            const formData = new FormData();
            formData.append("image", file);
            formData.append("user_id", userId);
            formData.append("_method", "PUT");
            formData.append("name", userName);

            // Send the updated avatar data to the server
            const saveResponse = await axios.post(
                `/api/profile/profiles/${profileId}/update_profile_image`,
                formData
            );

            if ([200, 201, 204].includes(saveResponse.status)) {
                console.log("Avatar updated successfully:", saveResponse.data);
                setProfileImage(selectedAvatar);
                onClose();
            } else {
                throw new Error("Failed to update avatar. Please try again.");
            }
        } catch (error) {
            console.error("Error updating avatar:", error);
            window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 shadow-custom">
            <div
                className="p-2 rounded-3xl w-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <section className="flex flex-col py-2.5 bg-white rounded-3xl w-[700px]">
                    <div className="flex flex-col pr-2.5 pl-5 w-full">
                        <header className="flex gap-5 items-start text-2xl font-bold text-neutral-800">
                            <h1 className="flex-auto mt-4">Pick an Avatar</h1>
                        </header>
                        <div className="grid grid-cols-6 gap-3 mt-2 px-2">
                            {avatars.map((avatar) => (
                                <div
                                    className="w-[90px] h-[90px]"
                                    key={avatar.background}
                                >
                                    <Avatar
                                        src={avatar.background}
                                        alt={avatar.name}
                                        isSelected={
                                            selectedAvatar === avatar.background
                                        }
                                        onClick={() =>
                                            handleAvatarClick(avatar)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <footer className="flex gap-2.5 self-end m-4 mr-6 text-sm font-bold text-center">
                        <button
                            onClick={onClose}
                            className="bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveClick}
                            className="flex flex-col justify-center text-white"
                        >
                            <span className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full">
                                Save
                            </span>
                        </button>
                    </footer>
                </section>
            </div>
        </div>
    );
}

export default PhotoAndAvatarPopup;
