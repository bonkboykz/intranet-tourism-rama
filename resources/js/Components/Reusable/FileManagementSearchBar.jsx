import React, { useState } from "react";

import { useCsrf } from "@/composables";

import "./css/FileManagementSearchBar.css";
import "./css/General.css";

const SearchFile = ({ onSearch, userId, requiredData, onFileUploaded }) => {
    const [nameSearchTerm, setNameSearchTerm] = useState("");
    const [authorSearchTerm, setAuthorSearchTerm] = useState("");
    const [file, setFile] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [newFilename, setnewFilename] = useState("");
    const [tags, setTags] = useState([]);
    const csrfToken = useCsrf();

    // Handle search term change for name
    const handleNameSearchChange = (e) => {
        const term = e.target.value;
        setNameSearchTerm(term);
        onSearch(term, "name"); // передаем тип фильтра
    };

    // Handle search term change for author
    const handleAuthorSearchChange = (e) => {
        const term = e.target.value;
        setAuthorSearchTerm(term);
        onSearch(term, "author"); // передаем тип фильтра
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setnewFilename(selectedFile.name);
        setShowPopup(true);
        event.target.value = null;
    };

    const handleFileUpload = async () => {
        if (!file || !newFilename.trim()) return;

        const renamedFile = new File([file], newFilename.trim(), {
            type: file.type,
        });

        const formData = new FormData();
        formData.append("user_id", userId); // Assuming userId is accessible within this component
        formData.append("type", "files");
        formData.append("visibility", "public");
        formData.append("tag", JSON.stringify(tags));
        formData.append("attachments[0]", renamedFile);

        try {
            const response = await fetch("/api/posts/posts", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                    "X-CSRF-Token": csrfToken, // Assuming csrfToken is available in your component
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Call onFileUploaded callback if provided to notify the parent component about the upload
            if (onFileUploaded) {
                onFileUploaded(file);
            }

            // Clear file selection and close popup
            setFile(null);
            setnewFilename("");
            setShowPopup(false);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
        window.location.reload(); // Reload the page
    };

    const handleFileDelete = () => {
        setFile(null);
        setShowPopup(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleFileUpload();
        }
    };

    const CancelButton = ({ onClick }) => (
        <button
            className="self-end px-6 py-2 font-bold text-gray-400 bg-white hover:bg-gray-400 hover:text-white rounded-full border-2 border-gray-400"
            onClick={onClick}
        >
            Cancel
        </button>
    );

    return (
        <div className="staff-search-bar-container max-w-[1100px] p-4 bg-white rounded-2xl shadow-custom mb-5 sm:left">
            <div className="file-search-bar-title -mt-1">
                <h2>Search Files</h2>
            </div>
            <div className="file-search-bar gap-4">
                <input
                    type="text"
                    className="text-md px-6 bg-gray-100 border-gray-100 rounded-full flex-grow w-full py-3"
                    placeholder="Search by file name"
                    value={nameSearchTerm}
                    onChange={handleNameSearchChange}
                />
                <input
                    type="text"
                    className="text-md px-6 bg-gray-100 border-gray-100 rounded-full flex-grow w-full py-3"
                    placeholder="Search by file author"
                    value={authorSearchTerm}
                    onChange={handleAuthorSearchChange}
                />

                <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                    <input
                        type="file"
                        id="file-upload"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.mp3,.csv,.css,.js,.html"
                    />
                    {/* <div className="flex items-center bg-primary hover:bg-primary-hover px-4 py-2 max-md:px-5 max-md:py-0 h-full rounded-full ml-3 mr-2">
                        <img
                            src="/assets/plus.svg"
                            alt="add new file"
                            className="w-5 h-5 max-md:w-12 max-md:h-12"
                        />
                    </div> */}
                </label>
            </div>
            {showPopup && (
                <div className="file-popup px-4">
                    <div className="file-popup-content rounded-3xl w-[400px] max-sm:w-full max-md:mx-4">
                        <div className="popup-header">
                            <h2 className="mb-4 text-2xl font-bold flex justify-start">
                                Upload file
                            </h2>
                        </div>
                        <div className="popup-body">
                            <div className="flex justify-start">
                                <p className="font-bold mb-2 items-start">
                                    Selected file:
                                </p>
                            </div>
                            <div className="flex justify-start w-full px-4 py-2 rounded-md overflow-hidden">
                                <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    {file ? file.name : "No file selected"}
                                </p>
                            </div>
                            <div className="flex justify-start mt-4">
                                <label className="font-bold">
                                    Rename file:
                                </label>
                            </div>
                            <input
                                type="text"
                                value={newFilename}
                                onChange={(e) => setnewFilename(e.target.value)}
                                onKeyDown={handleKeyDown} // Attach onKeyDown handler
                                className="w-full px-4 py-2 mt-1 border-2 border-gray-400 rounded-md"
                                placeholder="Enter new file name"
                            />
                            <div className="flex flex-row justify-end mt-4 space-x-0">
                                <CancelButton onClick={handleFileDelete} />{" "}
                                {/* Add CancelButton with onClick handler */}
                                <button
                                    onClick={handleFileUpload}
                                    className="upload-btn font-bold bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchFile;
