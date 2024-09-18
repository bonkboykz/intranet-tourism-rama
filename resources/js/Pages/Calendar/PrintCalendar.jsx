import React, { useEffect } from "react";

import "./index.css";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
};

const PrintCalendar = ({ events, refetchEvents }) => {
    // Sort events by the start date (oldest first)
    const sortedEvents = events.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
    );

    useEffect(() => {
        // Run the refetchEvents function after the print dialog is closed
        const handleAfterPrint = () => {
            refetchEvents();
            window.location.reload();
        };

        window.addEventListener("afterprint", handleAfterPrint);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, [refetchEvents]);

    return (
        <div className="print-container">
            <img
                className="h-8 w-[70px] hidden lg:block"
                src="/assets/Jomla logo red.svg"
                alt="Jomla Logo"
            />
            <h1>Jomla! Events</h1>
            <table className="events-table">
                <thead>
                    <tr>
                        <th>DATE & TIME</th>
                        <th>EVENT NAME</th>
                        <th>VENUE</th>
                        <th>CREATED BY</th>
                        <th>DESCRIPTION</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedEvents.map((event) => (
                        <tr key={event.id}>
                            <td className="w-56">
                                {formatDate(event.start)} -{" "}
                                {formatDate(event.end)}
                            </td>
                            <td>{event.title}</td>
                            <td>{event.venue}</td>
                            <td>{event.userName}</td>
                            <td>
                                {event.description ? event.description : "N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PrintCalendar;
