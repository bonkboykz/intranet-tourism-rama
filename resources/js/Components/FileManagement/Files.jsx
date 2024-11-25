import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { CircleXIcon } from "lucide-react";

import { useCsrf } from "@/composables";
import { useUser } from "@/Layouts/useUser";
import { CommunityContext } from "@/Pages/CommunityContext";
import { DepartmentContext } from "@/Pages/DepartmentContext";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import { FileRow } from "./FileRow";

const excludedExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "tiff",
    "webp",
    "mp4",
    "mov",
];

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

const itemsPerPage = 8;

const FileTable = ({
    searchTerm: currentSearchTerm,
    communityId,
    departmentId,
    userId,
    isManagement,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null); // For managing admin
    const [isSaving, setIsSaving] = useState(false); // State to track saving status
    const [showPopup, setShowPopup] = useState(false); // State to track popup visibility
    const csrfToken = useCsrf();
    const inputRef = useRef(null);

    const searchTerm = useDebounce(currentSearchTerm, 500);

    useEffect(() => {
        setCurrentPage(1);
        setTotalPages(1);

        fetchFiles();
    }, [searchTerm]);

    useEffect(() => {
        setEditingIndex(null);
        setEditingName("");
        fetchFiles();
    }, [currentPage]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const newFilter = [];

            // Check if searchTerm is provided and not empty
            if (searchTerm && searchTerm.trim() !== "") {
                const metadataFields = [
                    "extension",
                    "original_name",
                    "mime_type",
                ];

                // Add filters for metadata fields and user.name
                metadataFields.forEach((subfield) => {
                    newFilter.push({
                        field: "metadata",
                        subfield,
                        type: "ilike",
                        value: searchTerm,
                    });
                });

                newFilter.push({
                    field: "user",
                    subfield: "name",
                    type: "ilike",
                    value: searchTerm,
                });
            }

            // Exclude specified extensions
            newFilter.push({
                field: "metadata",
                subfield: "extension",

                type: "not_in",
                value: excludedExtensions,
            });

            // Add community, department, and user-specific filters if they exist
            if (communityId) {
                newFilter.push({
                    field: "attachable.community_id",
                    type: "=",
                    value: communityId,
                });
            }

            if (departmentId) {
                newFilter.push({
                    field: "attachable.department_id",
                    type: "=",
                    value: departmentId,
                });
            }

            if (userId) {
                newFilter.push({
                    field: "user_id",
                    type: "=",
                    value: userId,
                });
            }

            // Fetch data with the combined filters
            const response = await axios.get(
                `/api/resources/public-resources`,
                {
                    params: {
                        isManagement,
                        page: currentPage,
                        perpage: itemsPerPage,
                        searchTerm: searchTerm.trim(), // Pass searchTerm to backend
                        filter: [
                            {
                                field: "metadata",
                                subfield: "extension",
                                type: "not_in",
                                value: excludedExtensions,
                            },
                            ...newFilter,
                        ].filter(Boolean), // Remove any empty filters
                    },
                }
            );

            // Process response data
            const {
                data: { last_page, data },
            } = response.data;
            const filesData = data.map((file) => ({
                ...file,
                uploader: file.user.name,
                metadata:
                    typeof file.metadata === "string"
                        ? JSON.parse(file.metadata)
                        : file.metadata,
            }));

            setTotalPages(last_page);
            setFiles(filesData);
        } catch (error) {
            console.error("Error fetching files:", error);
            toast.error("Failed to fetch files", {
                icon: <CircleXIcon className="w-6 h-6 text-white" />,
                theme: "colored",
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchFiles();
    }, []);

    const { hasRole } = usePermissions();
    const { isAdmin: isCommunityAdmin } = useContext(CommunityContext);
    const { isAdmin: isDepartmentAdmin } = useContext(DepartmentContext);

    const { user } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    // const filteredFiles = files.filter((file) => {
    //     const metadata = file.metadata || {};
    //     const fileExtension = metadata.extension
    //         ? metadata.extension.toLowerCase()
    //         : "";
    //     const fileName = metadata.original_name
    //         ? metadata.original_name.toLowerCase()
    //         : "";

    //     const isExcluded = excludedExtensions.includes(fileExtension);

    //     return !isExcluded && fileName.includes(searchTerm.toLowerCase());
    // });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);
    // const currentItems = files;

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

        const url = `/api/resources/resources/${fileToRename.id}/rename`;
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({
                original_name: newName,
            }),
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

            toast.success("File renamed successfully", {
                theme: "colored",
            });
        } catch (error) {
            console.error("Error renaming file:", error);
        } finally {
            setIsSaving(false); // Stop the saving state once the process is complete
            setEditingIndex(null); // Clear editing state
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Enter") {
            handleRename(index, editingName);
        }
    };

    const handleDelete = async (fileId, index) => {
        const url = `/api/crud/resources/${fileId}`;

        // const startEditing = (index, currentName) => {
        //     setEditingIndex(index);
        //     setEditingName(currentName);
        // };

        try {
            const response = await axios.delete(url);
            const data = response.data;
            console.log("Delete response:", data);

            window.location.reload(); // Reload the page
        } catch (error) {
            console.error("Error deleting file:", error);
        }
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
                <div className="max-h-auto max-w-[1100px] overflow-auto p-4 rounded-2xl bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] border-separate table-fixed rounded-2xl shadow-custom border-spacing-1">
                            <thead>
                                <tr>
                                    <th className="w-1/3 md:w-3/4 lg:w-3/4 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm max-md:text-xs font-semibold text-primary sm:pl-1 shadow-custom">
                                        File Name
                                    </th>
                                    <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 max-md:px-0 text-center text-sm max-md:text-xs font-semibold text-primary shadow-custom">
                                        Uploaded By
                                    </th>
                                    <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 max-md:px-0 text-center text-sm max-md:text-xs font-semibold text-primary shadow-custom">
                                        Date Created
                                    </th>
                                    <th className="w-1/6 relative py-3.5 ">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-center divide-y-reverse rounded-full divide-neutral-300 mt-1">
                                {files.map((item, index) => {
                                    const canEdit =
                                        hasRole("superadmin") ||
                                        isCommunityAdmin ||
                                        isDepartmentAdmin ||
                                        item.user.id === user.id;

                                    const isEditing = editingIndex === index;

                                    return (
                                        <FileRow
                                            key={item.id}
                                            item={item}
                                            canEdit={canEdit}
                                            isEditing={isEditing}
                                            onStartEditing={startEditing}
                                            onSaveEditing={saveEditing}
                                            setEditingName={setEditingName}
                                            onKeyDown={handleKeyDown}
                                            index={index}
                                            editingName={editingName}
                                            indexOfFirstItem={indexOfFirstItem}
                                            onRename={handleRename}
                                            onDelete={() =>
                                                handleDelete(item.id, index)
                                            }
                                            onFileSelect={setSelectedFile}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        paginate={setCurrentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, paginate, hasNextButton }) => {
    // Generate pagination numbers
    const getPaginationNumbers = () => {
        const pages = new Set();

        // Always include the first and last pages
        pages.add(1);
        pages.add(totalPages);

        // Add the previous page if it exists
        if (currentPage > 1) {
            pages.add(currentPage - 1);
        }

        // Add the current page
        pages.add(currentPage);

        // Add the next page if it exists
        if (currentPage < totalPages) {
            pages.add(currentPage + 1);
        }

        // Convert to sorted array
        return Array.from(pages).sort((a, b) => a - b);
    };

    const paginationNumbers = getPaginationNumbers();

    return (
        <div
            className="py-3 flex w-full max-w-full overflow-x-auto whitespace-nowrap"
            style={{
                justifyContent: "safe center",
            }}
        >
            {hasNextButton && (
                <button
                    disabled={!hasNextButton.prev_page_url}
                    onClick={() => paginate(currentPage - 1)}
                    className={`px-2 py-1 mx-1 rounded-lg ${
                        hasNextButton.prev_page_url
                            ? "text-primary"
                            : "text-gray-400"
                    }`}
                >
                    PREV
                </button>
            )}

            {paginationNumbers.map((number, index, arr) => (
                <React.Fragment key={index}>
                    <button
                        onClick={() => paginate(number)}
                        className={`px-2 py-1 mx-1 rounded-lg ${
                            currentPage === number
                                ? "bg-blue-200 text-primary"
                                : "bg-white text-primary"
                        }`}
                        style={{ minWidth: "32px" }}
                    >
                        {number}
                    </button>

                    {/* Add ellipsis between non-consecutive pages */}
                    {index < arr.length - 1 && arr[index + 1] > number + 1 && (
                        <span className="px-2 text-gray-400">...</span>
                    )}
                </React.Fragment>
            ))}

            {hasNextButton && (
                <button
                    disabled={!hasNextButton.next_page_url}
                    onClick={() => paginate(currentPage + 1)}
                    className={`px-2 py-1 mx-1 rounded-lg ${
                        hasNextButton.next_page_url
                            ? "text-primary"
                            : "text-gray-400"
                    }`}
                >
                    NEXT
                </button>
            )}
        </div>
    );
};

export default FileTable;
