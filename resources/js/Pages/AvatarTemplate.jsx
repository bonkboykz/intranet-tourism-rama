import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { CircleXIcon } from "lucide-react";

import { AvatarTemplateTable } from "@/Components/Settings/AvatarTemplate/Table.jsx";

function Header({ title }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
        </div>
    );
}

function Avatar({ src, alt, onImageChange }) {
    const handleClick = () => {
        document.getElementById("avatarInput").click();
    };

    return (
        <div className="flex flex-col items-center">
            <div
                className="relative flex items-center justify-center bg-gray-200 cursor-pointer rounded-xl w-[400px] h-[300px]"
                onClick={handleClick}
            >
                <img
                    loading="lazy"
                    src={src}
                    alt={alt}
                    className="aspect-square w-[400px] h-[300px] rounded-xl border-4 border-gray-200 object-cover object-center"
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

function DeleteAvatarPopup({
    title,
    deleteText,
    cancelText,
    onDelete,
    onCancel,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="w-full max-w-sm p-4 bg-white shadow-lg rounded-2xl">
                <div className="flex justify-center items-center">
                    <Header title={title} />
                </div>

                <div className="w-[300px] mx-auto flex justify-center space-x-2">
                    <button
                        onClick={onDelete}
                        className="w-full px-4 py-2 text-white bg-secondary rounded-full hover:bg-secondary-hover"
                    >
                        {deleteText}
                    </button>

                    <button
                        onClick={onCancel}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-500 rounded-full hover:bg-gray-500 hover:text-white"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}

function TemplateCard({
    title,
    imgSrc,
    imgAlt,
    cancelText,
    saveText,
    onCreate,
    onCancel,
}) {
    const [newAvatarTemplateText, setNewAvatarTemplateText] = useState("");
    const [imageBlob, setImageBlob] = useState(null);
    const [imageSrc, setImageSrc] = useState(imgSrc);

    const handleImageChange = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
        setImageBlob(file);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", newAvatarTemplateText);
        formData.append("is_enabled", 1);
        if (imageBlob) {
            formData.append("background", imageBlob);
        }

        try {
            const response = await axios.post(
                "/api/avatar-templates",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to create birthday template");
            }
            onCreate(response.data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to create birthday template", {
                icon: <CircleXIcon className="w-6 h-6 text-white" />,
                theme: "colored",
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
                <Header title={title} />
                <div className="mb-4">
                    <Avatar
                        src={imageSrc}
                        alt={imgAlt}
                        onImageChange={handleImageChange}
                    />
                </div>

                <input
                    type="text"
                    className="w-full p-2 mb-4 border rounded-full pl-4"
                    placeholder="Add name"
                    value={newAvatarTemplateText}
                    onChange={(e) => setNewAvatarTemplateText(e.target.value)}
                />

                <div className="flex flex-col items-center space-y-2">
                    <button
                        onClick={handleSubmit}
                        className="w-full px-4 py-2 text-white bg-primary rounded-full hover:bg-primary-hover"
                    >
                        {saveText}
                    </button>

                    <button
                        onClick={onCancel}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-500 rounded-full hover:bg-gray-500 hover:text-white"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}

const AvatarTemplate = () => {
    const [avatarTemplate, setAvatarTemplate] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [deleteTemplateId, setDeleteTemplateId] = useState(null);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    const fetchAvatars = async () => {
        try {
            const response = await axios.get("/api/avatar-templates");
            const data = response.data.data.map((template) => ({
                ...template,
                background: template.background.includes("assets")
                    ? template.background
                    : `/storage/${template.background}`,
            }));
            setAvatarTemplate(data);
        } catch (error) {
            console.error("Failed to fetch avatars:", error);
        }
    };

    const handleSwitchChange = (template) => {
        axios
            .put(`/api/avatar-templates/${template.id}/toggle-enabled`)
            .then(fetchAvatars);
    };

    useEffect(() => {
        fetchAvatars();
    }, []);

    const handleNewTemplate = () => {
        fetchAvatars();
        setIsPopupOpen(false);
    };

    const handleDelete = async () => {
        try {
            const url = `/api/avatar-templates/${deleteTemplateId}`;

            const response = await axios.delete(url);

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Network response was not ok");
            }
            // setBirthdayTemplates((prevState) =>
            //     prevState.filter((template) => template.id !== deleteTemplateId)
            // );
            fetchAvatars();
            setIsDeletePopupOpen(false); // Close the popup after deletion
        } catch (e) {
            console.error(e);
        }
    };

    const openDeletePopup = (templateId) => {
        setDeleteTemplateId(templateId);
        setIsDeletePopupOpen(true);
        // Можете открыть модальное окно здесь, например, с setState или с помощью состояния
    };
    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[844px]">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-primary mb-8">
                    Enable/Disable Avatar Templates
                </h2>
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="px-2 py-2 font-bold text-white bg-primary rounded-full hover:bg-primary-hover mb-8"
                >
                    Add New Template
                </button>
            </div>
            <AvatarTemplateTable
                isDeletePopupOpen={openDeletePopup}
                handleSwitchChange={handleSwitchChange}
                avatarTemplates={avatarTemplate}
            />

            {isDeletePopupOpen && (
                <DeleteAvatarPopup
                    title="Delete Template?"
                    deleteText="Yes"
                    cancelText="No"
                    onDelete={handleDelete}
                    onCancel={() => setIsDeletePopupOpen(false)}
                />
            )}

            {isPopupOpen && (
                <TemplateCard
                    title="Create New Avatar Template"
                    saveText="Save"
                    imgSrc="/assets/uploadAnImage.svg"
                    cancelText="Cancel"
                    onCancel={() => setIsPopupOpen(false)}
                    onCreate={handleNewTemplate}
                />
            )}
        </section>
    );
};

export default AvatarTemplate;
