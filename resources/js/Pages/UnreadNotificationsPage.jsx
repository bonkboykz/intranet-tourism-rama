import React from "react";
import { FaCaretLeft } from "react-icons/fa";
import { usePage } from "@inertiajs/react";
import { CircleArrowOutDownLeft } from "lucide-react";

import NotificationsList from "@/Components/NotificationsList";
import {
    useNotifications,
    useSetupNotifications,
} from "@/Layouts/useNotifications";
import { getProfileImage } from "@/Utils/getProfileImage";

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
                <section className="flex flex-col gap-5 pt-7 mt-4 w-full bg-white rounded-xl shadow-2xl ">
                    <div className="flex flex-col pb-5">
                        <h2 className="text-4xl font-extrabold text-neutral-800 pl-6 pr-6 flex justify-between">
                            <span>Notifications</span>
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
                            <a
                                href="/profile/notifications"
                                className="text-gray-500 relative "
                            >
                                All
                            </a>
                            <a href="#" className="underline relative">
                                Unread
                                <span className="absolute h-2 w-2 bg-orange-200 rounded-full top-1/2 transform -translate-y-1/2 ml-2"></span>
                                <span className="absolute h-2 w-2 bg-orange-200 rounded-full top-1/2 transform -translate-y-1/2 ml-2"></span>
                            </a>
                        </nav>
                        <div>
                            <NotificationsList
                                notifications={notifications}
                                shouldSlice={false}
                                activeTab="unread"
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
