import React from "react";

import "../css/EventItem.css";

const EventItem = ({ start_date, end_date, title, eventId }) => {
    const monthAbbreviations = {
        January: "JAN",
        February: "FEB",
        March: "MAR",
        April: "APR",
        May: "MAY",
        June: "JUN",
        July: "JUL",
        August: "AUG",
        September: "SEP",
        October: "OCT",
        November: "NOV",
        December: "DEC",
    };

    const [start_monthDay, start_year] = start_date.split(",");
    const [end_monthDay, end_year] = end_date.split(",");
    const [start_month, start_day] = start_monthDay.trim().split(" ");
    const [end_month, end_day] = end_monthDay.trim().split(" ");
    const abbreviatedMonth = monthAbbreviations[start_month];

    // Check if the event starts and ends on the same day
    const isSameDay = start_date === end_date;
    // Check if the event starts and ends in the same month
    const isSameMonth = start_month === end_month && start_year === end_year;

    const onClick = () => {
        window.location.href = `/calendar?event=${eventId}`;
    };

    return (
        <li
            className="event-item flex items-start justify-start cursor-pointer"
            onClick={onClick}
        >
            <div className="event-date-box">
                <div className="event-day">{start_day}</div>
                <div className="event-month">{abbreviatedMonth}</div>
            </div>
            <div className="event-details ml-1">
                <div className="event-title whitespace-nowrap overflow-hidden text-ellipsis">
                    {title}
                </div>
                {isSameDay ? (
                    <div className="event-full-date">{`${start_month} ${start_day}, ${start_year}`}</div>
                ) : isSameMonth ? (
                    <div className="event-full-date">{`${start_day} - ${end_day} ${start_month} ${start_year}`}</div>
                ) : (
                    <>
                        <div className="event-full-date">
                            {`${start_month} ${start_day}, ${start_year}`} -
                        </div>
                        <div className="event-full-date">{`${end_month} ${end_day}, ${end_year}`}</div>
                    </>
                )}
            </div>
        </li>
    );
};

export default EventItem;
