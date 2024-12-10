import React, { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";

import { useNotifications } from "@/Layouts/useNotifications";

import NotificationsList from "./NotificationsList";

import "./NotificationPopup.css";

const NotificationPopup = () => {
    const [activeTab, setActiveTab] = useState("all");

    const { notifications, fetchNotifications } = useNotifications();

    const [isPopupOpen, setIsPopupOpen] = useState(true);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                fetchNotifications();
                setIsPopupOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (!isPopupOpen) {
        return null;
    }

    return (
        <div
            className="notification-box absolute right-0 max-md:-mr-4 mt-2 w-[300px] max-sm:w-[260px] bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            ref={popupRef}
        >
            <h2
                style={{
                    marginLeft: "10px",
                    marginTop: "10px",
                    color: "#222222",
                    fontSize: "24px",
                }}
            >
                {activeTab === "all" ? (
                    <strong>All Notifications</strong>
                ) : (
                    <strong>Unread Notifications</strong>
                )}
            </h2>
            <ul className="flex flex-row gap-2 px-1 mb-2">
                <li>
                    <button
                        onClick={() => handleTabChange("all")}
                        className={`tab-button ${
                            activeTab === "all" ? "active" : ""
                        }`}
                    >
                        All
                    </button>
                </li>
                <li className="relative">
                    <button
                        onClick={() => handleTabChange("unread")}
                        className={`tab-button ${
                            activeTab === "unread" ? "active" : ""
                        }`}
                    >
                        Unread
                        <span
                            className={`${
                                activeTab === "unread"
                                    ? "opacity-100"
                                    : "opacity-50"
                            }`}
                        />
                    </button>
                </li>
            </ul>
            <div
                className="notifications-content overflow-y-auto max-h-[400px] px-1"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#ccc #f5f5f5",
                }}
            >
                <NotificationsList
                    notifications={notifications}
                    activeTab={activeTab}
                />
            </div>
            <div
                onClick={() => {
                    window.location.href = "/profile/notifications";
                }}
                className="flex flex-row font-bold bg-slaute-400 text-[13px] px-4 py-2 w-full gap-2 cursor-pointer hover:bg-slate-200 rounded-lg items-center"
            >
                VIEW ALL
                <img className="h-auto w-[15px]" src="/assets/viewall.svg" />
            </div>
        </div>
    );
};

export default NotificationPopup;
