import { useContext } from "react";

import { WallContext } from "../WallContext";

export function AnnouncementPostCard({ announce }) {
    const { variant } = useContext(WallContext);

    return (
        <div
            className={cn(
                variant === "department"
                    ? "mt-10 py-2 px-6  rounded-2xl border-2 shadow-xl w-full lg:w-[610px] md:w-[610px] sm:w-[610px] relative pb-16 bg-[#FF5437]"
                    : "mt-10 py-2 px-6  rounded-2xl border-2 shadow-xl w-full lg:w-full md:w-[610px] sm:w-[610px] relative pb-16 bg-[#FF5437]"
            )}
        >
            <div className="mb-2 flex items-center gap-1">
                <img
                    src={announce}
                    className="flex-shrink-0 rounded-xl w-7 h-7"
                    alt="Announcement"
                />
                <div className="text-white text-center font-bold text-lg	ml-2">
                    Announcement
                </div>
            </div>
        </div>
    );
}
