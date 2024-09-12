import { usePage, router } from "@inertiajs/react";

export const usePermissions = () => {
    const { auth } = usePage().props;

    console.log("AUTH", auth);

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

    return {
        hasPermission,
        hasRole,
        updatePermissions,
        permissions: auth.permissions,
        roles: auth.roles,
    };
};
