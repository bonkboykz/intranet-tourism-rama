import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import { Loader2 } from "lucide-react";

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
    currentPage,
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
        const uniqueNotifications = Array.from(
            new Map(
                notifications.map((notification) => [
                    notification.id,
                    notification,
                ])
            ).values()
        );

        if (!shouldSlice && activeTab === "all") {
            return uniqueNotifications;
        }

        if (!shouldSlice && activeTab !== "all") {
            return uniqueNotifications.filter(
                (notification) => !notification.read_at
            );
        }

        if (activeTab === "all") {
            return uniqueNotifications.slice(0, 4);
        }

        return uniqueNotifications
            .filter((notification) => !notification.read_at)
            .slice(0, 6);
    }, [activeTab, notifications, shouldSlice]);

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
        <InfiniteScroll
            pageStart={currentPage}
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
            <div className="notification-list px-2 ">
                <ul>
                    {filteredNotifications.map((notification) => (
                        <div
                            className="flex flex-row p-2 mb-1 hover:bg-blue-100 items-start rounded-xl relative cursor-pointer"
                            key={notification.id}
                            onMouseOver={() => markAsRead(notification.id)}
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
                        >
                            <div className="flex items-center bg-gray w-16 h-16 relative">
                                <img
                                    className="object-cover rounded-full "
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
                            <div className="flex flex-col w-full ml-3 mr-2">
                                <div className="block px-1 text-sm font-semibold notification-message">
                                    <span>{notification.data.message}</span>
                                </div>
                                <div className="block px-1 text-sm text-neutral-800 text-opacity-50">
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
        </InfiniteScroll>
    );
}

export default NotificationsList;
