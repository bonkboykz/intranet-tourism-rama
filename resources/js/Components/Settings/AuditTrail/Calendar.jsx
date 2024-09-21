import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    parseISO,
    startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
} from "date-fns";

import { cn } from "@/Utils/cn";

function DateRangePicker({ startDate, endDate, onClick }) {
    return (
        <div
            className="relative flex flex-col justify-center px-5 py-1.5 text-xs text-center text-black bg-white rounded-md border border-solid border-zinc-300 cursor-pointer w-[200px]"
            onClick={onClick}
        >
            <div className="justify-center px-1.5 py-1 rounded-sm bg-sky-500 bg-opacity-10">
                {startDate} - {endDate}
            </div>
        </div>
    );
}

function generateDays(month, year, startDate, endDate, today) {
    const firstDayOfMonth = startOfMonth(new Date(year, month));
    const lastDayOfMonth = endOfMonth(firstDayOfMonth);
    const startOfWeekDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endOfWeekDay = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

    const days = eachDayOfInterval({
        start: startOfWeekDay,
        end: endOfWeekDay,
    }).map((date) => {
        const dateString = format(date, "yyyy-MM-dd");
        return {
            date: dateString,
            isCurrentMonth: isSameMonth(date, firstDayOfMonth),
            isSelected:
                (startDate && dateString === startDate) ||
                (endDate && dateString === endDate) ||
                (startDate &&
                    endDate &&
                    date >= parseISO(startDate) &&
                    date <= parseISO(endDate)),
            isToday: isSameDay(date, today),
        };
    });

    // console.log("Generated days:", days);
    return days;
}

export function AuditTrailCalendar({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}) {
    const [showCalendar, setShowCalendar] = useState(false);

    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: startDate,
        endDate: endDate,
    });
    const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [today, setToday] = useState(new Date());
    const calendarRef = useRef(null);

    const fetchCurrentTime = async () => {
        try {
            const response = await fetch(
                "https://cors-anywhere.herokuapp.com/http://worldtimeapi.org/api/timezone/Asia/Kuala_Lumpur"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch current time");
            }
            const responseData = await response.json();
            console.log("API response:", responseData); // Log the API response
            const localDate = new Date(responseData.datetime);
            setToday(localDate);
            setCurrentMonth(localDate.getMonth());
            setCurrentYear(localDate.getFullYear());
            console.log("State updated:", localDate); // Log the updated date
        } catch (error) {
            console.error("Error fetching current time:", error);
        }
    };

    useEffect(() => {
        fetchCurrentTime();

        const interval = setInterval(fetchCurrentTime, 1000 * 60); // Update every minute to keep the calendar live
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape") {
                setShowCalendar(false);
            }
        };

        const handleClickOutside = (event) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target)
            ) {
                setShowCalendar(false);
            }
        };

        document.addEventListener("keydown", handleEscKey);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleEscKey);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const days = generateDays(
        currentMonth,
        currentYear,
        startDate,
        endDate,
        today
    );

    const handleDateRangeClick = () => {
        setShowCalendar(!showCalendar);
    };

    const handleDateSelect = (date) => {
        if (isSelectingStartDate) {
            setStartDate(date);
            setEndDate(null);
            setIsSelectingStartDate(false);
        } else {
            if (new Date(date) < new Date(startDate)) {
                alert("End date must be after start date.");
                return;
            }
            setEndDate(date);
            setSelectedDateRange({ startDate, endDate: date });
            setShowCalendar(false);
            setIsSelectingStartDate(true);
        }
    };

    const handleMonthChange = (direction) => {
        if (direction === "prev") {
            const newMonth = subMonths(new Date(currentYear, currentMonth), 1);
            setCurrentMonth(newMonth.getMonth());
            setCurrentYear(newMonth.getFullYear());
        } else if (direction === "next") {
            const newMonth = addMonths(new Date(currentYear, currentMonth), 1);
            setCurrentMonth(newMonth.getMonth());
            setCurrentYear(newMonth.getFullYear());
        }
    };

    const isSelectedDate = (date) => {
        if (!startDate || !endDate) return false;
        return (
            new Date(date) >= new Date(startDate) &&
            new Date(date) <= new Date(endDate)
        );
    };

    return (
        <div className="relative">
            <DateRangePicker
                startDate={selectedDateRange.startDate}
                endDate={selectedDateRange.endDate}
                onClick={handleDateRangeClick}
            />
            {showCalendar && (
                <div
                    ref={calendarRef}
                    className="absolute top-12 left-0 z-50 w-[300px] h-auto bg-white border border-gray-300 rounded-md shadow-custom"
                >
                    <div className="text-center lg:mt-2">
                        <div className="flex items-center text-gray-900">
                            <button
                                type="button"
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                onClick={() => handleMonthChange("prev")}
                            >
                                <span className="sr-only">Previous month</span>
                                <ArrowLongLeftIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                />
                            </button>
                            <div className="flex-auto text-sm font-semibold">
                                {new Date(
                                    currentYear,
                                    currentMonth
                                ).toLocaleString("default", {
                                    month: "long",
                                })}{" "}
                                {currentYear}
                            </div>
                            <button
                                type="button"
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                onClick={() => handleMonthChange("next")}
                            >
                                <span className="sr-only">Next month</span>
                                <ArrowLongRightIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 mt-2 text-xs leading-6 text-gray-500">
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                            <div>S</div>
                        </div>
                        <div className="grid grid-cols-7 gap-px mt-2 text-sm bg-gray-200 rounded-lg shadow isolate ring-1 ring-gray-200">
                            {days.map((day, dayIdx) => (
                                <button
                                    key={day.date}
                                    type="button"
                                    className={cn(
                                        "py-1.5 hover:bg-gray-100 focus:z-10",
                                        day.isCurrentMonth
                                            ? "bg-white"
                                            : "bg-gray-50",
                                        (day.isSelected || day.isToday) &&
                                            "font-semibold",
                                        day.isSelected && "text-white",
                                        !day.isSelected &&
                                            day.isCurrentMonth &&
                                            !day.isToday &&
                                            "text-gray-900",
                                        !day.isSelected &&
                                            !day.isCurrentMonth &&
                                            !day.isToday &&
                                            "text-gray-400",
                                        day.isToday &&
                                            !day.isSelected &&
                                            "text-indigo-600",
                                        isSelectedDate(day.date) &&
                                            "bg-indigo-200",
                                        dayIdx === 0 && "rounded-tl-lg",
                                        dayIdx === 6 && "rounded-tr-lg",
                                        dayIdx === days.length - 7 &&
                                            "rounded-bl-lg",
                                        dayIdx === days.length - 1 &&
                                            "rounded-br-lg"
                                    )}
                                    onClick={() => handleDateSelect(day.date)}
                                >
                                    <time
                                        dateTime={day.date}
                                        className={cn(
                                            "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                                            day.isToday &&
                                                "bg-black text-white", // Styling for today
                                            day.isSelected &&
                                                !day.isToday &&
                                                "bg-indigo-500 text-white", // Styling for selected date
                                            !day.isSelected &&
                                                isSelectedDate(day.date) &&
                                                "bg-indigo-200" // Highlight selected range with lighter color
                                        )}
                                    >
                                        {day.date
                                            .split("-")
                                            .pop()
                                            .replace(/^0/, "")}
                                    </time>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
