import { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";

export function useCsrf() {
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");
        setCsrfToken(token);
    }, []);

    return csrfToken;
}
