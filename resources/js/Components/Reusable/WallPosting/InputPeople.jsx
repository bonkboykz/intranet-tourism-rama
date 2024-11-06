import * as React from "react";
import { useEffect, useState } from "react";

import { CancelIcon } from "@/Components/Icons/CancelIcon";

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
            let hasMorePages = true;

            while (hasMorePages) {
                const response = await fetch(
                    `/api/crud/users?search=${query}&page=${currentPage}&with[]=profile&with[]=employmentPost.department&with[]=employmentPost.businessPost&with[]=employmentPost.businessUnit`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const data = await response.json();
                allResults = [...allResults, ...data.data.data];
                currentPage++;
                hasMorePages = data.data.next_page_url !== null;
            }
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
                className="w-full mb-4 border bg-gray-200 border-gray-200 rounded-full"
            />
        </div>
    );
}

function ChosenPerson({ chosenPeople, onRemovePerson }) {
    return (
        <>
            <div className="mt-2 text-sm font-semibold text-neutral-500">
                Chosen
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {chosenPeople.map((person) => (
                    <div
                        key={person.id}
                        className="flex items-center gap-2 px-3 py-1 bg-[#EBF5FF] rounded-lg shadow-sm font-bold"
                    >
                        <div className="text-neutral-800">{person.name}</div>
                        <img
                            loading="lazy"
                            src="assets/CloseIcon.svg"
                            alt="Close icon"
                            className="cursor-pointer ml-2 w-3 h-3 object-contain"
                            onClick={() => onRemovePerson(person.id)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

function RecommendedPerson({ person, onAddPerson }) {
    console.log("PERSON", person);

    return (
        <div
            className="flex gap-4 mt-2.5 font-bold text-neutral-800 cursor-pointer"
            onClick={() => onAddPerson(person)}
        >
            <img
                // src={`/storage/${user.src}`}
                // src={user.src ? `${user.src}` : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.fullName}`}
                src={
                    !person.profile?.image // check if src variable is empty
                        ? `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${person.name}` // if src is empty = src equals to this path
                        : person.profile?.image ===
                            "/assets/dummyStaffPlaceHolder.jpg" //if person.profile?.image is not empty, check id person.profile?.image is equal to this path
                          ? person.profile?.image // if it is equal to the path, then src = person.profile?.image
                          : person.profile?.image.startsWith("avatar/") // if not equal, then check if person.profile?.image starts with user/
                            ? `/storage/${person.profile?.image}` // if yes, then src = storage/{person.profile?.image}
                            : `/storage/avatar/${person.profile?.image}` // If no then then src =
                }
                // alt={user.alt}
                style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    marginRight: "8px",
                    objectFit: "cover",
                }}
            />
            <div className="flex-auto my-auto">
                {person.name} (
                {person.employment_post?.department.name || "No Department"})
            </div>
        </div>
    );
}

export function People({ onClose, onSavePeople, chosenPeople }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPeople, setSelectedPeople] = useState(chosenPeople); // Use passed chosenPeople

    useEffect(() => {
        setSelectedPeople(chosenPeople); // Update state when prop changes
    }, [chosenPeople]);

    const handleAddPerson = (person) => {
        if (!selectedPeople.some((p) => p.id === person.id)) {
            setSelectedPeople([...selectedPeople, person]);
        }
    };

    const handleRemovePerson = (id) => {
        setSelectedPeople(selectedPeople.filter((person) => person.id !== id));
    };

    const handleSave = () => {
        onSavePeople(selectedPeople);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div
                className="w-[800px] m-8 bg-white p-6 rounded-2xl shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row w-full items-center justify-between px-4 mb-6">
                    <div className="text-2xl font-bold w-full">Tag People</div>
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
                <div className="flex flex-col px-5 mt-1.5">
                    <SearchPeopleInput onSearchResults={setSearchResults} />
                    <ChosenPerson
                        chosenPeople={selectedPeople}
                        onRemovePerson={handleRemovePerson}
                    />
                    <div className="mt-5 text-sm font-semibold text-neutral-500">
                        Recommended
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                        {searchResults.map((person) => (
                            <RecommendedPerson
                                key={person.id}
                                person={person}
                                onAddPerson={handleAddPerson}
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
                                className="justify-center text-md px-4 py-2 bg-secondary hover:bg-secondary-hover rounded-3xl"
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
