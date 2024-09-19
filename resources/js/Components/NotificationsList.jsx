import React from "react";
import { useState } from "react";
import { useMemo } from "react";
import axios from "axios";

import { formatTimeAgo } from "@/Utils/format";
import { getProfileImage } from "@/Utils/getProfileImage";

function NotificationsList({ activeTab, notifications, shouldSlice }) {
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
        if (!shouldSlice && activeTab === "alll") {
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

    return (
        <div className="notification-list px-2 ">
            <ul>
                {filteredNotifications.map((notification) => (
                    <div
                        className="flex flex-row h-[104px] mb-2 hover:bg-blue-100 items-center rounded-xl"
                        key={notification.id}
                        onMouseOver={() => markAsRead(notification.id)}
                    >
                        <div className="flex items-center bg-gray h-16">
                            <img
                                className="h-14 w-14 ml-2"
                                src={getProfileImage({
                                    image: notification.imageSrc,
                                })}
                                alt=""
                                style={{
                                    height: "80px",
                                    width: "80px",
                                    borderRadius: "100%",
                                }}
                            />
                            {notification.status === 1 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14"
                                    src="/assets/noti-icon-react/birthday_I.png"
                                    alt=""
                                />
                            )}
                            {notification.status === 2 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/calendar_I.svg"
                                    alt=""
                                />
                            )}
                            {notification.status === 3 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/comment_I.svg"
                                    alt=""
                                />
                            )}
                            {notification.type ===
                                "App\\Notifications\\GroupJoinRequestNotification" && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/community_I.svg"
                                    alt=""
                                />
                            )}
                            {notification.status === 6 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/filemanagement_I.svg"
                                    alt=""
                                />
                            )}
                            {notification.status === 7 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/home_I.png"
                                    alt=""
                                />
                            )}
                            {notification.status === 8 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/like.png"
                                    alt=""
                                />
                            )}
                            {notification.status === 9 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/link_I.svg"
                                    alt=""
                                />
                            )}
                            {notification.status === 10 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/media_I.svg"
                                    alt=""
                                />
                            )}
                            {notification.status === 11 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/noti_I.svg"
                                    alt=""
                                />
                            )}
                            {notification.status === 12 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/setting_I.svg"
                                    alt=""
                                />
                            )}
                            {notification.status === 13 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/share_I.svg"
                                    alt=""
                                />
                            )}
                            {notification.status === 14 && (
                                <img
                                    className="absolute h-5 w-5 left-20 mt-14 bg-blue"
                                    src="/assets/noti-icon-react/staffdirectory_I.svg"
                                    alt=""
                                />
                            )}
                        </div>
                        <div className="flex flex-col w-48 h-50 ml-2">
                            <div className="block px-2 py-1 text-sm notification-message">
                                {/* <span className="font-bold mr-1">
                                    {notification.users}
                                </span> */}
                                <span>{notification.data.message}</span>
                            </div>
                            <div className="block px-2 py-1 text-sm font-medium text-neutral-800 text-opacity-50">
                                {formatTimeAgo(notification.created_at)}
                            </div>
                        </div>
                        <div>
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
