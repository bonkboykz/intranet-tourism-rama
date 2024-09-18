import { toast } from "react-toastify";
import { CircleXIcon } from "lucide-react";

export function toastError() {
    toast.error("Error fetching images:", {
        theme: "colored",
        icon: <CircleXIcon className="w-6 h-6 text-white" />,
    });
}
