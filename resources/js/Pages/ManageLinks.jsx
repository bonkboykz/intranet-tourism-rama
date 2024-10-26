import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";

import { useCsrf } from "@/composables";
import Example from "@/Layouts/DashboardLayoutNew"; // Assuming Example is a layout component
import { toastError } from "@/Utils/toast";

import "../Components/Settings/ManageLinks.css";
import "tailwindcss/tailwind.css";

const API_URL = "/api/settings/external_links";
const urlTemplate = "/api/settings/external_links/{id}";

const Pautan = () => {
    const [apps, setApps] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentApp, setCurrentApp] = useState(null);
    const [newAppName, setNewAppName] = useState("");
    const [newAppUrl, setNewAppUrl] = useState("");
    const [urlError, setUrlError] = useState("");
    const csrfToken = useCsrf();
    const [errors, setErrors] = useState({});

    const fetchData = async () => {
        let allApps = [];
        let currentPage = 1;
        let lastPage = 1;

        try {
            while (currentPage <= lastPage) {
                const response = await fetch(`${API_URL}?page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-Token": csrfToken,
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                allApps = allApps.concat(data.data.data);
                lastPage = data.data.last_page;
                currentPage++;
            }
            const sortedAppsData = allApps
                .sort((a, b) => a.order - b.order)
                .sort((a, b) =>
                    a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                );
            setApps(sortedAppsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [csrfToken]);

    const sortAlphabetically = (apps) => {
        return apps.sort((a, b) =>
            a.label.toLowerCase().localeCompare(b.label.toLowerCase())
        );
    };

    const updateOrder = (newApps) => {
        const updatedApps = newApps.map((app, idx) => ({
            ...app,
            order: idx + 1,
        }));

        setApps(sortAlphabetically(updatedApps));

        const updatePromises = updatedApps.map((app) => {
            const updateUrl = urlTemplate.replace("{id}", app.id);
            return fetch(updateUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
                body: JSON.stringify(app),
            }).catch((error) =>
                console.error(
                    `Error updating app with id ${app.id}:`,
                    error.message
                )
            );
        });

        Promise.all(updatePromises)
            .then((results) => console.log("Order update successful", results))
            .catch((error) =>
                console.error("Error updating order:", error.message)
            );
    };

    const PautanHandleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedApps = Array.from(apps);
        const [reorderedItem] = reorderedApps.splice(result.source.index, 1);
        reorderedApps.splice(result.destination.index, 0, reorderedItem);

        updateOrder(reorderedApps);
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newApps = [...apps];
        [newApps[index - 1], newApps[index]] = [
            newApps[index],
            newApps[index - 1],
        ];

        updateOrder(newApps);
    };

    const filteredApps = apps.filter((app) => !app.label.includes("(dept)"));

    const handleMoveDown = (index) => {
        if (index === apps.length - 1) return;
        const newApps = [...apps];
        [newApps[index + 1], newApps[index]] = [
            newApps[index],
            newApps[index + 1],
        ];

        updateOrder(newApps);
    };

    const isDuplicateApp = (name, url, existingApps) => {
        const isNameDuplicate = existingApps.some((app) => app.label === name);
        const isUrlDuplicate = existingApps.some((app) => app.url === url);

        return { isNameDuplicate, isUrlDuplicate };
    };

    const isValidUrl = (url) => {
        return url.startsWith("http://") || url.startsWith("https://");
    };

    const resetForm = () => {
        setNewAppName("");
        setNewAppUrl("");
        setUrlError("");
    };

    const PautanHandleAddApp = async () => {
        const { isNameDuplicate, isUrlDuplicate } = isDuplicateApp(
            newAppName,
            newAppUrl,
            apps
        );
        if (isNameDuplicate) {
            toastError("App name already exists.");
            return;
        }

        if (isUrlDuplicate) {
            toastError("App URL already exists.");
            return;
        }

        const newApp = { label: newAppName, url: newAppUrl };

        try {
            const response = await axios.post(API_URL, newApp, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
            });
            const data = response.data;
            setApps(
                sortAlphabetically(
                    apps.map((app) => (app.id === data.id ? data : app))
                )
            );
            setIsAddModalVisible(false);
            resetForm();
        } catch (error) {
            toastError("Error adding app:", error);
        }
    };

    const PautanHandleEditApp = (app) => {
        setCurrentApp(app);
        setNewAppName(app.label);
        setNewAppUrl(app.url);
        setUrlError("");
        setIsEditModalVisible(true);
    };

    const PautanHandleUpdateApp = async () => {
        const { isNameDuplicate, isUrlDuplicate } = isDuplicateApp(
            newAppName,
            newAppUrl,
            apps
        );

        if (newAppName && isNameDuplicate && currentApp?.label !== newAppName) {
            toastError("App name already exists.");
            return;
        }

        if (newAppUrl && isUrlDuplicate && currentApp?.url !== newAppUrl) {
            toastError("App URL already exists.");
            return;
        }

        const updatedApp = {};
        if (newAppName) updatedApp.label = newAppName;
        if (newAppUrl) updatedApp.url = newAppUrl;

        const updateUrl = urlTemplate.replace("{id}", currentApp.id);

        try {
            const response = await axios.put(updateUrl, updatedApp, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
            });
            const data = response.data;
            setApps(
                sortAlphabetically(
                    apps.map((app) => (app.id === data.id ? data : app))
                )
            );
            resetForm();
            setIsEditModalVisible(false);
            fetchData();
        } catch (error) {
            toastError("Error updating app:", error);
        }
    };

    const PautanHandleDeleteApp = async () => {
        const deleteUrl = urlTemplate.replace("{id}", currentApp.id);

        try {
            const response = await axios.delete(deleteUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
            });

            if ([200, 201, 204].includes(response.status)) {
                setApps(
                    sortAlphabetically(
                        apps.filter((app) => app.id !== currentApp.id)
                    )
                );
                setIsDeleteModalVisible(false);
                setCurrentApp(null);
            } else {
                throw new Error("Failed to delete app");
            }
        } catch (e) {
            toastError("Error deleting app:", e);
        }
    };

    const handleBackNavigation = () => {
        window.history.back();
    };

    return (
        <Example>
            <>
                <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[1500px] mx-8 my-10">
                    <div className="flex items-start justify-between mb-2 border-b border-gray-200">
                        <h2 className="mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                            Manage Links
                        </h2>
                        <div className="flex space-x-4">
                            <button
                                className="text-gray-900 font-bold"
                                onClick={handleBackNavigation}
                            >
                                Back
                            </button>
                            <button
                                className="px-4 py-2 font-bold text-white whitespace-nowrap bg-primary hover:bg-primary-hover rounded-full"
                                onClick={() => {
                                    resetForm();
                                    setIsAddModalVisible(true);
                                }}
                            >
                                + Add
                            </button>
                        </div>
                    </div>
                    <DragDropContext onDragEnd={PautanHandleDragEnd}>
                        <Droppable droppableId="apps">
                            {(provided) => (
                                <table
                                    className="min-w-full divide-y divide-gray-200"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <thead>
                                        <tr>
                                            <th className="px-6 max-md:px-2 py-3 font-bold text-md text-start text-gray-500 label-column">
                                                App name
                                            </th>
                                            {/* <th className="px-6 max-md:px-2 py-3 font-bold text-md text-start text-gray-500 url-column">URL</th> */}
                                            <th className="px-6 max-md:px-2 py-3 font-bold text-md text-center text-gray-500 edit-column">
                                                Edit
                                            </th>
                                            <th className="px-6 max-md:px-2 py-3 font-bold text-md text-center text-gray-500 delete-column">
                                                Delete
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApps.map((app, index) => (
                                            <Draggable
                                                key={app.id}
                                                draggableId={String(app.id)}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                        className={`bg-white border-t border-gray-200 ${snapshot.isDragging ? "dragging" : ""}`}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <td className="px-6 max-md:px-2 py-4 text-sm font-semibold text-black whitespace-nowrap label-column">
                                                            <input
                                                                type="text"
                                                                disabled={true}
                                                                value={
                                                                    app.label
                                                                }
                                                                readOnly
                                                                className="w-full p-1 outline-none border-none"
                                                                style={{
                                                                    borderColor:
                                                                        "#E4E4E4",
                                                                    borderRadius:
                                                                        "0.375rem",
                                                                    borderWidth:
                                                                        "1px",
                                                                }}
                                                            />
                                                        </td>
                                                        {/* <td className="px-6 max-md:px-2 py-4 text-sm font-semibold text-black whitespace-nowrap url-column">
                              <input
                                type="text"
                                disabled={true}
                                value={app.url}
                                readOnly
                                className="w-full p-1 outline-none border-none"
                                style={{ borderColor: '#E4E4E4', borderRadius: '0.375rem', borderWidth: '1px' }}
                              />
                            </td> */}
                                                        <td className="px-6 max-md:px-2 py-4 text-sm font-semibold text-black whitespace-nowrap edit-column">
                                                            <div className="fixed-size-container">
                                                                <button
                                                                    className="text-blue-100"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        PautanHandleEditApp(
                                                                            app
                                                                        );
                                                                    }}
                                                                >
                                                                    <img
                                                                        src="assets/EditIcon.svg"
                                                                        alt="Edit"
                                                                        className="fixed-size"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 max-md:px-2 py-4 text-sm font-semibold text-black whitespace-nowrap delete-column">
                                                            <div className="fixed-size-container">
                                                                <button
                                                                    className="text-secondary"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        setCurrentApp(
                                                                            app
                                                                        );
                                                                        setIsDeleteModalVisible(
                                                                            true
                                                                        );
                                                                    }}
                                                                >
                                                                    <img
                                                                        src="assets/redDeleteIcon.svg"
                                                                        alt="Delete"
                                                                        className="fixed-size"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </tbody>
                                </table>
                            )}
                        </Droppable>
                    </DragDropContext>
                </section>

                {isAddModalVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative px-8 py-6 bg-white rounded-2xl shadow-lg w-96 m-4">
                            <h2 className="mb-4 text-xl font-bold">
                                Add New Link
                            </h2>

                            <input
                                type="text"
                                placeholder="Example.com"
                                value={newAppName}
                                onChange={(e) => setNewAppName(e.target.value)}
                                className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
                            />
                            {errors.newAppName && (
                                <p className="text-secondary -mt-4 mb-5">
                                    {errors.newAppName}
                                </p>
                            )}

                            <input
                                type="text"
                                placeholder="https://example.com"
                                value={newAppUrl}
                                onChange={(e) => setNewAppUrl(e.target.value)}
                                className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
                            />
                            {errors.newAppUrl && (
                                <p className="text-secondary -mt-4 mb-5">
                                    {errors.newAppUrl}
                                </p>
                            )}

                            <div className="flex justify-end space-x-3 text-sm">
                                <button
                                    className="px-6 py-2 font-bold text-gray-400 bg-white hover:bg-gray-400 hover:text-white rounded-full border border-gray-400"
                                    onClick={() => setIsAddModalVisible(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-8 py-2 font-bold text-white bg-primary hover:bg-primary-hover rounded-full"
                                    onClick={() => {
                                        const formErrors = {};

                                        if (!newAppName) {
                                            formErrors.newAppName =
                                                "Please provide the app name.";
                                        }
                                        if (!newAppUrl) {
                                            formErrors.newAppUrl =
                                                "Please provide the app URL.";
                                        }

                                        if (
                                            newAppUrl &&
                                            !isValidUrl(newAppUrl)
                                        ) {
                                            formErrors.newAppUrl =
                                                "URL must start with http:// or https://";
                                        }

                                        if (
                                            Object.keys(formErrors).length > 0
                                        ) {
                                            setErrors(formErrors);
                                            return;
                                        }

                                        setErrors({});

                                        PautanHandleAddApp();
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditModalVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative px-8 py-6 bg-white rounded-2xl shadow-lg w-96 m-4">
                            <h2 className="mb-4 text-xl font-bold">
                                Edit Link
                            </h2>
                            <input
                                required
                                type="text"
                                placeholder="Example.com"
                                value={newAppName}
                                onChange={(e) => setNewAppName(e.target.value)}
                                className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
                            />
                            <input
                                required
                                type="text"
                                placeholder="https://example.com"
                                value={newAppUrl}
                                onChange={(e) => setNewAppUrl(e.target.value)}
                                className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
                            />
                            {urlError && (
                                <p className="text-secondary -mt-4 mb-5">
                                    {urlError}
                                </p>
                            )}
                            <div className="flex justify-end space-x-3 mt-3">
                                <button
                                    className="px-6 py-2 text-base font-bold text-gray-400 bg-white hover:bg-gray-400 hover:text-white rounded-full border border-gray-400"
                                    onClick={() => setIsEditModalVisible(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-8 py-2 text-base font-bold text-white bg-primary hover:bg-primary-hover rounded-full"
                                    onClick={() => {
                                        const formErrors = {};

                                        if (!newAppName) {
                                            formErrors.newAppName =
                                                "Please provide the app name.";
                                        }
                                        if (!newAppUrl) {
                                            formErrors.newAppUrl =
                                                "Please provide the app URL.";
                                        }

                                        if (
                                            newAppUrl &&
                                            !isValidUrl(newAppUrl)
                                        ) {
                                            formErrors.newAppUrl =
                                                "URL must start with http:// or https://";
                                        }

                                        if (
                                            Object.keys(formErrors).length > 0
                                        ) {
                                            setErrors(formErrors);
                                            return;
                                        }

                                        setErrors({});
                                        PautanHandleUpdateApp();
                                    }}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isDeleteModalVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative px-8 py-6 bg-white rounded-2xl shadow-lg w-96 m-4">
                            <h2 className="mb-4 text-xl font-bold text-center">
                                Delete this link?
                            </h2>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="px-6 py-2 text-base font-bold text-gray-400 bg-white hover:bg-gray-400 hover:text-white rounded-full border border-gray-400"
                                    onClick={() =>
                                        setIsDeleteModalVisible(false)
                                    }
                                >
                                    No
                                </button>
                                <button
                                    className="px-8 py-2 text-white font-bold bg-primary hover:bg-primary-hover rounded-full"
                                    onClick={PautanHandleDeleteApp}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </Example>
    );
};

export default Pautan;
