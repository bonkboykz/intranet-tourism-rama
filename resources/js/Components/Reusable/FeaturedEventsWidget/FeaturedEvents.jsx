import React, { useEffect, useState } from "react";
import { memo } from "react";
import axios from "axios";

import arrowRight from "../../../../../public/assets/viewAllArrow.png";
import EventItem from "./EventItem";

import "../css/FeaturedEvents.css";

const FeaturedEvents = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    "/api/events/get-upcoming-events"
                );
                const data = response.data;
                const upcomingEvents = data.data.slice(0, 3);
                setFeaturedEvents(upcomingEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="featured-events-container border-2 shadow-custom w-full max-w-[320px] whitespace-nowrap">
            <h2
                style={{
                    fontWeight: "bold",
                    fontSize: "24px",
                    marginBottom: "4px",
                }}
            >
                Upcoming Events
            </h2>
            <hr
                style={{ marginTop: "5px", marginBottom: "5px" }}
                className="underline"
            />
            <ul className="featured-events-list text-ellipsis mt-2 mb-2 overflow-hidden whitespace-nowrap">
                {featuredEvents.length === 0 ? (
                    <p>No upcoming events</p>
                ) : (
                    featuredEvents.map((event) => (
                        <React.Fragment key={event.id}>
                            <EventItem
                                id={event.id}
                                start_date={new Date(
                                    event.start_at
                                ).toLocaleString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                                end_date={new Date(event.end_at).toLocaleString(
                                    "en-US",
                                    {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    }
                                )}
                                title={event.title}
                            />
                        </React.Fragment>
                    ))
                )}
            </ul>
            <hr className="event-separator" />
            <a href="../calendar">
                <button className="view-all-btn whitespace-nowrap">
                    VIEW ALL
                    <img
                        src={arrowRight}
                        alt="Arrow right"
                        className="arrow-icon"
                    />
                </button>
            </a>
        </div>
    );
};

export default memo(FeaturedEvents);
