import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useWindowSize } from "@uidotdev/usehooks";
import axios from "axios";
import * as bootstrap from "bootstrap";
import { format } from "date-fns";
import { Popover as RsuitePopover, Whisper } from "rsuite";

import { CancelIcon } from "@/Components/Icons/CancelIcon";
import BirthdayCom from "@/Components/Reusable/Birthdayfunction/birthdaypopup";
import Popup from "@/Components/Reusable/Popup";
import { useCsrf } from "@/composables";
import Example from "@/Layouts/DashboardLayoutNew";
import { getAvatarSource } from "@/Utils/getProfileImage";
import { usePermissions } from "@/Utils/hooks/usePermissions";
import { useSearchParams } from "@/Utils/hooks/useSearchParams";
import useUserData from "@/Utils/hooks/useUserData";
import { isBirthdayDay } from "@/Utils/isBirthday";
import { toastError } from "@/Utils/toast";

import pencilIcon from "../../../public/assets/EditIcon.svg";
import printIcon from "../../../public/assets/PrintPDF.svg";
import PrintCalendar from "./Calendar/PrintCalendar";

import "./Calendar/index.css";
import "rsuite/dist/rsuite-no-reset.min.css";

const DayCellContent = ({ birthdays, user, ...dayInfo }) => {
    const dayBirthdays = birthdays.filter((event) =>
        isBirthdayDay(event.date, dayInfo.date)
    );

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const [selectedBirthday, setSelectedBirthday] = useState(null);
    const [isBirthdayComOpen, setIsBirthdayComOpen] = useState(false);

    return (
        <div className="flex justify-between w-full relative">
            <span></span>
            <span
                className="absolute top-0 left-0  z-100 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                onMouseDown={handleMouseDown}
            >
                {dayBirthdays.length > 0 && (
                    <Whisper
                        // role="img"
                        // aria-label="cake"
                        // style={{
                        //     fontSize: "1.8em",
                        //     cursor: "pointer",
                        // }}
                        // title=""
                        // data-names={names.join(",")}

                        placement="bottom"
                        trigger="hover"
                        enterable
                        speaker={
                            <RsuitePopover
                                arrow={false}
                                className="custom-popover-rsuite"
                            >
                                <div>
                                    <p className="event-title">
                                        <strong>Birthdays:</strong>
                                    </p>

                                    <ul>
                                        {dayBirthdays.map((person, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    if (
                                                        person.profileId ===
                                                        user.id
                                                    ) {
                                                        return;
                                                    }

                                                    setSelectedBirthday(person);
                                                    setIsBirthdayComOpen(true);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {index + 1}. {person.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </RsuitePopover>
                        }
                    >
                        <span
                            style={{
                                fontSize: "1.8em",
                            }}
                        >
                            🎂
                        </span>
                    </Whisper>
                )}
            </span>
            <span>{dayInfo.dayNumberText}</span>

            {selectedBirthday &&
                createPortal(
                    <Popup
                        isOpen={isBirthdayComOpen}
                        onClose={() => setIsBirthdayComOpen(false)}
                    >
                        <BirthdayCom
                            loggedInUser={user}
                            profileImage={selectedBirthday.profileImage}
                            name={selectedBirthday.name}
                            selectedID={selectedBirthday.profileId}
                        />
                    </Popup>,
                    document.body
                )}
        </div>
    );
};

function Calendar() {
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventData, setEventData] = useState({
        title: "",
        venue: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        description: "",
        color: "purple",
        url: "",
    });
    const [includeUrl, setIncludeUrl] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const csrfToken = useCsrf();
    const [showPrint, setShowPrint] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [printRange, setPrintRange] = useState({
        startDate: "",
        endDate: "",
    });
    const [isUrlFieldVisible, setIsUrlFieldVisible] = useState(false);
    const [eventId, setEventId] = useState(null);
    const calendarRef = useRef(null);

    const toggleShowAllEvents = () => {
        setShowAllEvents(!showAllEvents);
    };

    useEffect(() => {
        // fetchEvents();
        fetchBirthdayEvents(); // Fetch and add birthday events
    }, []);

    // useEffect(() => {
    //     filterEvents();
    // }, [searchTerm, events]);

    const fetchEvents = async (start, end) => {
        try {
            const response = await axios.get(`/api/events/events`, {
                params: {
                    with: ["author"],
                    start: start.toISOString(),
                    end: end.toISOString(),
                    disabledPagination: true,
                    ...(searchTerm.trim() && { search: searchTerm }),
                },
            });
            const data = response.data;

            const formattedEvents = data.data.map((event) => ({
                id: event.id,
                title: event.title,
                start: event.start_at,
                end: event.end_at,
                description: event.description || "",
                venue: event.venue || "",
                color: event.color || "purple",
                userName: event.author.name,
                user: event.author,
                url: event.url || "",
            }));

            // Set events in state
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching events: ", error);
        }
    };

    const [birthdays, setBirthdays] = useState([]);

    const fetchBirthdayEvents = async () => {
        try {
            // let currentPage = 1;
            // let totalPages = 1;

            const response = await axios.get("/api/profile/get_all_birthdays");

            const allProfiles = response.data.data;

            const birthdayEvents = allProfiles
                .filter((profile) => {
                    const dob = new Date(profile.dob);
                    if (isNaN(dob.getTime())) return false; // Skip invalid dob

                    return true;
                })
                .map((profile) => ({
                    date: new Date(profile.dob),
                    name: profile.bio,
                    profileId: profile.user_id,
                    profileImage: getAvatarSource(profile.image, profile.bio),
                }));

            setBirthdays(birthdayEvents);

            // setEvents((prevEvents) => [...prevEvents, ...birthdayEvents]);
            // setFilteredEvents((prevEvents) => [
            //     ...prevEvents,
            //     ...birthdayEvents,
            // ]);
        } catch (error) {
            console.error("Error fetching birthdays: ", error);
        }
    };

    const { searchParams } = useSearchParams();

    // const filterEvents = () => {
    //     if (searchTerm.trim() === "") {
    //         setFilteredEvents(events);
    //         if (calendarRef.current) {
    //             calendarRef.current.getApi().gotoDate(new Date());
    //         }
    //     } else {
    //         const filtered = events.filter(
    //             (event) =>
    //                 event.title
    //                     .toLowerCase()
    //                     .includes(searchTerm.toLowerCase()) ||
    //                 event.start
    //                     ?.toLowerCase()
    //                     .includes(searchTerm.toLowerCase()) ||
    //                 event.end
    //                     ?.toLowerCase()
    //                     .includes(searchTerm.toLowerCase()) ||
    //                 (event.start &&
    //                     format(new Date(event.start), "yyyy MM dd")
    //                         .toLowerCase()
    //                         .includes(searchTerm.toLowerCase())) ||
    //                 (event.end &&
    //                     format(new Date(event.end), "yyyy MM dd")
    //                         .toLowerCase()
    //                         .includes(searchTerm.toLowerCase()))
    //         );
    //         setFilteredEvents(filtered);

    //         if (filtered.length > 0 && calendarRef.current) {
    //             const firstEventDate = new Date(filtered[0].start);
    //             calendarRef.current.getApi().gotoDate(firstEventDate);
    //         }
    //     }
    // };

    const handleDateSelect = (info) => {
        const selectedDate = new Date(info.startStr);
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };
        setIsModalOpen(true);
        setEventData({
            title: "",
            venue: "",
            startDate: formatDate(selectedDate),
            endDate:
                selectedDate < new Date()
                    ? format(new Date(), "yyyy-MM-dd")
                    : formatDate(selectedDate),
            startTime: "",
            endTime: "",
            color: "purple",
            url: "",
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEventData({
            title: "",
            venue: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            color: "purple",
            url: "",
        });
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEventData({
            title: "",
            venue: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            color: "purple",
            url: "",
        });
    };

    const closePrintModal = () => {
        setIsPrintModalOpen(false);
        setPrintRange({ startDate: "", endDate: "" });
    };

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handlePrintRangeChange = (e) => {
        setPrintRange({ ...printRange, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formatDateTime = (date, time) => `${date}T${time}`;

        // Hardcoded start and end times
        const defaultStartTime = "09:00";
        const defaultEndTime = "17:00";

        const eventPayload = {
            title: eventData.title,
            start_at: formatDateTime(eventData.startDate, defaultStartTime),
            end_at: formatDateTime(eventData.endDate, defaultEndTime),
            description: eventData.description,
            color: eventData.color,
            // url: includeUrl ? eventData.url : null,
            // Only include venue if it's provided
            ...(eventData.venue ? { venue: eventData.venue } : {}),
        };

        try {
            const response = await axios.post(
                "/api/events/events",
                eventPayload
            );
            const { data } = response.data;
            if ([401, 403, 500].includes(response.status)) {
                console.error("Error creating event: ", data.errors);

                throw new Error("Error creating event");
            }
            setEvents([...events, data]);
            closeModal();
            window.location.reload();
        } catch (error) {
            console.error("Error creating event: ", error);
            setIsModalOpen(false);
            // fetchEvents();
        }
    };

    const handlePrint = () => {
        setIsPrintModalOpen(true);
    };

    // const handleEventClick = (eventInfo) => {
    //     eventInfo.jsEvent.preventDefault();
    //     // Trigger handleEditClick with the event data
    //     handleEditClick(eventInfo.event);
    // };

    const user = useUserData();
    const { hasRole } = usePermissions();

    const handleEventClick = (eventInfo) => {
        eventInfo.jsEvent.preventDefault();

        const isAuthor = user.id === eventInfo.event.extendedProps.user.id;

        if (!isAuthor) {
            return;
        }

        // Check if the event is a birthday event
        if (eventInfo.event.extendedProps.isBirthday) {
            // If it's a birthday event, do nothing (or you could add custom behavior here)
            return;
        }

        // Trigger handleEditClick with the event data for non-birthday events
        handleEditClick(eventInfo.event);
    };

    const handleEditClick = (event) => {
        const formatTime = (date) => {
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
        };

        const url = event.url !== "null" ? event.url : ""; // Handle 'null' or undefined

        setEventId(event.id); // Set the event ID
        setEventData({
            title: event.title,
            venue: event.extendedProps.venue,
            startDate: event.start.toISOString().split("T")[0],
            endDate: event.end ? event.end.toISOString().split("T")[0] : "",
            startTime: formatTime(event.start),
            endTime: event.end ? formatTime(event.end) : "",
            description: event.extendedProps.description,
            color: event.backgroundColor,
            url: url,
        });

        setIncludeUrl(url !== ""); // Only set to true if URL is not an empty string
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const FfData = new FormData();
            FfData.append("_method", "PUT");
            FfData.append("title", eventData.title);
            FfData.append("venue", eventData.venue);
            FfData.append(
                "start_at",
                `${eventData.startDate}T${eventData.startTime}`
            );
            FfData.append(
                "end_at",
                `${eventData.endDate}T${eventData.endTime}`
            );
            FfData.append("description", eventData.description);
            FfData.append("color", eventData.color);
            // FfData.append('url', eventData.url || '');

            const response = await fetch(`/api/events/events/${eventId}`, {
                method: "POST",
                body: FfData,
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
            });

            const updatedEvent = response.data;

            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === eventId ? updatedEvent : event
                )
            );
            setIsEditModalOpen(false);
            fetchEvents();
            window.location.reload();
            // } else {
            //     const errorData = await response.json();
            //     console.error('Error updating event:', errorData);
            // }
        } catch (error) {
            console.error("Error updating event:", error);
            setIsEditModalOpen(false);
            // fetchEvents()
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/events/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
            });

            if (response.ok) {
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event.id !== eventId)
                );
                setIsEditModalOpen(false);
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.error("Error deleting event:", errorData);
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleConfirmDelete = () => {
        handleDelete();
        setDeleteConfirmOpen(false);
        closeEditModal();
    };

    const handleCancelDelete = () => {
        setDeleteConfirmOpen(false);
    };

    const openDeleteConfirm = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteClick = () => {
        openDeleteConfirm();
    };

    const [currentRange, setCurrentRange] = useState({
        start: null,
        end: null,
    });

    const handleDatesSet = (dateInfo) => {
        const newStart = dateInfo.start;
        const newEnd = dateInfo.end;

        // Only fetch events if the new range is different from the previous one
        if (
            !currentRange.start ||
            !currentRange.end ||
            newStart.toISOString() !== currentRange.start.toISOString() ||
            newEnd.toISOString() !== currentRange.end.toISOString()
        ) {
            setCurrentRange({ start: newStart, end: newEnd }); // Update the visible range
        }
    };

    // Effect to trigger when the currentRange changes
    useEffect(() => {
        if (currentRange.start && currentRange.end) {
            fetchEvents(currentRange.start, currentRange.end); // Fetch events when range changes
        }
    }, [currentRange, searchTerm]);

    const handlePrintSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get("/api/events/generate-pdf", {
                params: {
                    start: printRange.startDate,
                    end: printRange.endDate,
                    search: searchTerm,
                },
                responseType: "blob",
            });

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Error generating PDF");
            }

            // Create a Blob from the response and trigger a download
            const url = window.URL.createObjectURL(
                new Blob([response.data], {
                    type: "application/pdf",
                })
            );
            // open in new page
            window.open(url, "_blank");
            // const link = document.createElement("a");
            // link.href = url;
            // link.setAttribute("download", "events.pdf"); // Set the file name
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating PDF:", error);

            toastError("Error generating PDF");
        }

        closePrintModal();
    };

    const { width } = useWindowSize();
    const isMobile = Boolean(width && width < 768);

    return (
        <Example>
            <main className="z-0 min-h-screen w-full bg-gray-100 flex-row flex justify-center items-start gap-20 md:gap-12">
                <div
                    className="container mx-auto mt-4 bg-white rounded-md"
                    style={{ maxWidth: "90%" }}
                >
                    <h1 className="mb-3 font-sans p-2 text-4xl font-bold text-left">
                        Calendar
                    </h1>
                    <hr
                        className="mx-auto my-2"
                        style={{ borderColor: "#E4E4E4", borderWidth: "1px" }}
                    />
                    <div className="flex flex-col items-center w-full mt-3 mb-8 p-2">
                        <div className="flex items-center justify-between w-full">
                            <input
                                type="search"
                                className="flex w-full xs:w-fit px-6 max-md:pl-4 py-3 mt-2 bg-gray-100 border-gray-100 rounded-full input-no-outline"
                                placeholder="Search for events"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="flex w-fit justify-end flex-row mt-2 ml-2 max-md:gap-2 gap-3">
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center justify-center px-3 py-3 max-md:px-1 bg-red-500 rounded-full hover:bg-red-700"
                                >
                                    <img
                                        src={printIcon}
                                        alt="Print"
                                        className="w-6 h-6 max-md:mx-4"
                                    />
                                </button>
                                <button
                                    onClick={() => {
                                        setEventData({
                                            title: "",
                                            venue: "",
                                            startDate: format(
                                                new Date(),
                                                "yyyy-MM-dd"
                                            ),
                                            endDate: format(
                                                new Date(),
                                                "yyyy-MM-dd"
                                            ),
                                            startTime: "",
                                            endTime: "",
                                            description: "",
                                            color: "purple",
                                        });

                                        setIsModalOpen(true);
                                    }}
                                    className="flex items-center justify-center text-white bg-primary hover:bg-primary-hover px-3.5 py-3.5 max-md:px-1 max-md:py-1 rounded-full"
                                >
                                    <img
                                        src="/assets/plus.svg"
                                        alt="Plus icon"
                                        className="w-5 h-5 max-md:mx-4"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <FullCalendar
                        datesSet={handleDatesSet}
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin,
                        ]}
                        initialView="dayGridMonth"
                        selectable={true}
                        selectHelper={true}
                        ref={calendarRef}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        selectLongPressDelay={0}
                        height={650}
                        buttonText={{
                            today: "Today",
                            year: "Year",
                            month: "Month",
                            day: "Day",
                        }}
                        // editable={!isMobile}
                        events={events}
                        eventDidMount={(info) => {
                            if (info.event.extendedProps.isBirthday) {
                                return;
                            }
                            const formattedStartTime = new Date(
                                info.event.start
                            ).toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            });

                            const descContent = info.event.extendedProps
                                .description
                                ? `<p><strong>Description:</strong> ${info.event.extendedProps.description}</p>`
                                : "";

                            const venueContent = info.event.extendedProps.venue
                                ? `<p><strong>Venue:</strong> ${info.event.extendedProps.venue}</p>`
                                : "";

                            const popoverContent = `
                            <div>
                                <p class="event-title"><strong>${info.event.title}</strong></p>
                                <p><strong>Created by:</strong> ${info.event.extendedProps.userName}</p>
                                ${venueContent}
                                ${descContent}
                            </div>`;

                            new bootstrap.Popover(info.el, {
                                placement: "auto",
                                trigger: "hover",
                                container: "body",
                                customClass: "custom-popover",
                                content: popoverContent,
                                html: true,
                            });
                        }}
                        dayCellContent={(props) => (
                            <DayCellContent
                                {...props}
                                birthdays={birthdays}
                                user={user}
                            />
                        )}
                        eventContent={(eventInfo) => {
                            const isBirthday =
                                eventInfo.event.extendedProps.isBirthday;

                            if (isBirthday) {
                                return;
                            }
                            const borderColor =
                                eventInfo.event.backgroundColor || "gray";

                            const isAuthor =
                                user.id ===
                                    eventInfo.event.extendedProps.user.id ||
                                hasRole("superadmin");

                            return (
                                <div
                                    key={eventInfo.event.id}
                                    style={{
                                        backgroundColor:
                                            eventInfo.backgroundColor,
                                        padding: "10px 15px",
                                        borderRadius: "2px",
                                        display: "flex",
                                        alignItems: "center",
                                        height: "30px",
                                        width: "100%",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        border: `2px solid ${
                                            searchParams.get("event") ===
                                            eventInfo.event.id
                                                ? "blue"
                                                : borderColor
                                        }`,
                                    }}
                                    className="fc-event-title"
                                >
                                    <div
                                        style={{
                                            borderLeft: `5px solid ${eventInfo.event.backgroundColor}`,
                                            height: "100%",
                                            opacity: "50%",
                                        }}
                                    />
                                    <span
                                        className="event-title"
                                        style={{
                                            color: "white",
                                            flexGrow: 1,
                                        }}
                                    >
                                        {eventInfo.event.title}
                                    </span>
                                    {isAuthor && (
                                        <img
                                            src={pencilIcon}
                                            alt="Edit"
                                            className="inline-block w-4 h-4 ml-2 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleEditClick(
                                                    eventInfo.event
                                                );
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        }}
                    />

                    <div className="pb-10"></div>

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="modal-container w-[400px] max-md:w-[290px]">
                                <h1 className="flex items-start justify-center mb-4 text-2xl font-bold text-neutral-800">
                                    Create New Event
                                </h1>
                                <button
                                    onClick={closeModal}
                                    className="mt-2 mr-2 modal-close-button"
                                >
                                    <CancelIcon className="w-6 h-6" />
                                </button>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        name="title"
                                        value={eventData.title}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Event Title"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="venue"
                                        value={eventData.venue}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Venue"
                                    />
                                    <div className="flex items-start font-bold text-md text-neutral-800">
                                        Start Date
                                    </div>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={eventData.startDate}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Start Date"
                                        required
                                    />
                                    <div className="flex items-start text-md font-semibold text-neutral-800">
                                        End Date
                                    </div>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={eventData.endDate}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="End Date"
                                        required
                                        min={eventData.startDate}
                                    />
                                    <textarea
                                        name="description"
                                        value={eventData.description}
                                        onChange={handleChange}
                                        className="form-control h-36 overflow-y-auto"
                                        placeholder="Description"
                                    />
                                    <div className="flex flex-wrap max-md::flex-nowrap justify-between mb-4">
                                        {[
                                            "red",
                                            "blue",
                                            "green",
                                            "orange",
                                            "purple",
                                            "DeepPink",
                                            "black",
                                            "gray",
                                        ].map((color) => (
                                            <label
                                                key={color}
                                                className="color-option max-md:mx-2 mb-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name="color"
                                                    value={color}
                                                    checked={
                                                        eventData.color ===
                                                        color
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <span
                                                    className="color-display"
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
                                                ></span>
                                            </label>
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="modal-submit-button font-bold"
                                    >
                                        Confirm
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {isEditModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="modal-container">
                                <h1 className="flex items-center justify-center mx-4 mb-4 text-2xl font-bold text-neutral-800">
                                    Edit Event
                                </h1>
                                <button
                                    onClick={closeEditModal}
                                    className="mt-2 mr-2 modal-close-button"
                                >
                                    <CancelIcon className="w-6 h-6" />
                                </button>
                                <form onSubmit={handleEditSubmit}>
                                    <input
                                        type="text"
                                        name="title"
                                        value={eventData.title}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Event Title"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="venue"
                                        value={eventData.venue}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Venue"
                                    />
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={eventData.startDate}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Start Date"
                                        required
                                    />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={eventData.endDate}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="End Date"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        value={eventData.description}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Description"
                                    />
                                    <div className="color-picker justify-between">
                                        {[
                                            "red",
                                            "blue",
                                            "green",
                                            "orange",
                                            "purple",
                                            "DeepPink",
                                            "black",
                                            "gray",
                                        ].map((color) => (
                                            <label
                                                key={color}
                                                className="color-option mb-3"
                                            >
                                                <input
                                                    type="radio"
                                                    name="color"
                                                    value={color}
                                                    onChange={handleChange}
                                                    required
                                                    checked={
                                                        eventData.color ===
                                                        color
                                                    }
                                                />
                                                <span
                                                    className="color-display"
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
                                                ></span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="button-container">
                                        <button
                                            type="button"
                                            className="modal-delete-button font-bold"
                                            onClick={openDeleteConfirm}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="submit"
                                            className="modal-save-button font-bold"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isDeleteConfirmOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="modal-container">
                                <h1 className="flex items-center justify-center mx-4 mb-4 text-2xl font-bold text-neutral-800">
                                    Confirmation of deletion
                                </h1>
                                <p>
                                    Are you sure you want to delete this event?
                                </p>
                                <div className="button-container mt-4">
                                    <button
                                        type="button"
                                        className="modal-delete-button font-bold"
                                        onClick={handleConfirmDelete}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className="modal-save-button font-bold"
                                        onClick={handleCancelDelete}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isPrintModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-full max-w-md max-md:w-[340px] p-6 mx-auto bg-white rounded-2xl shadow-lg">
                                <h2 className="mb-4 text-xl font-bold">
                                    Select Date Range for Printing
                                </h2>
                                <form onSubmit={handlePrintSubmit}>
                                    <div className="mb-2">
                                        <label
                                            className="block mb-2 font-bold text-gray-700 text-md"
                                            htmlFor="startDate"
                                        >
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            id="startDate"
                                            value={printRange.startDate}
                                            onChange={handlePrintRangeChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            className="block mb-2 font-bold text-gray-700 text-md"
                                            htmlFor="endDate"
                                        >
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            id="endDate"
                                            value={printRange.endDate}
                                            onChange={handlePrintRangeChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={closePrintModal}
                                            className="px-4 py-2 mr-2 text-gray-400 border-2 border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-white bg-primary rounded-full hover:bg-primary-hover"
                                        >
                                            Print
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showPrint && (
                        <PrintCalendar
                            events={filteredEvents}
                            refetchEvents={fetchEvents}
                        />
                    )}
                </div>
            </main>
        </Example>
    );
}

export default Calendar;
