import { Fragment, useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

import { usePermissions } from "@/Utils/hooks/usePermissions";

const Tooltip = ({ item, index, position }) => {
    const tooltipStyles = {
        position: "fixed",
        left: `${position.left + position.width}px`,
        top: `${position.top + position.height / 2}px`,
        transform: "translateY(-50%)",
        marginLeft: "0.5rem",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        fontSize: "0.75rem",
        borderRadius: "0.25rem",
        padding: "0.5rem",
        zIndex: 9999,
        whiteSpace: "nowrap",
    };

    return createPortal(
        <div style={tooltipStyles}>{item.name}</div>,
        document.body
    );
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [csrfToken, setCsrfToken] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({});

    const { hasRole } = usePermissions();
    const isSuperAdmin = hasRole("superadmin");

    const navigation = useMemo(
        () =>
            [
                {
                    name: "Dashboard",
                    href: "/dashboard",
                    inactive: "/assets/Dashboard Inactive.svg",
                    active: "/assets/Dashboard Active.svg",
                },
                {
                    name: "Staff Directory",
                    href: "/staffDirectory",
                    inactive: "/assets/Staff Directory Inactive.svg",
                    active: "/assets/Staff Directory Active.svg",
                },
                {
                    name: "Calendar",
                    href: "/calendar",
                    inactive: "/assets/Calendar Inactive.svg",
                    active: "/assets/Calendar Active.svg",
                },
                {
                    name: "Departments",
                    href: "/departments",
                    inactive: "/assets/Group Department Inactive.svg",
                    active: "/assets/Group Department Active.svg",
                },
                {
                    name: "Community",
                    href: "/community",
                    inactive: "/assets/Group Community Inactive.svg",
                    active: "/assets/Group Community Active.svg",
                },
                {
                    name: "File Management",
                    href: "/file-management",
                    inactive: "/assets/File Management Inactive.svg",
                    active: "/assets/File Management Active.svg",
                },
                {
                    name: "Media",
                    href: "/media",
                    inactive: "/assets/Media Inactive.svg",
                    active: "/assets/Media Active.svg",
                },
                {
                    name: "Link",
                    href: "/link",
                    inactive: "/assets/Link Inactive.svg",
                    active: "/assets/Link Active.svg",
                },
                isSuperAdmin && {
                    name: "Settings",
                    href: "/settings",
                    inactive: "/assets/Settings Inactive.svg",
                    active: "/assets/Settings Active.svg",
                },
                {
                    name: "Logout",
                    href: "/logout",
                    inactive: "/assets/Logout Inactive.svg",
                    active: "/assets/Logout Active.svg",
                },
            ].filter(Boolean),
        [isSuperAdmin]
    );

    useEffect(() => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");
        setCsrfToken(token);
    }, []);

    useEffect(() => {
        const currentPath = window.location.pathname;
        const currentIndex = navigation.findIndex(
            (item) => item.href === currentPath
        );
        setActiveIndex(currentIndex);
    }, []);

    const handleLogout = (event) => {
        event.preventDefault();
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
        })
            .then(() => {
                window.location.href = "/";
            })
            .catch((err) => console.error(err));
    };

    const handleClick = (event, index, name) => {
        if (name === "Logout") {
            handleLogout(event);
        } else {
            setActiveIndex(index);
        }
    };

    const handleMouseEnter = (index, ref) => {
        setHoveredIndex(index);
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setTooltipPosition({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
            });
        }
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <>
            <Transition show={sidebarOpen} as={Fragment}>
                <Dialog
                    className="relative z-59 lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 p-2.5"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </Transition.Child>

                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white shadow-sm px-6 pb-2 ring-1 ring-gray-200 border-r border-gray-200">
                                    <div className="flex h-16 shrink-0 items-center lg:hidden">
                                        <img
                                            className="h-8 w-[70px]"
                                            src="assets/Jomla logo red.svg"
                                            alt="Jomla Logo"
                                        />
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul
                                            role="list"
                                            className="-mx-2 flex-1 space-y-1"
                                        >
                                            {navigation.map((item, index) => {
                                                const ref = useRef(null);
                                                return (
                                                    <li key={item.name}>
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                activeIndex ===
                                                                    index
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                                                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative"
                                                            )}
                                                            onClick={(e) =>
                                                                handleClick(
                                                                    e,
                                                                    index,
                                                                    item.name
                                                                )
                                                            }
                                                            onMouseEnter={() =>
                                                                handleMouseEnter(
                                                                    index,
                                                                    ref
                                                                )
                                                            }
                                                            onMouseLeave={
                                                                handleMouseLeave
                                                            }
                                                            ref={ref}
                                                        >
                                                            <img
                                                                src={
                                                                    activeIndex ===
                                                                    index
                                                                        ? item.active
                                                                        : item.inactive
                                                                }
                                                                className="h-6 w-6 shrink-0"
                                                                alt={item.name}
                                                            />
                                                            {item.name}
                                                            {hoveredIndex ===
                                                                index && (
                                                                <Tooltip
                                                                    item={item}
                                                                    index={
                                                                        index
                                                                    }
                                                                    position={
                                                                        tooltipPosition
                                                                    }
                                                                />
                                                            )}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-white lg:shadow-sm lg:border-r lg:border-gray-200 lg:pb-4 relative">
                <div className="flex h-16 shrink-0 items-center justify-center">
                    {/* Removed Jomla Logo from here */}
                </div>
                <nav className="mt-8 relative z-40">
                    <ul
                        role="list"
                        className="flex flex-col items-center space-y-1 relative z-40"
                    >
                        {navigation.map((item, index) => {
                            const ref = useRef(null);
                            return (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            activeIndex === index
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                                            "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold relative"
                                        )}
                                        onClick={(e) =>
                                            handleClick(e, index, item.name)
                                        }
                                        onMouseEnter={() =>
                                            handleMouseEnter(index, ref)
                                        }
                                        onMouseLeave={handleMouseLeave}
                                        ref={ref}
                                    >
                                        <img
                                            src={
                                                activeIndex === index
                                                    ? item.active
                                                    : item.inactive
                                            }
                                            className="h-6 w-6 shrink-0"
                                            alt={item.name}
                                        />
                                        <span className="sr-only">
                                            {item.name}
                                        </span>
                                        {hoveredIndex === index && (
                                            <Tooltip
                                                item={item}
                                                index={index}
                                                position={tooltipPosition}
                                            />
                                        )}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
}
