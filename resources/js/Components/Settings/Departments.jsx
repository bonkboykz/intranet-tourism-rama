import React, { useState } from "react";
import { DragDropContext, Draggable,Droppable } from "@hello-pangea/dnd";

const Departments = () => {
    const initialData = [
        { id: 1, name: "Department 1", ordering: 1 },
        { id: 2, name: "Department 2", ordering: 2 },
        { id: 3, name: "Department 3", ordering: 3 },
        { id: 4, name: "Department 4", ordering: 4 },
        { id: 5, name: "Department 5", ordering: 5 },
        { id: 6, name: "Department 6", ordering: 6 },
        { id: 7, name: "Department 7", ordering: 7 },
        { id: 8, name: "Department 8", ordering: 8 },
        { id: 9, name: "Department 9", ordering: 9 },
    ];

    const [data, setData] = useState(initialData);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(data);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setData(items);
    };

    const handleSortUp = (index) => {
        if (index === 0) return;
        const items = Array.from(data);
        const temp = items[index - 1];
        items[index - 1] = items[index];
        items[index] = temp;
        setData(items);
    };

    const handleSortDown = (index) => {
        if (index === data.length - 1) return;
        const items = Array.from(data);
        const temp = items[index + 1];
        items[index + 1] = items[index];
        items[index] = temp;
        setData(items);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom w-[844px]">
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="px-0 py-3 text-2xl font-bold tracking-wider text-left text-gray-900"
                                ></th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-2xl font-bold tracking-wider text-left text-gray-900"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-0 py-3 text-2xl font-bold tracking-wider text-left text-gray-900"
                                >
                                    Ordering
                                </th>
                            </tr>
                        </thead>
                        <Droppable droppableId="departments">
                            {(provided) => (
                                <tbody
                                    className="bg-white divide-y divide-gray-200"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {data.map((department, index) => (
                                        <Draggable
                                            key={department.id}
                                            draggableId={`${department.id}`}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <tr
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <td className="px-0 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                                                        <div className="flex items-center justify-center h-full">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-10 h-10 cursor-grab"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M7 5a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-6 4a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-6 4a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="text"
                                                                name={`name-${department.id}`}
                                                                id={`name-${department.id}`}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-custom ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-2"
                                                                placeholder={
                                                                    department.name
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-0 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                        <div className="flex items-center justify-left">
                                                            <img
                                                                src="assets/orderingup.svg"
                                                                alt="Up Arrow"
                                                                className={`mr-3 cursor-pointer h-7 w-7 ${
                                                                    index === 0
                                                                        ? "opacity-50"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    handleSortUp(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                            <img
                                                                src="assets/orderingdown.svg"
                                                                alt="Down Arrow"
                                                                className={`ml-1 cursor-pointer h-7 w-7 ${
                                                                    index ===
                                                                    data.length -
                                                                        1
                                                                        ? "opacity-50"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    handleSortDown(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </tbody>
                            )}
                        </Droppable>
                    </table>
                </div>
                <div className="flex justify-end w-full px-4 py-4 mt-4 gap-x-3 sm:px-6">
                    <button
                        type="button"
                        className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-custom ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md shadow-custom hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                        Save
                    </button>
                </div>
            </section>
        </DragDropContext>
    );
};

export default Departments;
