import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

import "./MentionPopup.css";

export function useMentions({ inputValue, cursorPosition }) {
    const [searchResults, setSearchResults] = useState([]);

    const handleTagSearch = useCallback(async () => {
        const atIndex = inputValue.lastIndexOf("@");

        if (atIndex === -1 || cursorPosition <= atIndex + 1) {
            return;
        }

        const searchTerm = inputValue.slice(atIndex + 1, cursorPosition).trim();

        if (searchTerm) {
            try {
                const response = await fetch(
                    `/api/crud/users?search=${searchTerm}&with[]=profile`
                );
                if (response.ok) {
                    const data = await response.json();

                    // Сортировка данных по имени
                    const sortedResults = data.data.data.sort((a, b) => {
                        return a.name
                            .toLowerCase()
                            .localeCompare(b.name.toLowerCase());
                    });

                    setSearchResults(sortedResults); // Установка отсортированных данных
                    console.log("Sorted searchResults:", sortedResults);
                } else {
                    console.error("Failed to fetch recommended people");
                }
            } catch (error) {
                console.error("Error fetching recommended people:", error);
            }
        }
    }, [inputValue, cursorPosition]);

    useEffect(() => {
        handleTagSearch();
    }, [handleTagSearch]);

    return {
        searchResults,
    };
}

export function MentionPopup({
    onMentionSelect,
    inputValue,
    cursorPosition,
    isMentioning,
    mentionQuery,
    popoverPosition = {},
}) {
    const { searchResults } = useMentions({
        inputValue,
        cursorPosition,
    });

    if (!isMentioning || !mentionQuery || !searchResults.length) {
        return null;
    }

    return (
        <div
            style={{
                position: "absolute",
                top: `${popoverPosition.top}px`,
                left: `${popoverPosition.left}px`,
                padding: "8px",
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                zIndex: 100,
                backgroundColor: "white",
            }}
        >
            {searchResults
                .filter((person) =>
                    person.name
                        .toLowerCase()
                        .includes(mentionQuery.toLowerCase())
                )
                .map((person) => (
                    <div
                        key={person.id}
                        onClick={() => onMentionSelect(person.name, person.id)}
                    >
                        {person.name}
                    </div>
                ))}
        </div>
    );
}
