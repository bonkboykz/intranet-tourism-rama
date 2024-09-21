import React, { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";

import { useNotifications } from "@/Layouts/useNotifications";

import NotificationsList from "./NotificationsList";

import "./NotificationPopup.css";

const NotificationPopup = () => {
    const [activeTab, setActiveTab] = useState("all");
    // const [notifications, setNotifications] = useState([
    //     // ... Your notifications array
    //     {
    //         id: 1,
    //         imageSrc: "/assets/smile.jpg",
    //         miniIcon: "",
    //         users: "Jonathan and sarep",
    //         orangeball: "/assets/orangeball.png",
    //         message:
    //             "also commented on your post hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee. ",
    //         timeAgo: "10 mins ago",
    //         notiView: 0,
    //         status: 3,
    //         read: true,
    //     },
    // ]);
    const { notifications, fetchNotifications } = useNotifications();

    const [isPopupOpen, setIsPopupOpen] = useState(true);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the popup
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                fetchNotifications();

                setIsPopupOpen(false);
            }
        };

        // Add event listener for clicks
        document.addEventListener("mousedown", handleClickOutside);

        // Remove event listener for clicks
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (!isPopupOpen) {
        return null; // Don't render the popup if it's closed
    }

    return (
        <div
            className="notification-box absolute right-0 max-md:-mr-4 mt-2 w-[360px] max-sm:w-[260px] bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            ref={popupRef} // Attach the reference to the popup div
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
            <ul className="flex flex-row gap-2">
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
            <br />
            <NotificationsList
                notifications={notifications}
                activeTab={activeTab}
            />
            <div
                onClick={() => {
                    window.location.href = "/profile/notifications";
                }}
                className="flex flex-row font-bold bg-slaute-400 h-10 px-2 w-full gap-2 cursor-pointer hover:bg-slate-200 rounded-lg items-center"
            >
                VIEW ALL
                <img className="h-6 w-6" src="/assets/viewall.svg" />
            </div>
        </div>
    );
};

export default NotificationPopup;
