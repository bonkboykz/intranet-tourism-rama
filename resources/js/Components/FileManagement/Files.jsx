import React, { useEffect, useRef, useState } from "react";

import { useCsrf } from "@/composables";

import Pagination from "../Paginator";
import PopupContent from "../Reusable/PopupContent";

const excludedExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "tiff",
    "webp",
    "mp4",
];

const FileTable = ({ searchTerm }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null); // For managing admin
    const [isSaving, setIsSaving] = useState(false); // State to track saving status
    const [showPopup, setShowPopup] = useState(false); // State to track popup visibility
    const csrfToken = useCsrf();
    const inputRef = useRef(null);

    const fetchFiles = async () => {
        try {
            let currentPage = 1;
            let totalPages = 1;
            let allFilesData = [];

            while (currentPage <= totalPages) {
                const response = await fetch(
                    `/api/resources/resources?with[]=author&page=${currentPage}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch files");
                }
                const responseData = await response.json();
                console.log("RESPONSEDATA", responseData);

                if (!Array.isArray(responseData.data?.data)) {
                    console.error(
                        "Expected an array of files, but received:",
                        responseData.data?.data
                    );
                    setLoading(false);
                    return;
                }

                const filesData = responseData.data.data.map((file) => ({
                    ...file,
                    uploader: file.author.name, // Assuming the API provides an 'uploader' field with the uploader's name
                    metadata:
                        typeof file.metadata === "string"
                            ? JSON.parse(file.metadata)
                            : file.metadata,
                }));

                // Accumulate all files data across pages
                allFilesData = [...allFilesData, ...filesData];

                // Determine the total number of pages
                totalPages = responseData.data.last_page;
                currentPage++;
            }

            // Sort files by the `created_at` date in descending order (newest first)
            allFilesData.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            setFiles(allFilesData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching files:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setEditingIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const filteredFiles = files.filter((file) => {
        const metadata = file.metadata || {};
        const fileExtension = metadata.extension
            ? metadata.extension.toLowerCase()
            : "";
        const fileName = metadata.original_name
            ? metadata.original_name.toLowerCase()
            : "";

        const isExcluded = excludedExtensions.includes(fileExtension);

        return !isExcluded && fileName.includes(searchTerm.toLowerCase());
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

    // const handleRename = async (index, newName) => {
    //     const fileToRename = files[index];
    //     if (!fileToRename || !fileToRename.id) {
    //         console.error("File ID is missing.");
    //         return;
    //     }

    //     console.log("FILE ID", fileToRename.id);

    //     // Create updated metadata object with the new name
    //     const updatedMetadata = {
    //         ...fileToRename.metadata,
    //         original_name: newName,
    //     };

    //     // Convert updatedMetadata to a JSON string
    //     const metadataString = JSON.stringify(updatedMetadata);

    //     // Create payload with the metadata as a JSON string
    //     const payload = {
    //         metadata: metadataString, // Ensure this is a string
    //     };

    //     // Prepare API request
    //     const url = `/api/resources/resources/${fileToRename.id}`;
    //     const options = {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Accept: "application/json",
    //             "X-CSRF-Token": csrfToken,
    //         },
    //         body: JSON.stringify(payload),
    //     };

    //     try {
    //         const response = await fetch(url, options);
    //         if (!response.ok) {
    //             const responseBody = await response.text();
    //             console.error("Failed to rename file:", responseBody);
    //             throw new Error(
    //                 `Failed to rename file: ${response.statusText}`
    //             );
    //         }

    //         console.log("File renamed successfully.");
    //         await fetchFiles(); // Refresh file list after renaming
    //     } catch (error) {
    //         console.error("Error renaming file:", error);
    //     } finally {
    //         setEditingIndex(null); // Clear editing state
    //     }
    // };

    const handleRename = async (index, newName) => {
        setIsSaving(true);
        const fileToRename = files[index];
        if (!fileToRename || !fileToRename.id) {
            console.error("File ID is missing.");
            return;
        }

        const updatedMetadata = {
            ...fileToRename.metadata,
            original_name: newName,
        };

        const payload = {
            metadata: JSON.stringify(updatedMetadata),
        };

        const url = `/api/resources/resources/${fileToRename.id}`;
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify(payload),
        };

        try {
            setIsSaving(true); // Start the saving state

            const response = await fetch(url, options);
            if (!response.ok) {
                const responseBody = await response.text();
                console.error("Failed to rename file:", responseBody);
                throw new Error(
                    `Failed to rename file: ${response.statusText}`
                );
            }

            // Fetch the updated list of files after successful rename
            await fetchFiles();
            console.log("File renamed successfully.");
        } catch (error) {
            console.error("Error renaming file:", error);
        } finally {
            setIsSaving(false); // Stop the saving state once the process is complete
            setEditingIndex(null); // Clear editing state
        }
    };

    const SavingPopup = ({ isSaving }) => {
        return isSaving ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex items-center">
                        <div
                            className="loader spinner-border mr-4"
                            role="status"
                        ></div>
                        <span>Saving...</span>
                    </div>
                </div>
            </div>
        ) : null;
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Enter") {
            handleRename(index, editingName);
        }
    };

    const handleDelete = async (fileId, index) => {
        const url = `/api/crud/resources/${fileId}`;
        const options = {
            method: "DELETE",
            headers: { Accept: "application/json", "X-CSRF-Token": csrfToken },
        };

        const startEditing = (index, currentName) => {
            setEditingIndex(index);
            setEditingName(currentName);
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log("Delete response:", data);
        } catch (error) {
            console.error("Error deleting file:", error);
        }
        window.location.reload(); // Reload the page
    };

    const startEditing = (index, currentName) => {
        setEditingIndex(index);
        setEditingName(currentName);
    };

    const saveEditing = (index) => {
        handleRename(index, editingName);
    };

    return (
        <div className="w-full overflow-visible">
            <SavingPopup isSaving={isSaving} />
            <div className="flow-root mt-8">
                <div className="overflow-visible">
                    <table className="w-full p-4 bg-white border-separate table-fixed rounded-2xl shadow-custom border-spacing-1">
                        <thead>
                            <tr>
                                <th className="w-1/3 md:w-3/4 lg:w-3/4 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm max-md:text-xs font-semibold text-blue-500 sm:pl-1 shadow-custom">
                                    File Name
                                </th>
                                <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 max-md:px-0 text-center text-sm max-md:text-xs font-semibold text-blue-500 shadow-custom">
                                    Uploaded By
                                </th>
                                <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 max-md:px-0 text-center text-sm max-md:text-xs font-semibold text-blue-500 shadow-custom">
                                    Date Created
                                </th>
                                <th className="w-1/12 relative py-3.5">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-center divide-y-reverse rounded-full divide-neutral-300 mt-1">
                            {files.map((item, index) => {
                                const metadata = item.metadata || {};
                                const isEditing = editingIndex === index;

                                console.log("METADATA", metadata);

                                return (
                                    <tr key={index}>
                                        <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-2 text-sm text-neutral-800 sm:pl-1 text-left overflow-hidden text-ellipsis">
                                            {isEditing ? (
                                                <div
                                                    ref={inputRef}
                                                    className="flex items-center"
                                                >
                                                    <input
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) =>
                                                            setEditingName(
                                                                e.target.value
                                                            )
                                                        }
                                                        onBlur={() =>
                                                            handleRename(
                                                                index,
                                                                editingName
                                                            )
                                                        }
                                                        onKeyDown={(e) =>
                                                            handleKeyDown(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                        className="text-sm text-neutral-800 text-opacity-80 mt-1 block w-full rounded-full p-2 border-2 border-stone-300 max-md:ml-4 overflow-hidden text-ellipsis"
                                                    />

                                                    <button
                                                        onClick={() =>
                                                            handleRename(
                                                                index,
                                                                editingName
                                                            )
                                                        }
                                                        className="ml-2 text-blue-500"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="text-sm font-bold mt-1 block w-full rounded-md py-2 border-2 border-transparent text-neutral-800 text-opacity-80 overflow-hidden text-ellipsis"
                                                    onDoubleClick={() =>
                                                        startEditing(
                                                            index,
                                                            metadata.original_name
                                                        )
                                                    }
                                                >
                                                    {metadata.original_name ||
                                                        "Unknown"}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-4 overflow-hidden text-sm border-b border-r border-neutral-300 whitespace-nowrap text-neutral-800 text-center text-ellipsis">
                                            {item.uploader || "Unknown"}
                                        </td>
                                        <td className="px-3 py-4 overflow-hidden text-sm border-b border-r border-neutral-300 whitespace-nowrap text-neutral-800 text-ellipsis">
                                            {new Date(
                                                item.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="relative mt-6 flex">
                                            <PopupContent
                                                file={item}
                                                onRename={() =>
                                                    startEditing(
                                                        indexOfFirstItem +
                                                            index,
                                                        metadata.original_name
                                                    )
                                                }
                                                onDelete={handleDelete}
                                                onFileSelect={setSelectedFile}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredFiles.length}
                        itemsPerPage={itemsPerPage}
                        paginate={setCurrentPage}
                        // onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default FileTable;
