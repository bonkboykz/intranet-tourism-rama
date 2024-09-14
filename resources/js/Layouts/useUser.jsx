import { createContext } from "react";
import { useContext } from "react";
import { usePage } from "@inertiajs/react";

import useUserData from "@/Utils/hooks/useUserData";

export const UserContext = createContext({
    user: {},
    userData: {},
});

export function useSetupUser() {
    const {
        props: {
            auth: { user },
        },
    } = usePage();

    const userData = useUserData();

    return {
        user,
        userData,
    };
}

export function useUser() {
    return useContext(UserContext);
}
