import React, { useState, useEffect } from "react";
import axios from "axios";
import Stories from "react-insta-stories";

import "./styles.css";

const CreateImageStory = ({ file, onClose, onPostStory, userId, onGoBack }) => {
    const [image, setImage] = useState(null); // State to store the uploaded image file
    const [text, setText] = useState(""); // State to store the text input
    const [previewUrl, setPreviewUrl] = useState(""); // State to store the preview URL of the image

    useEffect(() => {
        if (file) {
            const reader = new FileReader(); // Create a new FileReader to read the uploaded file
            reader.onloadend = () => {
                setPreviewUrl(reader.result); // Set the preview URL once the file is read
            };
            reader.readAsDataURL(file); // Read the file as a data URL
            setImage(file); // Set the image file state
        }
    }, [file]); // Run this effect when the `file` changes

    const handleTextChange = (e) => {
        setText(e.target.value); // Update the text state on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        const formData = new FormData(); // Create a new FormData object to send the form data

        if (!text) {
            formData.append("user_id", userId); // Append user ID to the form data
            formData.append("type", "story"); // Append type to the form data
            formData.append("visibility", "public"); // Append visibility to the form data
            formData.append("tag", JSON.stringify([])); // Append an empty array for tags

            if (image) {
                formData.append("attachments[0]", image); // Append the image file to the form data
            }
        } else {
            formData.append("user_id", userId); // Append user ID to the form data
            formData.append("type", "story"); // Append type to the form data
            formData.append("visibility", "public"); // Append visibility to the form data
            formData.append("content", text); // Append text content to the form data
            formData.append("tag", JSON.stringify([])); // Append an empty array for tags

            if (image) {
                formData.append("attachments[0]", image); // Append the image file to the form data
            }
        }

        try {
            const response = await axios.post("/api/posts/posts", formData);

            if ([200, 201, 204].includes(response.status)) {
                console.log("Story posted successfully"); // Log success message

                const newStory = {
                    src: URL.createObjectURL(file), // Create an object URL for the file
                    alt: "New Story",
                    timestamp: Date.now(), // Set the current timestamp
                    caption: text, // Set the caption text
                    user_id: userId, // Set the user ID
                    viewed: false, // Set viewed to false
                };
                onPostStory(newStory); // Call the onPostStory callback with the new story
                // window.location.reload(); // Reload the page
            } else {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error:", error); // Log any errors
        }
    };

    return (
        <div className="create-story-modal px-0 py-6 rounded-2xl">
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
                                className="w-full py-2 max-md:py-2 px-4 font-bold bg-blue-500 hover:bg-blue-700 text-white rounded-full mb-2 md:mb-0"
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
