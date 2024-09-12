import { createContext } from "react";

export const CommunityContext = createContext({
    is_member: false,
    role: "anon",
});
