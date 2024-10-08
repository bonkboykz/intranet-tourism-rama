// CreateCommunity.jsx
import React, { useState } from "react";
// import axios from 'axios';

function Header({ title }) {
    return (
        <header className="flex gap-5 items-start self-center px-5 w-full text-2xl font-bold text-center max-w-[358px] text-neutral-800">
            <h1 className="flex-auto mt-3">{title}</h1>
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7b77c09253656a3ffc8bb24077e80b9ca09c898cab83d812d65377e8cd246b40?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&"
                alt=""
                className="shrink-0 w-6 aspect-square"
            />
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
                className="flex justify-center items-center px-16 py-12 bg-gray-200 rounded-xl cursor-pointer"
                onClick={handleClick}
            >
                <img
                    loading="lazy"
                    src={src}
                    alt={alt}
                    className="aspect-square w-[58px]"
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
        <div className="flex gap-4 self-stretch mt-5 text-neutral-800">
            <img
                loading="lazy"
                src={src}
                alt=""
                className="shrink-0 aspect-square w-[42px]"
            />
            <div className="flex flex-col grow shrink-0 self-start mt-1.5 basis-0 w-fit">
                <p className="text-lg font-bold">{name}</p>
                <p className="mt-2.5 text-sm">{role}</p>
            </div>
        </div>
    );
}

function Card({
    title,
    imgSrc,
    imgAlt,
    user,
    type,
    description,
    addAdmin,
    invitePeople,
    cancelText,
    createText,
    onCancel,
}) {
    const [communityName, setCommunityName] = useState("");
    const [imageSrc, setImageSrc] = useState(imgSrc);
    const [selectedType, setSelectedType] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [adminName, setAdminName] = useState("");
    const [inviteName, setInviteName] = useState("");

    const handleImageChange = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        const data = {
            name: communityName,
            banner: imageSrc,
            description: communityDescription,
            type: selectedType,
            created_by: user.name,
            updated_by: user.name,
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(
                "/api/communities/communities",
                options
            );
            if (!response.ok) {
                throw new Error("Failed to create community");
            }
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error("Error creating community:", error);
        }
    };

    return (
        <section className="flex flex-col py-2.5 bg-white rounded-xl shadow-sm max-w-[442px]">
            <Header title={title} />
            <div className="flex flex-col items-center px-6 mt-3 w-full">
                <Avatar
                    src={imageSrc}
                    alt={imgAlt}
                    onImageChange={handleImageChange}
                />
                <input
                    type="text"
                    placeholder="Community name"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    className="self-stretch mt-7 text-3xl font-extrabold text-neutral-800 border-transparent"
                />
                <UserInfo name={user.name} role={user.role} src={user.src} />
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="flex gap-5 justify-between items-start px-4 py-7 mt-5 text-base font-semibold whitespace-nowrap rounded-md border border-solid border-neutral-300 text-neutral-500 cursor-pointer w-full"
                >
                    <option value="">Select Type</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <input
                    type="text"
                    placeholder={description}
                    value={communityDescription}
                    onChange={(e) => setCommunityDescription(e.target.value)}
                    className="justifycenter itemsstart px-3.5 py-7 mt-4 max-w-full text-base font-semibold whitespace-nowrap text-neutral-500 w-[383px] rounded-md border border-solid border-neutral-300"
                />
                <input
                    type="text"
                    placeholder={addAdmin}
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="justifycenter itemsstart px-3.5 py-7 mt-5 max-w-full text-base font-semibold bg-white text-neutral-500 w-[383px] rounded-md border border-solid border-neutral-300"
                />
                <input
                    type="text"
                    placeholder={invitePeople}
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="justifycenter itemsstart px-3.5 py-7 mt-5 max-w-full text-base font-semibold rounded-md text-neutral-500 w-[383px] rounded-md border border-solid border-neutral-300"
                />
                <div className="flex gap-5 justify-between self-end mt-12 text-sm text-center whitespace-nowrap">
                    <button
                        className="my-auto font-semibold text-neutral-800"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="justify-center px-7 py-4 font-bold text-white bg-secondary rounded-3xl"
                        onClick={handleSubmit}
                    >
                        {createText}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default function CreateCommunity({ onCancel }) {
    const user = {
        name: "Aisyah binte Musa",
        role: "Admin",
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/336116b2c015d4234b019c5e8ecf65be0d5d967c671f2fbd3512d78d09d2f956?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&",
    };

    return (
        <Card
            title="Tourism Malaysia"
            imgSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/6f8e3479de331781a2f10c0ab889344565741f0340528db3a07d68a166a8dee4?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&"
            imgAlt="Community Logo"
            user={user}
            type="Type"
            description="Description"
            addAdmin="Add Admin"
            invitePeople="Invite People"
            cancelText="Cancel"
            createText="Create"
            onCancel={onCancel}
        />
    );
}
