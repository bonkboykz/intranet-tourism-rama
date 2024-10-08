import React from "react";

import icon_noti_orange from "../../../public/assets/icon/notification/Ellipse-orange.png";
import Layout from "../Layouts/DashboardLayout";

const NotificationItem = ({
    imageSrc,
    message,
    linkText,
    timeAgo,
    notiView,
    users,
    miniIcon,
}) => {
    return (
        <div>
            {notiView === 1 && (
                <a href="#" className="mt-2 text-xs text-primary ">
                    <div className="grid grid-rows-2 grid-flow-col hover:bg-blue-100 pl-6 pr-6">
                        <div className="row-span-2">
                            <div className="flex gap-3 py-5">
                                <div className="flex items-center bg-gray h-16 relative">
                                    <img
                                        src={imageSrc}
                                        alt="Background Image"
                                        className=" aspect-square w-[68px] rounded-full"
                                    />
                                    <img
                                        src={miniIcon}
                                        alt="Overlay Image"
                                        className="absolute h-5 w-5  left-12 mt-14"
                                    />
                                </div>

                                <div className="flex flex-col grow shrink-0 my-auto basis-0 w-fit">
                                    <p className="text-sm text-neutral-800">
                                        <strong>{users}</strong>
                                        <span className="">&nbsp;Approved</span>
                                        !
                                    </p>

                                    <p className="text-sm  text-neutral-800">
                                        {message}
                                        <span>Approved</span>!
                                    </p>
                                    <time className="mt-4 text-xs font-medium text-neutral-800 text-opacity-50">
                                        {timeAgo}
                                    </time>
                                </div>
                            </div>
                        </div>
                        <div className="row-span-2 col-span-2 flex items-center justify-end px-2">
                            <img
                                src={icon_noti_orange}
                                alt="icon notification orange"
                            />
                        </div>
                    </div>
                </a>
            )}
        </div>
    );
};
//notiView = 1 = read | notiView = 0 = unread
const notificationData = [
    {
        imageSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/7b6f6bf1eeb125463a1c05e53bf549eaa33b1ed997272606c9c73c94482930ce?apiKey=89326418e2a6429c92d097cb006bb6c8&",
        message:
            "Your request to change the Organisational chart picture was 1 ",
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
            "Your request to change the Organisational chart picture was 4 ",
        miniIcon: "/assets/comment.svg",
        users: "Nyet",
        linkText: "Check it out!",
        timeAgo: "10 mins ago",
        notiView: 1,
    },
    {
        imageSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/7b6f6bf1eeb125463a1c05e53bf549eaa33b1ed997272606c9c73c94482930ce?apiKey=89326418e2a6429c92d097cb006bb6c8&",
        message:
            "Your request to change the Organisational chart picture was 5 ",
        miniIcon: "/assets/comment.svg",
        users: "Nyet",
        linkText: "Check it out!",
        timeAgo: "10 mins ago",
        notiView: 1,
    },
];

const Notification = () => {
    return (
        // <Layout>
        <div className="flex flex-col px-5 mx-auto w-full items-center">
            <h1 className="w-full text-3xl font-bold text-neutral-800 mt-6 mb-2 flex-start ">
                My Notifications
            </h1>

            <div className="border-2 rounded-xl shadow-sm max-w-[940px] mb-10">
                <section className="flex flex-col gap-5 pt-7 mt-4 w-full bg-white rounded-xl shadow-2xl">
                    <div className="flex flex-col pb-5">
                        <h2 className="text-2xl font-extrabold text-neutral-800 pl-6 pr-6">
                            Notifications
                        </h2>
                        <nav className="flex gap-5 justify-between self-start pl-6 pr-6 pb-5 mt-6 text-lg font-semibold whitespace-nowrap text-neutral-800 max-sm:self-center">
                            <a href="/notification" className="text-gray-500">
                                All
                            </a>

                            <a href="#" className="underline relative">
                                Unread
                                <span className="absolute h-2 w-2 bg-orange-500 rounded-full top-1/2 transform -translate-y-1/2 ml-2"></span>
                            </a>
                        </nav>
                        <div>
                            {notificationData.map((notification, index) => (
                                <NotificationItem
                                    key={index}
                                    {...notification}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
        // </Layout>
    );
};

export default Notification;
