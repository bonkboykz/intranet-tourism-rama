import { createContext } from "react";

export const DepartmentContext = createContext({
    isMember: false,
    role: "anon",
});
