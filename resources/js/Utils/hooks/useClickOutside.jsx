import { useEffect } from "react";
import { useRef } from "react";

export function useClickOutside(cb) {
    const popupRef = useRef(null);
    const buttonRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickedInsideOfPopup = popupRef.current?.contains(
                event.target
            );
            const isClickedInsideOfModal = modalRef.current?.contains(
                event.target
            );

            const isClickedInsideOfButton = buttonRef.current?.contains(
                event.target
            );

            if (
                !isClickedInsideOfPopup &&
                !isClickedInsideOfModal &&
                !isClickedInsideOfButton
            ) {
                cb();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return {
        popupRef,
        buttonRef,
        modalRef,
    };
}
