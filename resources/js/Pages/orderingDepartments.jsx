import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { usePage } from "@inertiajs/react";

import { useCsrf } from "@/composables";

import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import Example from "../Layouts/DashboardLayoutNew";

const OrderingDepartments = () => {
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const csrfToken = useCsrf();

    const fetchDepartments = async (url) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json" },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            const departmentsArray = data.data.data.map((department) => ({
                id: department.id,
                name: department.name,
                order: department.order,
                imageUrl: department.banner
                    ? `/storage/${department.banner}`
                    : "assets/departmentsDefault.jpg",
            }));

            setDepartments((prevDepartments) => {
                const allDepartments = [
                    ...prevDepartments,
                    ...departmentsArray,
                ];
                return allDepartments.sort((a, b) => a.order - b.order);
            });

            if (data.data.next_page_url) {
                fetchDepartments(data.data.next_page_url);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setDepartments([]);
        fetchDepartments("/api/department/departments");
    }, []);

    const updateOrderAttributes = (departments) => {
        return departments.map((department, index) => ({
            ...department,
            order: index + 1,
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedData = Array.from(departments);
        const [reorderedItem] = reorderedData.splice(result.source.index, 1);
        reorderedData.splice(result.destination.index, 0, reorderedItem);

        const updatedDepartments = updateOrderAttributes(reorderedData);

        setDepartments(updatedDepartments);
    };

    const updateOrderInDatabase = async (department) => {
        const url = `/api/department/departments/${department.id}`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": csrfToken || "",
            },
            body: JSON.stringify({
                _method: "PATCH",
                name:
                    department.name && department.name !== ""
                        ? department.name
                        : "Untitled",
                order: department.order,
            }),
        };

        try {
            const response = await fetch(url, options);
            if (response.status === 204) {
                return { success: true };
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    `Error response from server for department ID ${department.id}: ${errorText}`
                );
                return null;
            }

            const data = await response.json();
            if (data && data.success) {
                return data;
            } else {
                console.error(
                    `Unexpected response for department ID ${department.id}`
                );
                return null;
            }
        } catch (error) {
            console.error(
                `Error updating department ID ${department.id}:`,
                error
            );
            return null;
        }
    };

    const handleSave = async () => {
        setNotificationMessage("Updating departments...");
        setIsNotificationVisible(true);
        setProgress(0);

        try {
            const totalDepartments = departments.length;
            const updatePromises = departments.map(
                async (department, index) => {
                    const result = await updateOrderInDatabase(department);
                    if (result && result.success) {
                        setProgress(
                            Math.round(((index + 1) / totalDepartments) * 100)
                        ); // Rounded to nearest whole number
                    }
                    return result;
                }
            );

            const results = await Promise.all(updatePromises);

            const successfulUpdates = results.filter(
                (result) => result && result.success
            );

            if (successfulUpdates.length === departments.length) {
                setNotificationMessage("Changes saved successfully");
            } else {
                setNotificationMessage("Some departments failed to update");
            }
        } catch (error) {
            setNotificationMessage("Error saving order");
        } finally {
            setTimeout(() => {
                setIsNotificationVisible(false);
                window.location.href = "/departments";
            }, 3000);
        }
    };

    const handleBack = () => {
        window.location.href = "/departments";
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newData = [...departments];
        [newData[index - 1], newData[index]] = [
            newData[index],
            newData[index - 1],
        ];
        setDepartments(updateOrderAttributes(newData));
    };

    const handleMoveDown = (index) => {
        if (index === departments.length - 1) return;
        const newData = [...departments];
        [newData[index + 1], newData[index]] = [
            newData[index],
            newData[index + 1],
        ];
        setDepartments(updateOrderAttributes(newData));
    };

    return (
        <Example>
            <div className="flex-row ">
                <div className="flex">
                    <main className="w-full mt-5 xl:pl-96 max-w-[1400px]">
                        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                            <div className="flex items-center max-md:flex-col max-md:gap-4 justify-between max-md:px-4">
                                <h1 className="text-3xl font-bold text-gray-900 whitespace-nowrap max-md:w-full max-md:justify-start">
                                    Manage Ordering
                                </h1>
                                <div className="flex space-x-4 max-md:w-full max-md:justify-end">
                                    <button
                                        onClick={handleBack}
                                        className="font-bold text-black text-md"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 font-bold text-white bg-secondary rounded-full text-md hover:bg-secondary-hover"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[1050px] mb-10 ml-8 mr-8">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <>
                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="departments">
                                            {(provided) => (
                                                <table
                                                    className="min-w-full divide-y divide-gray-200"
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th className="px-0 py-3 font-bold text-left text-gray-700 text-md lg:w-3/5 max-md:w-1/3">
                                                                Name
                                                            </th>
                                                            <th className="px-14 max-md:px-0 py-3 font-bold text-right text-gray-700 text-md lg:w-1/5 max-md:w-1/3">
                                                                Ordering
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {departments.map(
                                                            (item, index) => (
                                                                <Draggable
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    draggableId={String(
                                                                        item.id
                                                                    )}
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided
                                                                    ) => (
                                                                        <tr
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            className="bg-white border-t border-gray-200"
                                                                        >
                                                                            <td
                                                                                className="flex-wrap py-4 max-md:text-sm text-lg bg-white font-bold text-black lg:pr-60 max-md:pr-0 whitespace-normal w-full"
                                                                                {...provided.dragHandleProps}
                                                                            >
                                                                                <div className="flex items-center">
                                                                                    <img
                                                                                        src={
                                                                                            item.imageUrl
                                                                                        }
                                                                                        alt={
                                                                                            item.name
                                                                                        }
                                                                                        className="inline-block w-[80px] h-[40px] mr-4 rounded-md object-cover object-center"
                                                                                    />
                                                                                    <span className="break-words">
                                                                                        {
                                                                                            item.name
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="flex-col bg-white pl-24 max-md:pl-6 items-center justify-end max-md:justify-end px-4 py-4 space-x-0">
                                                                                <button
                                                                                    className="px-2"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        e.stopPropagation();
                                                                                        handleMoveUp(
                                                                                            index
                                                                                        ); // Move up
                                                                                    }}
                                                                                    disabled={
                                                                                        index ===
                                                                                        0
                                                                                    }
                                                                                    style={{
                                                                                        opacity:
                                                                                            index ===
                                                                                            0
                                                                                                ? 0.6
                                                                                                : 1,
                                                                                    }}
                                                                                >
                                                                                    <img
                                                                                        src="/assets/orderingup.svg"
                                                                                        alt="Up"
                                                                                    />
                                                                                </button>
                                                                                <button
                                                                                    className="px-2"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        e.stopPropagation();
                                                                                        handleMoveDown(
                                                                                            index
                                                                                        ); // Move down
                                                                                    }}
                                                                                    disabled={
                                                                                        index ===
                                                                                        departments.length -
                                                                                            1
                                                                                    }
                                                                                    style={{
                                                                                        opacity:
                                                                                            index ===
                                                                                            departments.length -
                                                                                                1
                                                                                                ? 0.6
                                                                                                : 1,
                                                                                    }}
                                                                                >
                                                                                    <img
                                                                                        src="/assets/orderingdown.svg"
                                                                                        alt="Down"
                                                                                    />
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                        )}
                                                        {provided.placeholder}
                                                    </tbody>
                                                </table>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </>
                            )}
                        </div>
                        {isNotificationVisible && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                {" "}
                                {/* Adjusted styling for full screen cover */}
                                <div className="p-6 text-center bg-white rounded-lg shadow-lg">
                                    <h2 className="mb-4 text-xl font-semibold">
                                        {notificationMessage}
                                    </h2>
                                    <div className="w-full bg-gray-300">
                                        <div
                                            className="py-1 text-xs leading-none text-center text-white bg-green-500"
                                            style={{ width: `${progress}%` }}
                                        >{`${progress}%`}</div>{" "}
                                        {/* Whole number percentage */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
                <aside className="fixed bottom-0 hidden px-4 py-6 overflow-y-auto border-r border-gray-200 left-20 top-16 w-96 sm:px-6 lg:px-8 xl:block">
                    <style>
                        {`
                            aside::-webkit-scrollbar {
                                width: 0px;
                                background: transparent;
                            }
                            `}
                    </style>
                    <div className="file-directory-header">
                        <PageTitle title="Departments" />
                    </div>
                    <hr className="file-directory-underline" />
                    <div>
                        <FeaturedEvents />
                        {/* <WhosOnline /> */}
                    </div>
                </aside>
            </div>
        </Example>
    );
};

export default OrderingDepartments;
