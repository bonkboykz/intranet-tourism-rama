import { createContext } from "react";

export const CommunityContext = createContext({
    isMember: false,
    role: "anon",
});
