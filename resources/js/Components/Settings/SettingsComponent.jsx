import React from "react";
import { useMemo } from "react";
import classNames from "classnames";

import { usePermissions } from "@/Utils/hooks/usePermissions";

const SettingNavigation = ({ current, setCurrent }) => {
    const { hasRole } = usePermissions();
    const isSuperAdmin = hasRole("superadmin");

    const navigation = useMemo(() => {
        return [
            isSuperAdmin && {
                name: "Basic Settings",
                href: "#",
                inactive: "assets/Inactive Basic Settings.svg",
                active: "assets/Active Basic Settings.svg",
            },
            {
                name: "Themes",
                href: "#",
                inactive: "assets/Inactive Theme.svg",
                active: "assets/Active Theme.svg",
            },
            isSuperAdmin && {
                name: "Advance Settings",
                href: "#",
                inactive: "assets/Inactive Advanced Settings.svg",
                active: "assets/Active Advanced Settings.svg",
            },
            // { name: 'Departments', href: '#', inactive: "assets/Inactive Departments.svg", active: "assets/Active Departments.svg" },
            // { name: 'Media', href: '#', inactive: "assets/Inactive Media.svg", active: "assets/Active Media.svg" },
            isSuperAdmin && {
                name: "Requests",
                href: "#",
                inactive: "assets/Inactive Requests.svg",
                active: "assets/Active Requests.svg",
            },
            isSuperAdmin && {
                name: "Audit Trail",
                href: "#",
                inactive: "assets/Inactive Audit Trail.svg",
                active: "assets/Active Audit Trail.svg",
            },
            {
                name: "Feedback",
                href: "#",
                inactive: "assets/Inactive Feedback.svg",
                active: "assets/Active Feedback.svg",
            },
            isSuperAdmin && {
                name: "Birthday Template",
                href: "#",
                inactive: "assets/Inactive Birthday Template.svg",
                active: "assets/Active Birthday Template.svg",
            },
            isSuperAdmin && {
                name: "Avatar Template",
                href: "#",
                inactive: "assets/Inactive Profile Template.svg",
                active: "assets/Active Profile Template.svg",
            },
            isSuperAdmin && {
                name: "Business Units",
                href: "#",
                inactive: "assets/Inactive Departments.svg",
                active: "assets/Active Departments.svg",
            },
            isSuperAdmin && {
                name: "Business Titles",
                href: "#",
                inactive: "assets/Inactive Departments.svg",
                active: "assets/Active Departments.svg",
            },
            isSuperAdmin && {
                name: "Roles",
                href: "#",
                inactive: "assets/role-inactive.svg",
                active: "assets/role-active.svg",
            },
            isSuperAdmin && {
                name: "Permissions",
                href: "#",
                inactive: "assets/permission-inactive.svg",
                active: "assets/permission-active.svg",
            },
        ].filter(Boolean);
    }, [isSuperAdmin]);

    return (
        <nav className="flex flex-col flex-1" aria-label="Sidebar">
            <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                    <li key={item.name}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrent(item.name);
                            }}
                            className={classNames(
                                item.name === current
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                        >
                            <img
                                src={
                                    item.name === current
                                        ? item.active
                                        : item.inactive
                                }
                                alt={`${item.name} icon`}
                                className="w-6 h-6 shrink-0"
                                aria-hidden="true"
                            />
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SettingNavigation;
