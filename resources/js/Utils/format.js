import { formatDistanceToNow } from "date-fns";
import moment from "moment";

export const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Helper function to format time
export const formatTime = (time) => {
    const now = moment();
    const date = moment(time);
    const diffInHours = now.diff(date, "hours");
    const diffInDays = now.diff(date, "days");

    if (diffInHours < 1) {
        return "Just now";
    } else if (diffInHours < 2) {
        return "1 hour ago";
    } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else if (diffInDays < 2) {
        return "1 day ago";
    } else if (diffInDays < 3) {
        return `${diffInDays} days ago`;
    } else {
        return date.format("DD/MM/YYYY");
    }
};

export const formatDateEnd = (time) => {
    const date = moment(time);

    return date.format("DD/MM/YYYY");
};

export const formatWorkNumber = (workNo) => {
    if (!workNo) {
        return "N/A";
    }

    if (workNo.includes("+")) {
        return workNo;
    }

    return "+" + workNo;
};
