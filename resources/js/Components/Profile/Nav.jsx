import React from "react";
import { useEffect } from "react";
import { router } from "@inertiajs/react";

import { useSearchParams } from "@/Utils/hooks/useSearchParams";

function ProfileNav({ activeTab, setActiveTab }) {
    const tabs = [
        { name: "Activities", key: "activities" },
        { name: "Bio", key: "bio" },
        { name: "Gallery", key: "gallery" },
        { name: "Files", key: "files" },
    ];

    const { searchParams } = useSearchParams();

    useEffect(() => {
        if (searchParams.has("tab")) {
            setActiveTab(searchParams.get("tab"));
        } else {
            const url = new URL(window.location.href);

            if (url.searchParams.has("tab")) {
                url.searchParams.delete("tab");
            }

            router.replace(url.href + "?tab=bio", {
                preserveScroll: true,
                preserveState: true,
            });
        }
    }, [searchParams]);

    return (
        <>
            <div
                className="mt-6 max-md:mt-0 flex w-full rounded-b-lg border-t-2 bg-white border-gray-100"
                style={{
                    boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0)",
                }}
            >
                {/* <hr className="max-md:mx-4 max-md:-mt-20 max-md:mb-6 border-gray-900 bg-gray-900" /> */}
                <nav className="flex justify-between my-5 mx-20 w-full max-w-full text-sm font-semibold text-center whitespace-nowrap text-neutral-800 text-opacity-30 max-md:flex-wrap max-md:mt-4 max-md:mb-4 max-md:mx-5">
                    {tabs.map((tab) => (
                        <span
                            key={tab.key}
                            className={`cursor-pointer ${activeTab === tab.key ? "font-bold text-primary" : "text-stone-300"}`}
                            onClick={() => {
                                setActiveTab(tab.key);

                                const url = new URL(window.location.href);

                                if (url.searchParams.has("tab")) {
                                    url.searchParams.delete("tab");
                                }

                                router.replace(url.href + "?tab=" + tab.key, {
                                    preserveScroll: true,
                                    preserveState: true,
                                });
                            }}
                        >
                            {tab.name}
                        </span>
                    ))}
                </nav>
            </div>
        </>
    );
}

export default ProfileNav;
