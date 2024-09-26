import { useState } from "react";

export function useSearchParams() {
    const [searchParams, setSearchParams] = useState(
        new URLSearchParams(window.location.search)
    );

    return {
        searchParams,
        setSearchParams,
    };
}
