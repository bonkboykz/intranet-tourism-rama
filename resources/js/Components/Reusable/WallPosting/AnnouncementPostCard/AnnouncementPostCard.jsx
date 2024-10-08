import { useContext } from "react";
import { SpeakerIcon, Volume, Volume2 } from "lucide-react";

import { cn } from "@/Utils/cn";

import { WallContext } from "../WallContext";

export function AnnouncementPostCard({ announce }) {
    const { variant } = useContext(WallContext);

    return (
        <div
            className={cn(
                variant === "department"
                    ? "mt-10 py-2 px-6  rounded-2xl border-2 shadow-xl w-full max-w-[700px] relative pb-16 bg-secondary"
                    : "mt-10 py-2 px-6  rounded-2xl border-2 shadow-xl w-full max-w-[700px] relative pb-16 bg-secondary"
            )}
        >
            <div className="mb-2 flex items-center gap-1">
                <Volume2 className="w-6 h-6 text-white" />
                <div className="text-white text-center font-bold text-lg	ml-2">
                    Announcement
                </div>
            </div>
        </div>
    );
}
