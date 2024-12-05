import React from "react";
import { FaCaretLeft } from "react-icons/fa";
import { usePage } from "@inertiajs/react";
import { CircleArrowOutDownLeft } from "lucide-react";

import NotificationsList from "@/Components/NotificationsList";
import Example from "@/Layouts/DashboardLayoutNew";
import {
    useNotifications,
    useSetupNotifications,
} from "@/Layouts/useNotifications";
import { getProfileImage } from "@/Utils/getProfileImage";

const AllNotificationsPage = () => {
    const { notifications } = useSetupNotifications("unread");

    return (
        <Example>
            <div className="w-full min-h-screen bg-slate-100">
                <section className="flex flex-col items-center justify-end py-10 px-40 max-md:px-4 md:px-8">
                    <header className="flex justify-between items-center w-full max-w-[1200px]">
                        <div className="w-full font-sans text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-10 max-md:mt-4 mb-4">
                            My Notifications
                            <div className="font-extrabold mt-4 mb-6 max-md:mb-0 border-b w-full border-neutral-300"></div>
                        </div>
                    </header>

                    {/* <div className='w-1/3 border-b-2'></div> */}

                    <div className="rounded-xl shadow-sm mb-10 w-full max-w-[1200px]">
                        <section className="flex flex-col gap-5 pt-7 w-full bg-white rounded-2xl shadow-2xl">
                            <div className="flex flex-col pb-5">
                                <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-800 pl-6 pr-6 flex justify-between">
                                    <span>Notifications</span>
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
                </section>
            </div>
        </Example>
    );
};

export default AllNotificationsPage;
