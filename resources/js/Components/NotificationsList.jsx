import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { formatTimeAgo } from "@/Utils/format";
import {
    getNotificationAvatar,
    getProfileImage,
} from "@/Utils/getProfileImage";
import { useLazyLoading } from "@/Utils/hooks/useLazyLoading";

function NotificationsList({ activeTab }) {
    const {
        data: notifications,
        hasMore,
        nextPage: loadMore,
        isLoading,
    } = useLazyLoading("/api/notifications", {
        activeTab,
        per_page: 5, // Load 5 notifications per request
    });

    const [readMap, setReadMap] = useState({});

    const markAsRead = async (id) => {
        setReadMap({ ...readMap, [id]: true });

        try {
            await axios.post(`/api/markAsRead/${id}`);
        } catch (e) {
            console.error(e);
        }
    };

    const filteredNotifications = useMemo(() => {
        const uniqueNotifications = Array.from(
            new Map(
                notifications.map((notification) => [
                    notification.id,
                    notification,
                ])
            ).values()
        );

        if (activeTab === "all") {
            return uniqueNotifications;
        }

        return uniqueNotifications.filter(
            (notification) => !notification.read_at
        );
    }, [activeTab, notifications]);

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

    // Display loading icon during the initial load
    if (isLoading && notifications.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    return (
        <InfiniteScroll
            pageStart={1}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={
                <div
                    className="loader min-h-32 flex items-center justify-center"
                    key={0}
                >
                    <Loader2 className="w-12 h-12 animate-spin" />
                </div>
            }
        >
            <div className="notification-list px-2">
                <ul>
                    {filteredNotifications.map((notification) => (
                        <div
                            className="flex flex-row h-auto py-2 px-1 mb-2 hover:bg-blue-100 items-center rounded-xl relative cursor-pointer"
                            key={notification.id}
                            onMouseOver={() => markAsRead(notification.id)}
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
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
                                                  notification.notifiable
                                                      .profile,
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
                {isLoading && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                )}
            </div>
        </InfiniteScroll>
    );
}

export default NotificationsList;
