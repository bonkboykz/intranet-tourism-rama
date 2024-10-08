import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";

import { useCsrf } from "@/composables";
import Example from "@/Layouts/DashboardLayoutNew"; // Assuming Example is a layout component

import "../Components/Settings/ManageLinks.css";
import "tailwindcss/tailwind.css";

const API_URL = "/api/album";

const ManageAlbum = () => {
    const [albums, setAlbums] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [newAlbumName, setNewAlbumName] = useState("");
    const csrfToken = useCsrf();

    const fetchData = async () => {
        try {
            const response = await axios.get(API_URL);
            setAlbums(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [csrfToken]);

    const updateOrder = (newAlbums) => {
        setAlbums(newAlbums);

        const updatePromises = newAlbums.map((album, idx) => {
            const updateUrl = `${API_URL}/${album.id}`;
            return fetch(updateUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
                body: JSON.stringify(album),
            }).catch((error) =>
                console.error(
                    `Error updating album with id ${album.id}:`,
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

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newAlbums = [...albums];
        [newAlbums[index - 1], newAlbums[index]] = [
            newAlbums[index],
            newAlbums[index - 1],
        ];

        updateOrder(newAlbums);
    };

    const handleMoveDown = (index) => {
        if (index === albums.length - 1) return;
        const newAlbums = [...albums];
        [newAlbums[index + 1], newAlbums[index]] = [
            newAlbums[index],
            newAlbums[index + 1],
        ];

        updateOrder(newAlbums);
    };

    const resetForm = () => {
        setNewAlbumName("");
    };

    const handleAddAlbum = async () => {
        const formData = new FormData();
        formData.append("name", newAlbumName);
        // formData.append("description", newAlbumName);

        try {
            const response = await axios.post(API_URL, formData);
            await fetchData();
            setIsAddModalVisible(false);
            resetForm();
        } catch (error) {
            console.error("Error adding album:", error);
        }
    };

    const handleEditAlbum = (album) => {
        setCurrentAlbum(album);
        setNewAlbumName(album);
        setIsEditModalVisible(true);
    };

    const handleUpdateAlbum = async () => {
        const updatedAlbum = newAlbumName;

        try {
            const response = await axios.put(
                `${API_URL}/${currentAlbum}`,
                updatedAlbum
            );

            if (response.status === 204) {
                setAlbums(
                    albums.map((album) =>
                        album === currentAlbum ? updatedAlbum : album
                    )
                );
                resetForm();
                setIsEditModalVisible(false);
                fetchData();
            } else {
                throw new Error(`Server error: ${response.data}`);
            }
        } catch (error) {
            console.error("Error updating album:", error);
        }
    };

    const handleDeleteAlbum = async () => {
        try {
            const response = await axios.delete(
                `${API_URL}/${currentAlbum.id}`
            );

            if (response.status === 204) {
                await fetchData();
                setIsDeleteModalVisible(false);
                setCurrentAlbum(null);
            } else {
                throw new Error(`Server error: ${response.data}`);
            }
        } catch (error) {
            console.error("Error deleting album:", error);
        }
    };

    return (
        <Example>
            <>
                <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[1500px] mx-8 my-10">
                    <div className="flex items-start justify-between mb-2 border-b pb-4 border-gray-200 max-md:flex-col">
                        <h2 className="mb-3 text-3xl font-bold text-primary whitespace-nowrap max-md:text-2xl">
                            Manage Albums
                        </h2>
                        <div className="flex space-x-4 max-md:w-full max-md:justify-end">
                            <button
                                onClick={() => {
                                    window.location.href = "/media";
                                }}
                                className="font-bold text-black text-md"
                            >
                                Back
                            </button>
                            <button
                                className="px-4 py-2 font-bold text-white max-md:text-sm whitespace-nowrap bg-primary hover:bg-primary-hover rounded-full"
                                onClick={() => {
                                    resetForm();
                                    setIsAddModalVisible(true);
                                }}
                            >
                                + Add
                            </button>
                        </div>
                    </div>
                    <DragDropContext onDragEnd={updateOrder}>
                        <Droppable droppableId="albums">
                            {(provided) => (
                                <table
                                    className="min-w-full divide-y divide-gray-200"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <thead>
                                        <tr>
                                            <th className="w-3/4 px-6 max-md:px-2 py-3 font-bold text-md text-start label-column text-gray-500">
                                                Album Name
                                            </th>
                                            <th className="w-1/4 max-md:px-2 py-3 font-bold text-md justify-start label-column text-gray-500">
                                                Delete
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {albums.map((album, index) => (
                                            <Draggable
                                                key={album}
                                                draggableId={album}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                        className={`bg-white border-t border-gray-200 ${
                                                            snapshot.isDragging
                                                                ? "dragging"
                                                                : ""
                                                        }`}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <td className="px-6 max-md:px-2 py-4 text-sm font-semibold text-black whitespace-nowrap label-column">
                                                            {album.name}
                                                        </td>
                                                        <td className="px-6 max-md:px-2 py-4 text-sm font-semibold text-black whitespace-nowrap delete-column">
                                                            <div className="fixed-size-container">
                                                                <button
                                                                    className="text-secondary"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        setCurrentAlbum(
                                                                            album
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
                        <div className="relative px-8 py-6 bg-white rounded-2xl shadow-lg w-96 max-md:w-full max-md:mx-4">
                            <h2 className="mb-4 text-xl font-bold">
                                Create New Album
                            </h2>
                            <input
                                type="text"
                                placeholder="Enter album name"
                                value={newAlbumName}
                                onChange={(e) =>
                                    setNewAlbumName(e.target.value)
                                }
                                className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
                            />
                            <div className="flex justify-end space-x-3 text-sm">
                                <button
                                    className="px-6 py-2 font-bold text-gray-400 bg-white hover:bg-gray-400 hover:text-white rounded-full border border-gray-400"
                                    onClick={() => setIsAddModalVisible(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-8 py-2 font-bold text-white bg-primary hover:bg-primary-hover rounded-full"
                                    onClick={handleAddAlbum}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditModalVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative px-8 py-6 bg-white rounded-2xl shadow-lg w-96">
                            <h2 className="mb-4 text-xl font-bold">
                                Edit Album
                            </h2>
                            <input
                                type="text"
                                placeholder="Enter album name"
                                value={newAlbumName}
                                onChange={(e) =>
                                    setNewAlbumName(e.target.value)
                                }
                                className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
                            />
                            <div className="flex justify-end space-x-3 mt-3">
                                <button
                                    className="px-6 py-2 text-base font-bold text-gray-400 bg-white hover:bg-gray-400 hover:text-white rounded-full border border-gray-400"
                                    onClick={() => setIsEditModalVisible(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-8 py-2 text-base font-bold text-white bg-primary hover:bg-primary-hover rounded-full"
                                    onClick={handleUpdateAlbum}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isDeleteModalVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative px-8 py-6 bg-white rounded-2xl shadow-lg w-96">
                            <h2 className="mb-4 text-xl font-bold text-center">
                                Delete this album?
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
                                    onClick={handleDeleteAlbum}
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

export default ManageAlbum;
