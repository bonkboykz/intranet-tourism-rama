import React, { useEffect, useState } from "react";
import Stories from "react-insta-stories";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

const CreateImageStory = ({ file, onClose, onPostStory, userId, onGoBack }) => {
    const [image, setImage] = useState(null);
    const [text, setText] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setImage(file);
        }
    }, [file]);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (image && image.size > 30 * 1024 * 1024) {
            toast.error("File size exceeds 30MB!");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("type", "story");
        formData.append("visibility", "public");
        formData.append("content", text || ""); // Ensure text is a string
        formData.append("tag", JSON.stringify([]));

        if (image) {
            formData.append("attachments[0]", image);
        }

        try {
            const response = await axios.post("/api/posts/posts", formData);

            if ([200, 201, 204].includes(response.status)) {
                const newStory = {
                    src: URL.createObjectURL(file),
                    alt: "New Story",
                    timestamp: Date.now(),
                    caption: text,
                    user_id: userId,
                    viewed: false,
                };
                onPostStory(newStory);
            } else {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="create-story-modal px-0 py-6 rounded-2xl">
            <ToastContainer />
            <h2 className="mt-0 mb-4 max-md:mb-0 font-bold text-lg md:text-2xl">
                Create a story
            </h2>
            <hr className="border-t border-gray-200 mb-4 " />

            <div className="flex flex-col md:flex-row md:space-x-10">
                <div className="flex justify-center items-center mt-6 max-md:mt-2 max-md:mb-4 md:mt-0 md:w-1/2">
                    {previewUrl && (
                        <div className="image-preview relative">
                            <Stories
                                stories={[
                                    { url: previewUrl, type: "image", text },
                                ]}
                                defaultInterval={1500}
                                width={300}
                                height={460}
                                storyStyles={{
                                    width: "300px",
                                }}
                                style={{
                                    borderRadius: "8px",
                                    objectFit: "cover",
                                }}
                            />
                            <div className="text-overlay absolute bottom-0 left-0 w-full p-4 text-white bg-black bg-opacity-50">
                                <p>{text}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:w-1/2">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="flex items-center mb-4">
                                <img
                                    src="/assets/AaIcon.svg"
                                    alt="Add text"
                                    className="w-10"
                                />
                                <label
                                    htmlFor="text"
                                    className="ml-2 text-sm md:text-base font-bold"
                                >
                                    Add caption
                                </label>
                            </div>
                            <textarea
                                id="text"
                                value={text}
                                onChange={handleTextChange}
                                placeholder="Enter caption"
                                className="w-full h-24 max-md:h-auto p-2 border border-gray-300 rounded-md resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-2 my-4">
                            <button
                                type="button"
                                className="w-full py-2 max-md:py-0 max-md:mb-2 px-4 font-bold border-2 text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white rounded-full"
                                onClick={onGoBack}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full py-2 max-md:py-2 px-4 font-bold bg-primary hover:bg-primary-hover text-white rounded-full mb-2 md:mb-0"
                            >
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateImageStory;
