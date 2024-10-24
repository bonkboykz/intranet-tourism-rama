import React, { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { CogIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

import SettingNavigation from "@/Components/Settings/SettingsComponent";
import { SettingsPage } from "@/Components/Settings/SettingsPage";
import Example from "@/Layouts/DashboardLayoutNew";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import PageTitle from "../Components/Reusable/PageTitle";
const Settings = () => {
    const [currentPage, setCurrentPage] = useState("Basic Settings");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { hasRole } = usePermissions();
    const isSuperAdmin = hasRole("superadmin");

    const navigation = useMemo(
        () =>
            [
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
            ].filter(Boolean),
        [isSuperAdmin]
    );

    useEffect(() => {
        const savedPage = localStorage.getItem("currentSettingsPage");
        if (savedPage && isSuperAdmin) {
            setCurrentPage(savedPage);
        } else {
            setCurrentPage("Themes");
        }
    }, [isSuperAdmin]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        localStorage.setItem("currentSettingsPage", page);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            // console.log("Clicked outside:", event.target);
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                console.log("Closing dropdown");
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Example>
            <main className="min-h-screen bg-gray-100 xl:pl-96 lg:pl-96">
                <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                    <div>
                        <SettingsPage currentPage={currentPage} />
                    </div>
                </div>
            </main>
            <aside className="fixed bottom-0 hidden px-4 py-6 overflow-y-auto border-r border-gray-200 left-20 top-16 w-96 sm:px-6 lg:block xl:block">
                <div className="file-directory-header"></div>
                <PageTitle title="Settings" />
                <hr className="file-directory-underline" />
                <SettingNavigation
                    current={currentPage}
                    setCurrent={handlePageChange}
                />
                <div></div>
            </aside>
            <div className="fixed bottom-5 left-5 lg:hidden">
                <button
                    className={`text-blue-700 p-3 rounded-full ${isOpen ? "bg-blue-600" : "bg-white"} shadow-[0_0_20px_3px_rgba(0,0,0,0.4)] focus:outline-none`}
                    onClick={toggleMenu}
                >
                    <CogIcon
                        className={`h-8 w-8 transition-colors duration-200 ${isOpen ? "text-white bg-blue-600" : "text-blue-700"}`}
                        aria-hidden="true"
                    />
                </button>

                {isOpen && (
                    <div className="fixed max-h-screen overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg left-4 bottom-12 w-52 sm:max-h-64">
                        <ul className="divide-y divide-gray-200">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    {/* { <a
                                    href={item.href}
                                    className="block px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-100 w-36 border-gray"
                                >
                                    {item.name}
                            </a> } */}
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(item.name);
                                            setIsOpen(false);
                                        }}
                                        className={classNames(
                                            item.name === currentPage
                                                ? "bg-gray-50 text-indigo-600"
                                                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                            "group flex gap-x-3 rounded-md p-2 text-sm leading-8 font-semibold w-52 h-12"
                                        )}
                                    >
                                        <img
                                            src={
                                                item.name === currentPage
                                                    ? item.active
                                                    : item.inactive
                                            }
                                            alt={`${item.name}`}
                                            className="w-4 h-4 mt-2 shrink-0"
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Example>
    );
};

export default Settings;
