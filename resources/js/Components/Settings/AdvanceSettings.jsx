import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Menu, Switch, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";

import { useSettings } from "@/Layouts/useSettings";
import { toastError } from "@/Utils/toast";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const CoreFeatures = () => {
    const [wall, setWall] = useState(false);
    const [calendarOfEvents, setCalendarOfEvents] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [pages, setPages] = useState(false);
    const [poll, setPoll] = useState(false);
    const [organisationChart, setOrganisationChart] = useState(false);

    const { settings, fetchSettings } = useSettings();

    useEffect(() => {
        if (settings) {
            setWall(Boolean(settings.wall_enabled));
            setCalendarOfEvents(Boolean(settings.calendar_enabled));
            setNotifications(Boolean(settings.notifications_enabled));
            setPages(Boolean(settings.pages_enabled));
            setPoll(Boolean(settings.polls_enabled));
            setOrganisationChart(Boolean(settings.organisation_chart_enabled));
        }
    }, [settings]);

    const handleSave = async () => {
        const data = {
            wall_enabled: wall,
            calendar_enabled: calendarOfEvents,
            notifications_enabled: notifications,
            pages_enabled: pages,
            polls_enabled: poll,
            organisation_chart_enabled: organisationChart,
        };

        try {
            await Promise.all(
                Object.entries(data).map(([key, value]) =>
                    axios.put(`/api/settings/settings/update_by_key/${key}`, {
                        value: Boolean(value),
                    })
                )
            );

            toast.success("Settings saved successfully");

            fetchSettings();
        } catch (e) {
            console.error(e);

            toastError("Error saving settings");
        }
    };

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[844px]">
            <h2 className="text-2xl font-bold text-blue-500">
                Enable/Disable Core Features
            </h2>
            <div className="mt-2 border-t border-gray-200"></div>
            <div className="w-full">
                <ul role="list" className="divide-y divide-gray-200">
                    {[
                        { label: "Wall", state: wall, setState: setWall },
                        {
                            label: "Calendar of Events",
                            state: calendarOfEvents,
                            setState: setCalendarOfEvents,
                        },
                        {
                            label: "Notifications",
                            state: notifications,
                            setState: setNotifications,
                        },
                        { label: "Pages", state: pages, setState: setPages },
                        { label: "Poll", state: poll, setState: setPoll },
                        {
                            label: "Organisation Chart",
                            state: organisationChart,
                            setState: setOrganisationChart,
                        },
                    ].map(({ label, state, setState }) => (
                        <li
                            key={label}
                            className="flex items-center justify-between w-full py-4"
                        >
                            <div className="flex flex-col">
                                <p className="text-sm font-medium leading-6 text-gray-900">
                                    {label}
                                </p>
                            </div>
                            <Switch
                                checked={state}
                                onChange={setState}
                                className={classNames(
                                    state ? "bg-primary" : "bg-gray-200",
                                    "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        state
                                            ? "translate-x-5"
                                            : "translate-x-0",
                                        "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                                    )}
                                />
                            </Switch>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full border-t border-gray-200"></div>
            <div className="flex justify-end w-full px-4 py-4 mt-4 gap-x-3 sm:px-6">
                <button
                    type="button"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-custom ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-white bg-primary rounded-md shadow-custom hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>
        </section>
    );
};

const SizeLimit = () => {
    const [fileLimit, setFileLimit] = useState(0);
    const [videoLimit, setVideoLimit] = useState(0);
    const [photoLimit, setPhotoLimit] = useState(0);

    const { settings, fetchSettings } = useSettings();

    useEffect(() => {
        if (settings) {
            setFileLimit(settings.max_file_size);
            setVideoLimit(settings.max_video_size);
            setPhotoLimit(settings.max_image_size);
        }
    }, [settings]);

    const handleSave = async () => {
        const data = {
            max_file_size: fileLimit,
            max_video_size: videoLimit,
            max_image_size: photoLimit,
        };

        try {
            await Promise.all(
                Object.entries(data).map(([key, value]) =>
                    axios.put(`/api/settings/settings/update_by_key/${key}`, {
                        value: `${value}MB`,
                    })
                )
            );

            toast.success("Settings saved successfully");

            fetchSettings();
        } catch (e) {
            console.error(e);

            toastError("Error saving settings");
        }
    };

    const handleSelect = (option, type, event) => {
        event.preventDefault();
        if (type === "file") setFileLimit(option);
        if (type === "video") setVideoLimit(option);
        if (type === "photo") setPhotoLimit(option);
    };

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[844px] mt-5">
            <h2 className="text-2xl font-bold text-blue-500">
                File / Video / Photo Size Limit
            </h2>
            <div className="mt-2 border-t border-gray-200"></div>
            <div className="w-full">
                <ul role="list" className="divide-y divide-gray-200">
                    {[
                        {
                            label: "File",
                            limit: fileLimit,
                            setLimit: setFileLimit,
                            type: "file",
                        },
                        {
                            label: "Video",
                            limit: videoLimit,
                            setLimit: setVideoLimit,
                            type: "video",
                        },
                        {
                            label: "Photo",
                            limit: photoLimit,
                            setLimit: setPhotoLimit,
                            type: "photo",
                        },
                    ].map(({ label, limit, setLimit, type }) => (
                        <li
                            key={label}
                            className="flex items-center justify-between w-full py-4"
                        >
                            <div className="flex flex-col">
                                <p className="text-sm font-medium leading-6 text-gray-900">
                                    {label}
                                </p>
                            </div>
                            <Menu
                                as="div"
                                className="relative inline-block text-left"
                            >
                                <div>
                                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-custom ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        {limit} MB
                                        <ChevronDownIcon
                                            className="w-5 h-5 -mr-1 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-custom ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            {[5, 10, 20].map((option) => (
                                                <Menu.Item
                                                    key={option}
                                                    as="div"
                                                >
                                                    {({ active, close }) => (
                                                        <button
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                handleSelect(
                                                                    option,
                                                                    type,
                                                                    event
                                                                );

                                                                close();
                                                            }}
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700",
                                                                "block w-full text-left px-4 py-2 text-sm"
                                                            )}
                                                        >
                                                            {option}
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full border-t border-gray-200"></div>
            <div className="flex justify-end w-full px-4 py-4 mt-4 gap-x-3 sm:px-6">
                <button
                    type="button"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-custom ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-white bg-primary rounded-md shadow-custom hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>
        </section>
    );
};

const Media = () => {
    const [fileFolder, setFileFolder] = useState(false);

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[844px] mt-5">
            <h2 className="text-2xl font-bold text-blue-500">Media</h2>
            <div className="mt-2 border-t border-gray-200"></div>
            <div className="w-full">
                <ul role="list" className="divide-y divide-gray-200">
                    <li className="flex items-center justify-between w-full py-4">
                        <div className="flex flex-col">
                            <p className="text-sm font-medium leading-6 text-gray-900">
                                Path to Files Folder
                            </p>
                        </div>
                        <div className="flex flex-col -ml-64">
                            <p className="text-sm font-light leading-6 text-gray-900">
                                Allow members to invite
                            </p>
                        </div>
                        <Switch
                            checked={fileFolder}
                            onChange={setFileFolder}
                            className={classNames(
                                fileFolder ? "bg-primary" : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    fileFolder
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                                )}
                            />
                        </Switch>
                    </li>
                    <li className="flex items-center justify-between w-full py-4">
                        <div className="flex flex-col">
                            <p className="text-sm font-medium leading-6 text-gray-900">
                                Limit Email Domain
                            </p>
                        </div>
                        <div>
                            <label htmlFor="link" className="sr-only">
                                Link
                            </label>
                            <input
                                type="link"
                                name="link"
                                id="link"
                                className="block w-[160px] rounded-md border-0 py-1.5 text-gray-900 shadow-custom ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-2"
                                placeholder="Link"
                            />
                        </div>
                    </li>
                </ul>
            </div>
            <div className="w-full border-t border-gray-200"></div>
            <div className="flex justify-end w-full px-4 py-4 mt-4 gap-x-3 sm:px-6">
                <button
                    type="button"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-custom ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-white bg-primary rounded-md shadow-custom hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                    Save
                </button>
            </div>
        </section>
    );
};

const CoverPhotos = () => {
    const [groups, setGroups] = useState(false);
    const [profile, setProfile] = useState(false);

    const { settings, fetchSettings } = useSettings();

    useEffect(() => {
        if (settings) {
            setGroups(settings.groups_enabled);
            setProfile(settings.profiles_enabled);
        }
    }, [settings]);

    const handleSave = async () => {
        const data = {
            groups_enabled: groups,
            profiles_enabled: profile,
        };

        try {
            await Promise.all(
                Object.entries(data).map(([key, value]) =>
                    axios.put(`/api/settings/settings/update_by_key/${key}`, {
                        value: value,
                    })
                )
            );

            toast.success("Settings saved successfully");

            fetchSettings();
        } catch (e) {
            console.error(e);

            toastError("Error saving settings");
        }
    };

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[844px] mt-5">
            <h2 className="text-2xl font-bold text-blue-500">Cover Photos</h2>
            <div className="mt-2 border-t border-gray-200"></div>
            <div className="w-full">
                <ul role="list" className="divide-y divide-gray-200">
                    {[
                        { label: "Groups", state: groups, setState: setGroups },
                        {
                            label: "Profile",
                            state: profile,
                            setState: setProfile,
                        },
                    ].map(({ label, state, setState }) => (
                        <li
                            key={label}
                            className="flex items-center justify-between w-full py-4"
                        >
                            <div className="flex flex-col">
                                <p className="text-sm font-medium leading-6 text-gray-900">
                                    {label}
                                </p>
                            </div>
                            <Switch
                                checked={state}
                                onChange={setState}
                                className={classNames(
                                    state ? "bg-primary" : "bg-gray-200",
                                    "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        state
                                            ? "translate-x-5"
                                            : "translate-x-0",
                                        "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                                    )}
                                />
                            </Switch>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full border-t border-gray-200"></div>
            <div className="flex justify-end w-full px-4 py-4 mt-4 gap-x-3 sm:px-6">
                <button
                    type="button"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-custom ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-white bg-primary rounded-md shadow-custom hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>
        </section>
    );
};

const MailSettings = () => {
    const [security, setSecurity] = useState("None");
    const [mail, setMail] = useState("PHP Mail");
    const [fileFolder, setFileFolder] = useState(false);
    const [authentication, setAuthentication] = useState(false);
    const [emailNotification, setEmailNotification] = useState(false);

    const handleSelect = (option, type, event) => {
        event.preventDefault();
        if (type === "mail") setMail(option);
        if (type === "security") setSecurity(option);
    };

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[844px] mt-5">
            <h2 className="text-2xl font-bold text-blue-500">Mail Settings</h2>
            <div className="mt-2 border-t border-gray-200"></div>
            <div className="w-full">
                <ul role="list" className="divide-y divide-gray-200">
                    <li className="flex items-center justify-between w-full py-4">
                        <div className="flex flex-col">
                            <p className="text-sm font-medium leading-6 text-gray-900">
                                Mailer *
                            </p>
                        </div>
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-custom ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {mail}
                                    <ChevronDownIcon
                                        className="w-5 h-5 -mr-1 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Menu.Button>
                            </div>
                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-custom ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {["Mail 1", "Mail 2", "Mail 3"].map(
                                            (option) => (
                                                <Menu.Item
                                                    key={option}
                                                    as="div"
                                                >
                                                    {({ active }) => (
                                                        <button
                                                            onClick={(event) =>
                                                                handleSelect(
                                                                    option,
                                                                    "mail",
                                                                    event
                                                                )
                                                            }
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700",
                                                                "block w-full text-left px-4 py-2 text-sm"
                                                            )}
                                                        >
                                                            {option}
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            )
                                        )}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </li>
                    <li className="flex items-center justify-between w-full py-4">
                        <div className="flex flex-col">
                            <p className="text-sm font-medium leading-6 text-gray-900">
                                Path to Files Folder
                            </p>
                        </div>
                        <div className="flex flex-col -ml-64">
                            <p className="text-sm font-light leading-6 text-gray-900">
                                Allow members to invite
                            </p>
                        </div>
                        <Switch
                            checked={fileFolder}
                            onChange={setFileFolder}
                            className={classNames(
                                fileFolder ? "bg-primary" : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    fileFolder
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                                )}
                            />
                        </Switch>
                    </li>
                    {[
                        {
                            label: "From Email",
                            placeholder: "jomla@tourism.gov.my",
                            type: "email",
                        },
                        {
                            label: "From Name",
                            placeholder: "jomla!",
                            type: "text",
                        },
                        {
                            label: "Sendmail Path",
                            placeholder: "",
                            type: "text",
                        },
                        {
                            label: "SMTP Port *",
                            placeholder: "25",
                            type: "text",
                        },
                        {
                            label: "SMTP Username",
                            placeholder: "admin",
                            type: "text",
                        },
                        {
                            label: "SMTP Password",
                            placeholder: "***********",
                            type: "password",
                        },
                        {
                            label: "SMTP Host",
                            placeholder: "localhost",
                            type: "text",
                        },
                    ].map(({ label, placeholder, type }) => (
                        <li
                            key={label}
                            className="flex items-center justify-between w-full py-4"
                        >
                            <div className="flex flex-col">
                                <p className="text-sm font-medium leading-6 text-gray-900">
                                    {label}
                                </p>
                            </div>
                            <div>
                                <label htmlFor={label} className="sr-only">
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    name={label}
                                    id={label}
                                    className="block w-[160px] rounded-md border-0 py-1.5 text-gray-900 shadow-custom ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-2"
                                    placeholder={placeholder}
                                />
                            </div>
                        </li>
                    ))}
                    <li className="flex items-center justify-between w-full py-4">
                        <div className="flex flex-col">
                            <p className="text-sm font-medium leading-6 text-gray-900">
                                SMTP Authentication
                            </p>
                        </div>
                        <Switch
                            checked={authentication}
                            onChange={setAuthentication}
                            className={classNames(
                                authentication ? "bg-primary" : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    authentication
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                                )}
                            />
                        </Switch>
                    </li>
                    <li className="flex items-center justify-between w-full py-4">
                        <div className="flex flex-col">
                            <p className="text-sm font-medium leading-6 text-gray-900">
                                SMTP Security
                            </p>
                        </div>
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-custom ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {security}
                                    <ChevronDownIcon
                                        className="w-5 h-5 -mr-1 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Menu.Button>
                            </div>
                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-custom ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {[
                                            "Security 1",
                                            "Security 2",
                                            "Security 3",
                                        ].map((option) => (
                                            <Menu.Item key={option} as="div">
                                                {({ active }) => (
                                                    <button
                                                        onClick={(event) =>
                                                            handleSelect(
                                                                option,
                                                                "security",
                                                                event
                                                            )
                                                        }
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block w-full text-left px-4 py-2 text-sm"
                                                        )}
                                                    >
                                                        {option}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </li>
                    <li className="flex items-center justify-between w-full py-4">
                        <div className="flex flex-col">
                            <p className="text-sm font-medium leading-6 text-gray-900">
                                Enable Email Notification
                            </p>
                        </div>
                        <Switch
                            checked={emailNotification}
                            onChange={setEmailNotification}
                            className={classNames(
                                emailNotification
                                    ? "bg-primary"
                                    : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    emailNotification
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                                )}
                            />
                        </Switch>
                    </li>
                </ul>
            </div>
            <div className="w-full border-t border-gray-200"></div>
            <div className="flex justify-end w-full px-4 py-4 mt-4 gap-x-3 sm:px-6">
                <button
                    type="button"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-custom ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-white bg-primary rounded-md shadow-custom hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                    Save
                </button>
            </div>
        </section>
    );
};

export { CoreFeatures, CoverPhotos, MailSettings, Media, SizeLimit };
