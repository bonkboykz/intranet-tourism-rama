import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";

import { formatTimeAgo } from "@/Utils/format";
import {
    getNotificationAvatar,
    getProfileImage,
} from "@/Utils/getProfileImage";

function NotificationsList({
    activeTab,
    notifications,
    shouldSlice,
    loadMore,
    hasMore,
}) {
    const [readMap, setReadmap] = useState({});

    const markAsRead = async (id) => {
        setReadmap({ ...readMap, [id]: true });

        try {
            await axios.post(`/api/markAsRead/${id}`);
        } catch (e) {
            console.error(e);
        }
    };

    const filteredNotifications = useMemo(() => {
        if (!shouldSlice && activeTab === "all") {
            return notifications;
        }

        if (!shouldSlice && activeTab !== "all") {
            return notifications.filter(
                (notification) => !notification.read_at
            );
        }

        if (activeTab === "all") {
            return notifications.slice(0, 4);
        }

        return notifications
            .filter((notification) => !notification.read_at)
            .slice(0, 6);
    }, [activeTab, notifications.length, shouldSlice]);

    const handleNotificationClick = useCallback((notification) => {
        switch (notification.type) {
            case "App\\Notifications\\BirthdayWishNotification": {
                window.location.href = `/profile?tab=activities`;
                return;
            }
            default: {
                return;
            }
        }
    }, []);

    return (
        <div className="notification-list px-2 ">
            <ul>
                {filteredNotifications.map((notification) => (
                    <div
                        className="flex flex-row h-auto py-2 px-1 mb-2 hover:bg-blue-100 items-center rounded-xl relative cursor-pointer"
                        key={notification.id}
                        onMouseOver={() => markAsRead(notification.id)}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <div className="flex items-center bg-gray h-16 relative">
                            <img
                                className="h-10 w-10 ml-2"
                                src={
                                    notification.data.user_avatar
                                        ? getNotificationAvatar(
                                              notification.data.user_avatar
                                          )
                                        : getProfileImage(
                                              notification.notifiable.profile,
                                              notification.notifiable.name
                                          )
                                }
                                alt=""
                                style={{
                                    height: "60px",
                                    width: "60px",
                                    borderRadius: "100%",
                                }}
                            />
                            {/* Icons for different notification types */}
                            {notification.status && (
                                <img
                                    className="absolute h-5 w-5 right-0 bottom-0 bg-blue"
                                    src={`/assets/noti-icon-react/${notification.status}.svg`}
                                    alt=""
                                />
                            )}
                        </div>
                        <div className="flex flex-col w-48 h-50 ml-2">
                            <div className="block px-1 py-1 text-sm font-semibold notification-message">
                                <span>{notification.data.message}</span>
                            </div>
                            <div className="block px-1 py-1 text-sm font-medium text-neutral-800 text-opacity-50">
                                {formatTimeAgo(notification.created_at)}
                            </div>
                        </div>
                        <div className="absolute right-[6px]">
                            {!notification.read_at &&
                                !readMap[notification.id] && (
                                    <img
                                        src="/assets/orangeball.png"
                                        alt="Unread"
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            marginLeft: "10px",
                                        }}
                                    />
                                )}
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default NotificationsList;
