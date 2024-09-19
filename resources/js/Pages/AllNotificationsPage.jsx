import React from "react";
import { usePage } from "@inertiajs/react";

import NotificationsList from "@/Components/NotificationsList";
import {
    useNotifications,
    useSetupNotifications,
} from "@/Layouts/useNotifications";
import { getProfileImage } from "@/Utils/getProfileImage";

import icon_noti_orange from "../../../public/assets/icon/notification/Ellipse-orange.png";
import Layout from "../Layouts/DashboardLayout";

const NotificationItem = ({
    imageSrc,
    message,
    users,
    miniIcon,
    // linkText,
    timeAgo,
    notiView,
}) => {
    return (
        <div className="w-full">
            <a href="#" className="block mt-2 text-xs text-blue-500">
                <div className="flex items-center gap-3 p-6 hover:bg-blue-100 w-full">
                    <div className="flex items-center bg-gray h-16 relative">
                        <img
                            src={getProfileImage({
                                image: imageSrc,
                            })}
                            alt="Background Image"
                            className=" aspect-square w-[68px] rounded-full"
                        />
                        <img
                            src={miniIcon}
                            alt="Overlay Image"
                            className="absolute h-5 w-5  left-12 mt-14"
                        />
                    </div>

                    <div className="flex flex-col grow my-auto">
                        <p className="text-sm text-neutral-800">
                            <strong>{users}</strong>
                            <span className=""> &nbsp; Approved</span>!
                        </p>

                        <p className="text-sm text-neutral-800">
                            {message}
                            <span>Approved</span>!
                        </p>
                        <time className="mt-4 text-xs font-medium text-neutral-800 text-opacity-50">
                            {timeAgo}
                        </time>
                    </div>
                    {notiView === 1 && (
                        <div className="flex items-center justify-end ml-auto">
                            <img
                                src={icon_noti_orange}
                                alt="icon notification orange"
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
    const { notifications } = useSetupNotifications();

    return (
        // <Layout>
        <div className="flex flex-col px-5 mx-auto  w-full justify-center items-center">
            <h1 className="w-full text-3xl font-bold text-neutral-800 mt-6 mb-2 flex-start ">
                My Notifications
            </h1>
            {/* <div className='w-1/3 border-b-2'></div> */}

            <div className="border-2 rounded-xl shadow-sm max-w-[940px] mb-10 w-full">
                <section className="flex flex-col gap-5 pt-7 mt-4 w-full bg-white rounded-xl shadow-2xl">
                    <div className="flex flex-col pb-5">
                        <h2 className="text-4xl font-extrabold text-neutral-800 pl-6 pr-6 flex justify-between">
                            <span>All Notifications</span>
                            <button
                                onClick={() =>
                                    (window.location.href = "/dashboard")
                                }
                                className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded mt-10 sm:mt-0"
                            >
                                Back
                            </button>
                        </h2>
                        <nav className="flex gap-5 justify-between self-start pl-6 pr-6 pb-5 mt-6 text-lg font-semibold whitespace-nowrap text-neutral-800 max-sm:self-center">
                            <a href="#" className="underline">
                                All
                            </a>
                            <a
                                href="/profile/unread-notifications"
                                className="text-gray-500 relative"
                            >
                                Unread
                                <span className="absolute h-2 w-2 bg-orange-200 rounded-full top-1/2 transform -translate-y-1/2 ml-2"></span>
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
        </div>
        // </Layout>
    );
};

export default AllNotificationsPage;
