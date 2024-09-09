import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

export function usePopupRefs() {
    const [isPopupOpen, setIsPopupOpen] = useState({});

    const popupRefs = useRef([]);

    // Add ref to each popup and reset the ref array
    const addPopupRef = (element, index) => {
        popupRefs.current[index] = element;
    };

    // Function to handle clicks outside of the popup
    const handleClickOutside = (event) => {
        popupRefs.current.forEach((ref, index) => {
            if (ref && !ref.contains(event.target)) {
                setIsPopupOpen((prevState) => ({
                    ...prevState,
                    [index]: false,
                }));
            }
        });
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return {
        isPopupOpen,
        setIsPopupOpen,
        addPopupRef,
        handleClickOutside,
    };
}
