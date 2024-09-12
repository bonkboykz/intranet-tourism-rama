import { createContext } from "react";

export const DepartmentContext = createContext({
    is_member: false,
    role: "anon",
});
