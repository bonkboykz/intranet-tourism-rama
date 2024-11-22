import React, { useEffect, useRef, useState } from "react";
import {
    Bars3Icon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { usePage } from "@inertiajs/react";
import axios from "axios";

import { useNotifications } from "@/Layouts/useNotifications";
import { useSettings } from "@/Layouts/useSettings";
import { usePermissions } from "@/Utils/hooks/usePermissions";
import { useSearchParams } from "@/Utils/hooks/useSearchParams";

import BirthdayNotificationPopup from "../Components/BirthdayNotificationPopup";
import NotificationPopup from "./NotificationPopup";

export default function Header({ setSidebarOpen }) {
    const { props } = usePage();
    const { id } = props;
    const [userData, setUserData] = useState({
        name: "",
        profileImage: "",
        birthday: "",
    });

    const [isMenuPopupVisible, setIsMenuPopupVisible] = useState(false);
    const [isNotificationPopupVisible, setIsNotificationPopupVisible] =
        useState(false);
    const [isBirthdayPopupVisible, setIsBirthdayPopupVisible] = useState(false);
    const [csrfToken, setCsrfToken] = useState(null);

    const menuRef = useRef();
    const notificationRef = useRef();
    const birthdayNotificationRef = useRef();

    const togglePopupVisibility = (popupStateSetter) => {
        popupStateSetter((prevState) => !prevState);
    };

    useEffect(() => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");
        setCsrfToken(token);
    }, []);

    useEffect(() => {
        fetch(`/api/users/users/${id}?with[]=profile`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(({ data }) => {
                setUserData({
                    ...data,
                    name: data.name,
                    profileImage: data.profile?.image,
                    birthday: data.profile?.birthday,
                });
                checkBirthday(data.profile?.birthday);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, [id]);

    const source = () => {
        if (!userData.profileImage) {
            return `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${userData.name}&rounded=true`;
        }

        return userData.profileImage === "/assets/dummyStaffPlaceHolder.jpg"
            ? userData.profileImage
            : userData.profileImage.startsWith("avatar/")
              ? `/storage/${userData.profileImage}`
              : `/avatar/${userData.profileImage}`;
    };

    const checkBirthday = (birthday) => {
        if (!birthday) return;

        const today = new Date();
        const birthDate = new Date(birthday);

        if (
            today.getMonth() === birthDate.getMonth() &&
            today.getDate() === birthDate.getDate()
        ) {
            setIsBirthdayPopupVisible(true);
        }
    };

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/logout");

            if ([200, 201, 204].includes(response.status)) {
                throw new Error("Failed to logout");
            }
        } catch (e) {
            console.error(e);
        }

        window.location.reload();
    };

    const userNavigation = [
        { name: "My profile", href: "../profile" },
        { name: "Log out", href: "/logout", onClick: handleLogout },
    ];

    const getBellIconSrc = () => {
        return isNotificationPopupVisible
            ? "/assets/bell-active.svg"
            : "/assets/bell.svg";
    };

    const getBirthdayIconSrc = () => {
        return isBirthdayPopupVisible
            ? "/assets/Birthday Active.svg"
            : "/assets/Birthday Inactive.svg";
    };

    useEffect(() => {
        const handleClickOutsideNotification = (event) => {
            // Only handle clicks outside the notification popup
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsNotificationPopupVisible(false);
            }
        };

        // Attach event listener only for the bell notification popup
        if (isNotificationPopupVisible) {
            document.addEventListener(
                "mousedown",
                handleClickOutsideNotification
            );
        }

        return () => {
            // Clean up the event listener for the bell notification popup
            document.removeEventListener(
                "mousedown",
                handleClickOutsideNotification
            );
        };
    }, [isNotificationPopupVisible]);

    const { hasNewNotifications, setHasNewNotifications } = useNotifications();

    const { settings } = useSettings();

    const { searchParams } = useSearchParams();

    const q = searchParams.get("q");

    const onSearch = (event) => {
        event.preventDefault();
        const search = event.target.value;
        window.location.href = `/search?q=${search}`;
    };

    console.log("Settings", settings);

    const { isSuperAdmin } = usePermissions();

    const isNotificationEnabled =
        settings.notifications_enabled || isSuperAdmin;

    return (
        <div className="z-50 fixed w-full lg:pr-16 top-0 z-40 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            </button>

            <div
                className="w-px h-6 bg-gray-900/10 lg:hidden"
                aria-hidden="true"
            />

            <div className="flex items-center self-stretch flex-1 gap-x-4 lg:gap-x-6">
                <img
                    className="h-10 w-[70px] hidden lg:block"
                    src={settings.logo}
                    alt="Jomla Logo"
                />
                <form className="relative flex flex-1" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                        Search
                    </label>
                    <MagnifyingGlassIcon
                        className="absolute inset-y-0 left-0 w-5 h-full text-gray-400 pointer-events-none"
                        aria-hidden="true"
                    />
                    <input
                        id="search-field"
                        className="block w-full h-full py-0 pl-8 pr-0 text-gray-900 border-0 outline-none placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                        placeholder="Search..."
                        type="search"
                        name="search"
                        defaultValue={q}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSearch(e);
                            }
                        }}
                    />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <div className="relative" ref={birthdayNotificationRef}>
                        <button
                            type="button"
                            className="birthday-icon -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 -mt-0.5"
                            onClick={() =>
                                togglePopupVisibility(setIsBirthdayPopupVisible)
                            }
                        >
                            <img
                                src={getBirthdayIconSrc()}
                                className="w-6 h-6"
                                aria-hidden="true"
                            />
                        </button>
                        {isBirthdayPopupVisible && (
                            <BirthdayNotificationPopup
                                userData={userData}
                                onClose={() => setIsBirthdayPopupVisible(false)}
                            />
                        )}
                    </div>

                    {isNotificationEnabled && (
                        <div className="relative" ref={notificationRef}>
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 -mt-0.5 relative"
                                onClick={() => {
                                    togglePopupVisibility(
                                        setIsNotificationPopupVisible
                                    );

                                    setHasNewNotifications(false);
                                }}
                            >
                                <img
                                    src={getBellIconSrc()}
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                />

                                {hasNewNotifications && (
                                    <span className="absolute bottom-[4px] right-[4px] inline-block w-2 h-2 bg-secondary rounded-full" />
                                )}
                            </button>
                            {isNotificationPopupVisible && (
                                <NotificationPopup />
                            )}
                        </div>
                    )}

                    <div
                        className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                        aria-hidden="true"
                    />

                    {/* User Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            className="-m-1.5 flex items-center p-1.5"
                            onClick={() =>
                                togglePopupVisibility(setIsMenuPopupVisible)
                            }
                        >
                            <img
                                className="w-8 h-8 rounded-full bg-gray-50"
                                src={source()}
                                alt="Profile"
                            />
                            <span className="hidden lg:flex lg:items-center">
                                <span
                                    className="ml-4 text-sm font-semibold leading-6 text-gray-900 text-start"
                                    aria-hidden="true"
                                >
                                    {userData.name}
                                </span>
                                <ChevronDownIcon
                                    className="w-5 h-5 ml-2 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </button>
                        {isMenuPopupVisible && (
                            <div className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                {userNavigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={
                                            item.onClick ? item.onClick : null
                                        }
                                        className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
