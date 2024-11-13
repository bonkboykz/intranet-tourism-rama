import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader2 } from "lucide-react";

import NotificationsList from "@/Components/NotificationsList";
import Example from "@/Layouts/DashboardLayoutNew";
import { useSetupNotifications } from "@/Layouts/useNotifications";
import { getProfileImage } from "@/Utils/getProfileImage";
import { useLazyLoading, useLoading } from "@/Utils/hooks/useLazyLoading";

import icon_noti_orange from "../../../public/assets/icon/notification/Ellipse-orange.png";

const NotificationItem = ({
    imageSrc,
    message,
    users,
    miniIcon,
    timeAgo,
    notiView,
}) => {
    return (
        <div className="w-full">
            <a href="#" className="block mt-2 text-xs text-primary">
                <div className="flex items-center gap-3 p-6 hover:bg-blue-100 w-full">
                    <div className="flex items-center bg-gray h-16 relative">
                        <img
                            src={getProfileImage({ image: imageSrc })}
                            alt="User"
                            className="aspect-square w-[68px] rounded-full"
                        />
                        <img
                            src={miniIcon}
                            alt="Icon"
                            className="absolute h-5 w-5 left-12 mt-14"
                        />
                    </div>
                    <div className="flex flex-col grow my-auto">
                        <p className="text-sm text-neutral-800">
                            <strong>{users}</strong> <span>Approved</span>!
                        </p>
                        <p className="text-sm text-neutral-800">{message}</p>
                        <time className="mt-4 text-xs font-medium text-neutral-800 text-opacity-50">
                            {timeAgo}
                        </time>
                    </div>
                    {notiView === 1 && (
                        <div className="flex items-center justify-end ml-auto">
                            <img
                                src={icon_noti_orange}
                                alt="Notification Icon"
                            />
                        </div>
                    )}
                </div>
            </a>
        </div>
    );
};
//notiView = 1 = read | notiView = 0 = unread
const notificationData = [
    {
        imageSrc: "/assets/smile.jpg",
        message:
            "Your request to change the Organisational chart picture was 1",
        miniIcon: "/assets/comment.svg",
        users: "Nyet",
        linkText: "Check it out!",
        timeAgo: "10 mins ago",
        notiView: 0,
    },
    {
        imageSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/7b6f6bf1eeb125463a1c05e53bf549eaa33b1ed997272606c9c73c94482930ce?apiKey=89326418e2a6429c92d097cb006bb6c8&",
        message:
            "Your request to change the Organisational chart picture was 2 ",
        miniIcon: "/assets/comment.svg",
        users: "Nyet",
        linkText: "Check it out!",
        timeAgo: "10 mins ago",
        notiView: 0,
    },
    {
        imageSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/7b6f6bf1eeb125463a1c05e53bf549eaa33b1ed997272606c9c73c94482930ce?apiKey=89326418e2a6429c92d097cb006bb6c8&",
        message:
            "Your request to change the Organisational chart picture was 3 ",
        miniIcon: "/assets/birthday.svg",
        users: "Nyet",
        linkText: "Check it out!",
        timeAgo: "10 mins ago",
        notiView: 0,
    },
    {
        imageSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/7b6f6bf1eeb125463a1c05e53bf549eaa33b1ed997272606c9c73c94482930ce?apiKey=89326418e2a6429c92d097cb006bb6c8&",
        message:
            "Your request to change the Organisational chart picture was 4 ",
        miniIcon: "/assets/birthday.svg",
        users: "Nyet",
        linkText: "Check it out!",
        timeAgo: "10 mins ago",
        notiView: 1,
    },
    {
        imageSrc: "/assets/smile.jpg",
        message:
            "Your request to change the Organisational chart picture was 5 ",
        miniIcon: "/assets/comment.svg",
        users: "Nyet",
        linkText: "Check it out!",
        timeAgo: "10 mins ago",
        notiView: 1,
    },
];

const AllNotificationsPage = () => {
    // const { data: notifications } = useLoading(`/api/notifications`);
    const {
        data: notifications,
        fetchData,
        hasMore,
    } = useLazyLoading(`/api/notifications`);

    useEffect(() => {
        fetchData(false);
    }, []);
    return (
        <InfiniteScroll
            pageStart={1}
            loadMore={fetchData}
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
            <Example>
                <div className="w-full min-h-screen bg-slate-100">
                    <section className="flex flex-col items-center py-10 px-40 max-md:px-4">
                        <header className="flex justify-between items-center w-full">
                            <div className="w-full font-sans text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-10 max-md:mt-4 mb-4">
                                My Notifications
                                <div className="font-extrabold mt-4 mb-6 max-md:mb-0 border-b border-neutral-300"></div>
                            </div>
                        </header>
                        <div className=" rounded-xl shadow-sm max-w-full mb-10 w-full">
                            <section className="flex flex-col gap-5 pt-7 w-full bg-white rounded-2xl shadow-2xl">
                                <div className="flex flex-col pb-5">
                                    <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-800 pl-6 pr-6 flex justify-between">
                                        <span>All Notifications</span>
                                        <button
                                            onClick={() =>
                                                (window.location.href =
                                                    "/dashboard")
                                            }
                                            className="text-primary hover:text-blue-700 font-bold text-lg"
                                        >
                                            Back
                                        </button>
                                    </h2>
                                    <nav className="flex gap-5 justify-between self-start pl-6 pr-6 pb-5 mt-6 text-lg font-semibold whitespace-nowrap text-neutral-800">
                                        <a href="#" className="underline">
                                            All
                                        </a>
                                        <a
                                            href="/profile/unread-notifications"
                                            className="text-gray-500 relative"
                                        >
                                            Unread
                                            <span className="absolute h-2 w-2 bg-orange-200 rounded-full top-1/2 transform -translate-y-1/2 ml-2"></span>
                                        </a>
                                    </nav>
                                    <div>
                                        <NotificationsList
                                            notifications={notifications}
                                            shouldSlice={false}
                                            activeTab="all"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                </div>
            </Example>
        </InfiniteScroll>
    );
};

export default AllNotificationsPage;
