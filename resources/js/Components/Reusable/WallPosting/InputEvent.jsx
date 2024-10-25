import * as React from "react";
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";

import { CancelIcon } from "@/Components/Icons/CancelIcon";

export function SearchEventInput({ onSearchResults }) {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            if (searchTerm) {
                fetchAllSearchResults(searchTerm);
            } else {
                onSearchResults([]); // Clear search results if searchTerm is empty
            }
        }, 300);

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm]);

    const fetchAllSearchResults = async (query) => {
        try {
            let allResults = [];
            let currentPage = 1;
            //   let hasMorePages = true;

            //   while () {
            const response = await fetch(
                //   `/api/crud/users?search=${query}&page=${currentPage}&with[]=profile&with[]=employmentPost.department&with[]=employmentPost.businessPost&with[]=employmentPost.businessUnit`
                `/api/events/events?search=${query}&disabledPagination=true`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data = await response.json();
            // console.log("DATAAAA", data);

            allResults = data.data;
            // currentPage++;
            // hasMorePages = data.data.next_page_url !== null;
            //   }
            onSearchResults(allResults);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 px-4 mb-2 font-base border bg-gray-200 border-gray-200 rounded-full"
            />
        </div>
    );
}

export function ChosenEvent({ chosenEvent, onRemoveEvent }) {
    return (
        <>
            <div className="mt-5 text-sm font-semibold text-neutral-500">
                Chosen
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
                {chosenEvent.map((event) => (
                    <div
                        key={event.id}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-lg shadow-sm"
                    >
                        <div className="text-neutral-800">{event.title}</div>
                        <img
                            loading="lazy"
                            src="assets/CloseIcon.svg"
                            alt="Close icon"
                            className="cursor-pointer w-[14px] h-[14px] ml-1 object-contain"
                            onClick={() => onRemoveEvent(event.id)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export function RecommendedEvent({ event, onAddEvent }) {
    // console.log("event", event);

    return (
        <div
            className="flex mt-2.5 font-bold text-neutral-800 cursor-pointer"
            onClick={() => onAddEvent(event)}
        >
            <div className="flex-auto my-auto">{event.title}</div>
            <div className="">
                {format(event.start_at, "dd.MM.yyyy")}
                {event.end_at &&
                    !isSameDay(event.start_at, event.end_at) &&
                    ` – ${format(event.end_at, "dd.MM.yyyy")}`}
            </div>
        </div>
    );
}

export function Event({ onClose, onSaveEvent, chosenEvent }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(chosenEvent); // Use passed chosenEvent

    useEffect(() => {
        setSelectedEvent(chosenEvent); // Update state when prop changes
    }, [chosenEvent]);

    const handleAddEvent = (person) => {
        if (!selectedEvent.some((p) => p.id === person.id)) {
            setSelectedEvent([...selectedEvent, person]);
        }
    };

    const handleRemoveEvent = (id) => {
        setSelectedEvent(selectedEvent.filter((event) => event.id !== id));
    };

    const handleSave = () => {
        onSaveEvent(selectedEvent);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div
                className="flex flex-col font-semibold rounded-2xl p-6 w-[442px] max-md:w-full max-md:mx-6 bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex w-full justify-between items-center mb-6">
                    <div className="text-2xl font-bold w-full">Tag Event</div>
                    <div className="w-full flex justify-end">
                        <img
                            src="/assets/cancel.svg"
                            alt="Close icon"
                            className="w-6 h-6 cursor-pointer"
                            onClick={onClose}
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <SearchEventInput onSearchResults={setSearchResults} />
                    <div className="max-h-[300px] overflow-y-auto">
                        {searchResults.map((event) => (
                            <RecommendedEvent
                                key={event.id}
                                event={event}
                                onAddEvent={handleAddEvent}
                            />
                        ))}
                    </div>
                    <ChosenEvent
                        chosenEvent={selectedEvent}
                        onRemoveEvent={handleRemoveEvent}
                    />
                    <div className="flex gap-5 justify-between self-end text-sm mt-4 text-center whitespace-nowrap">
                        <div
                            className="my-auto font-semibold text-md text-neutral-800 cursor-pointer"
                            onClick={onClose}
                        >
                            Cancel
                        </div>
                        <div className="flex flex-col justify-center font-bold text-white">
                            <button
                                onClick={handleSave}
                                className="justify-center text-md px-4 py-2 bg-secondary hover:bg-secondary-hover rounded-full"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
