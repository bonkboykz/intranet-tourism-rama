import { useMemo } from "react";
import { router, usePage } from "@inertiajs/react";

export const usePermissions = () => {
    const { auth } = usePage().props;

    const hasPermission = (permission) => {
        if (auth.roles.includes("superadmin")) {
            return true;
        }

        return auth.permissions.includes(permission);
    };

    const hasRole = (role) => {
        return auth.roles.includes(role);
    };

    const updatePermissions = () => {
        router.reload();
    };

    const isSuperAdmin = hasRole("superadmin");

    return {
        hasPermission,
        hasRole,
        updatePermissions,
        permissions: auth.permissions,
        roles: auth.roles,
        isSuperAdmin,
    };
};
