import * as React from "react";
import { useState, useEffect } from "react";

function SearchPeopleInput({ onSearchResults }) {
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
        console.log("DATAAAA", data);
        
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

function ChosenEvent({ chosenEvent, onRemoveEvent }) {
  return (
    <>
      <div className="mt-5 text-sm font-semibold text-neutral-500">Chosen</div>
      <div className="flex flex-wrap gap-2 mt-2">
        {chosenEvent.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-2 px-3 py-1 bg-[#EBF5FF] rounded-lg shadow-sm"
          >
            <div className="text-neutral-800">{event.title}</div>
            <img
              loading="lazy"
              src="assets/CloseIcon.svg"
              alt="Close icon"
              className="cursor-pointer w-[14px] h-[14px] object-contain"
              onClick={() => onRemoveEvent(event.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}


function RecommendedEvent({ event, onAddEvent }) {
  console.log("event", event);
  
  return (
    <div
      className="flex gap-4 mt-2.5 font-bold text-neutral-800 cursor-pointer"
      onClick={() => onAddEvent(event)}
    >
      <div className="flex-auto my-auto">
        {event.title}
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
      setSelectedEvent(selectedEvent.filter((person) => person.id !== id));
  };

  const handleSave = () => {
      onSaveEvent(selectedEvent);
  };

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="flex flex-col font-semibold rounded-2xl p-6 w-full max-w-[442px] bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="flex w-full justify-between items-center mb-6">
                <div className="text-2xl font-bold w-full">
                    Tag Event
                  </div>
                  <div className="w-full flex justify-end">
                      <img
                          loading="lazy"
                          src="/assets/cancel.svg"
                          alt="Close icon"
                          className="self-end w-6 aspect-square cursor-pointer"
                          onClick={onClose}
                      />
                  </div>
                </div>
              <div className="flex flex-col">
                  <SearchPeopleInput onSearchResults={setSearchResults} />
                  <ChosenEvent
                      chosenEvent={selectedEvent}
                      onRemoveEvent={handleRemoveEvent}
                  />
                  <div className="mt-5 text-sm font-semibold text-neutral-500">Recommended</div>
                  <div className="max-h-[300px] overflow-y-auto">
                      {searchResults.map((event) => (
                          <RecommendedEvent
                              key={event.id}
                              event={event}
                              onAddEvent={handleAddEvent}
                          />
                      ))}
                  </div>
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
                              className="justify-center text-md px-4 py-2 bg-red-500 hover:bg-red-700 rounded-full"
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
