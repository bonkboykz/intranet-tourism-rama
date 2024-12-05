import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { useCsrf } from "@/composables";
import { toastError } from "@/Utils/toast";

const AddTitles = () => {
    const [titles, setTitles] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [editingTitleId, setEditingTitleId] = useState(null);
    const [editingTitleName, setEditingTitleName] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [searchQuery, setSearchQuery] = useState(""); // Search query state
    const csrfToken = useCsrf();

    const fetchTitles = async (url) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json" },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            const titleData = data.data.data.map((title) => ({
                id: title.id,
                title: title.title,
            }));

            setTitles((prevTitles) => {
                const allTitles = [...prevTitles, ...titleData];
                return allTitles.sort((a, b) => a.id - b.id);
            });

            if (data.data.next_page_url) {
                fetchTitles(data.data.next_page_url);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTitles("/api/department/business_posts");
    }, []);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const createTitle = () => {
        if (newTitle.trim() === "") return;

        fetch("/api/department/business_posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({ title: newTitle }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.data) {
                    setTitles((prevTitles) => {
                        const allTitles = [...prevTitles, data.data];
                        return allTitles.sort((a, b) => a.id - b.id);
                    });
                    setNewTitle("");
                    setIsPopupOpen(false);
                    showMessage("success", "New title added successfully.");
                } else {
                    throw new Error("Failed to add new title.");
                }
            })
            .catch((error) => {
                showMessage("error", error.message);
            });
    };

    const editTitle = (id, name) => {
        setEditingTitleId(id);
        setEditingTitleName(name);
    };

    const saveTitle = () => {
        if (editingTitleName.trim() === "") return;

        fetch(`/api/department/business_posts/${editingTitleId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({ title: editingTitleName }),
        })
            .then((response) => {
                if (response.status === 204) {
                    // No content, so don't attempt to parse JSON
                    return null;
                }
                return response.json();
            })
            .then(() => {
                setTitles((prevTitles) =>
                    prevTitles.map((title) =>
                        title.id === editingTitleId
                            ? { ...title, title: editingTitleName }
                            : title
                    )
                );
                setEditingTitleId(null);
                setEditingTitleName("");
                showMessage("success", "Title edited successfully.");
            })
            .catch((error) => {
                showMessage("error", `Failed to edit title. ${error.message}`);
            });
    };

    const deleteTitle = async (id) => {
        try {
            const response = await axios.delete(
                `/api/department/business_posts/${id}`
            );

            if (![200, 204].includes(response.status)) {
                throw new Error("Failed to delete title.");
            }

            setTitles((prevTitles) =>
                prevTitles.filter((title) => title.id !== id)
            );
            toast.success("Title deleted successfully.");
        } catch (e) {
            const errorMessage =
                e.response?.data?.error ||
                e.message ||
                "An unknown error occurred.";
            toastError(errorMessage);

            console.error("Error deleting title:", e);
        }
    };

    // Filtered titles based on the search query
    const filteredTitles = titles.filter((title) =>
        title.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container p-8 mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Business Titles
                    </h1>
                    <p className="text-gray-600">
                        Manage the business titles here by adding, editing, and
                        viewing them.
                    </p>
                </div>
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="px-4 py-2 font-bold text-white bg-primary rounded-full hover:bg-primary-hover"
                >
                    Add New Title
                </button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Search titles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Message Display */}
            {message && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        className={`bg-gray-100 rounded-lg flex items-center justify-start py-4 px-8 ${
                            message.type === "success"
                                ? "font-bold text-lg bg-green-100 text-green-800  "
                                : "font-bold text-lg bg-red-100 text-red-800"
                        }`}
                    >
                        {message.text}
                    </div>
                </div>
            )}

            {/* Loading Spinner */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64 max-w-[1050px]">
                    <div className="w-16 h-16 border-b-2 border-gray-900 max-w-[1050px] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-lg shadow-md">
                    <table className="min-w-full mt-2 leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 text-sm font-bold text-left text-gray-500 uppercase bg-white">
                                    Name
                                </th>
                                <th className="px-5 py-3 bg-white"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTitles.map((title) => (
                                <tr key={title.id}>
                                    <td className="px-5 py-5 text-sm font-bold bg-white border-b border-gray-200">
                                        {editingTitleId === title.id ? (
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={editingTitleName}
                                                onChange={(e) =>
                                                    setEditingTitleName(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <span>{title.title}</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-5 text-sm text-right bg-white border-b border-gray-200">
                                        {editingTitleId === title.id ? (
                                            <button
                                                onClick={saveTitle}
                                                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        editTitle(
                                                            title.id,
                                                            title.title
                                                        )
                                                    }
                                                    className="mr-4 text-primary hover:text-blue-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-secondary"
                                                    onClick={() =>
                                                        deleteTitle(title.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Popup for adding a new title */}
            {isPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="mb-4 text-xl font-bold text-center text-gray-900">
                            Add a New Title
                        </h2>
                        <input
                            type="text"
                            placeholder="Enter title name"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={createTitle}
                                className="px-4 py-2 text-white bg-primary rounded hover:bg-primary-hover"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTitles;
