import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { usePage } from "@inertiajs/react";

import { useCsrf } from "@/composables";

import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import Example from "../Layouts/DashboardLayoutNew";

const Ordering = () => {
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const { props } = usePage();
    const [staffMembers, setStaffMembers] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState("");
    const departmentId = props.departmentId;
    const [isLoading, setIsLoading] = useState(false);
    const csrfToken = useCsrf();

    const fetchStaffMembers = async (departmentId) => {
        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/department/employment_posts?department_id=${departmentId}`,
                {
                    method: "GET",
                    headers: { Accept: "application/json" },
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            const members = data.data.map((member) => ({
                id: member.user_id,
                employment_id: member.employment_post_id,
                name: member.name,
                role: member.business_post_title,
                status: "Online",
                imageUrl:
                    member.staff_image || "/assets/dummyStaffPlaceHolder.jpg",
                isDeactivated: member.is_active,
                order: member.order,
            }));

            members.sort((a, b) => a.order - b.order);

            setStaffMembers(members);
        } catch (error) {
            console.error("Error:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (departmentId) {
            fetchStaffMembers(departmentId);
        }
    }, [departmentId]);

    const updateOrderAttributes = (members) => {
        return members.map((member, index) => ({
            ...member,
            order: index,
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedData = Array.from(staffMembers);
        const [reorderedItem] = reorderedData.splice(result.source.index, 1);
        reorderedData.splice(result.destination.index, 0, reorderedItem);

        setStaffMembers(updateOrderAttributes(reorderedData));
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newData = [...staffMembers];
        [newData[index - 1], newData[index]] = [
            newData[index],
            newData[index - 1],
        ];
        setStaffMembers(updateOrderAttributes(newData));
    };

    const handleMoveDown = (index) => {
        if (index === staffMembers.length - 1) return;
        const newData = [...staffMembers];
        [newData[index + 1], newData[index]] = [
            newData[index],
            newData[index + 1],
        ];
        setStaffMembers(updateOrderAttributes(newData));
    };

    const updateOrderInDatabase = async (employmentPost, department_id) => {
        try {
            const response = await fetch(
                `/api/department/employment_posts/${employmentPost.employment_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                    body: JSON.stringify({
                        _method: "PATCH",
                        department_id: department_id,
                        user_id: employmentPost.id,
                        order: employmentPost.order,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to update order for employment post with ID ${employmentPost.employment_id}`
                );
            }

            const responseBody = await response.text();
            return responseBody ? JSON.parse(responseBody) : {};
        } catch (error) {
            console.error("Error updating order:", error);
            return null;
        }
    };

    const handleSave = async () => {
        setIsNotificationVisible(true);
        setNotificationMessage("Saving changes...");

        const updatePromises = staffMembers.map((member) =>
            updateOrderInDatabase(member, departmentId)
        );

        const results = await Promise.all(updatePromises);

        const success = results.every((result) => result !== null);
        if (success) {
            setNotificationMessage("Changes saved successfully!");
        } else {
            setNotificationMessage("Failed to save some changes.");
        }

        setTimeout(() => {
            setIsNotificationVisible(false);
            window.location.href = `/staffDirectory?departmentId=${props.departmentId}`;
        }, 1500);
    };

    const handleBack = () => {
        window.location.href = `/staffDirectory?departmentId=${props.departmentId}`;
        // window.history.back();
    };

    console.log(staffMembers);

    const getImageSource = (imageUrl) => {
        if (imageUrl.startsWith("staff_image/")) {
            return `/storage/${imageUrl}`;
        } else {
            return imageUrl === "/assets/dummyStaffPlaceHolder.jpg"
                ? imageUrl
                : `/avatar/${imageUrl}`;
        }
    };

    return (
        <Example>
            <div className="flex-row ">
                <div className="flex">
                    <main className="w-full mt-5 xl:pl-96 max-w-[1400px]">
                        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                            <div className="flex items-center justify-between max-md:px-4">
                                <h1 className="text-3xl font-bold text-gray-900 ">
                                    Manage Ordering
                                </h1>
                                <div className="flex space-x-4">
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
                        <div className="flex flex-col px-10 py-4 bg-white rounded-2xl shadow-custom max-w-[1050px] mb-10 ml-8 mr-8 sm:px-6 lg:px-8 lg:py-6">
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="staff">
                                    {(provided) => (
                                        <table
                                            className="w-full table-fixed bg-white divide-y divide-gray-200"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            <thead>
                                                <tr>
                                                    <th className="px-0 py-3 font-bold text-left text-gray-700 text-md w-3/5">
                                                        Name
                                                    </th>
                                                    <th className="px-14 max-md:px-0 py-3 font-bold text-right text-gray-700 text-md w-1/5">
                                                        Ordering
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {staffMembers.map(
                                                    (item, index) => (
                                                        <Draggable
                                                            key={item.id}
                                                            draggableId={String(
                                                                item.id
                                                            )}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <tr
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    className="bg-white border-t border-gray-200"
                                                                >
                                                                    <td
                                                                        className="py-4 text-lg font-bold max-md:text-sm text-black pr-12 whitespace-nowrap bg-white"
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <img
                                                                                src={getImageSource(
                                                                                    item.imageUrl
                                                                                )}
                                                                                alt={
                                                                                    item.name
                                                                                }
                                                                                className="inline-block object-cover w-12 h-16 mr-4 max-md:w-9 max-md:h-12 max-md:mr-2 max-md:rounded-md rounded-md"
                                                                            />
                                                                            <div className="flex flex-col">
                                                                                <span className="whitespace-normal overflow-hidden text-ellipsis">
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </span>
                                                                                {item.isDeactivated && (
                                                                                    <span className="text-red-500 text-sm mt-0">
                                                                                        (Deactivated)
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="flex-col bg-white w-full pl-24 max-md:pl-6 items-center justify-end max-md:justify-end px-4 py-4 space-x-0">
                                                                        <button
                                                                            className="px-2"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                handleMoveUp(
                                                                                    index
                                                                                );
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
                                                                                src="assets/orderingup.svg"
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
                                                                                );
                                                                            }}
                                                                            disabled={
                                                                                index ===
                                                                                staffMembers.length -
                                                                                    1
                                                                            }
                                                                            style={{
                                                                                opacity:
                                                                                    index ===
                                                                                    staffMembers.length -
                                                                                        1
                                                                                        ? 0.6
                                                                                        : 1,
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src="assets/orderingdown.svg"
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
                        </div>
                    </main>
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
                            <PageTitle title="Staff Directory" />
                        </div>
                        <hr className="file-directory-underline" />
                        <div>
                            <FeaturedEvents />
                            {/* <WhosOnline /> */}
                        </div>
                    </aside>
                </div>
            </div>
            {isNotificationVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-4 bg-green-100 rounded-2xl shadow-lg">
                        <p className="text-lg font-semibold text-green-800">
                            {notificationMessage}
                        </p>
                    </div>
                </div>
            )}
        </Example>
    );
};

export default Ordering;
