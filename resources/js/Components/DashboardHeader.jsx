import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

// import { ChevronDownIcon } from '@heroicons/react/20/solid';
import logo from "../../../public/assets/logo.png";
// import bell from '../../../public/assets/notification.png';
import profileDummy from "../../../public/assets/profileDummy.png";
import search from "../../../public/assets/search.png";
import NotificationPopup from "./NotificationPopup";

import "./Reusable/css/General.css";

// import styles from './styles.css';

const Header = () => {
    const [isActive, setIsActive] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        setIsActive(!isActive);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <header className="fixed top-0 z-50 flex w-full items-center justify-between p-4 bg-transparent shadow-custom">
            <a href="../dashboard">
                <img src={logo} alt="Logo" className="h-12 ml-8" />{" "}
            </a>
            <div className="relative flex items-center flex-grow mx-8 ">
                <img
                    src={search}
                    alt="Search"
                    className="absolute w-6 h-6 transform -translate-y-1/2 left-3 top-1/2"
                />
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    style={{
                        width: "1000px",
                        paddingLeft: "3rem",
                        borderColor: "transparent",
                        borderRadius: "2rem",
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = "blue";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "transparent";
                    }}
                />
            </div>

            <div className="flex items-center">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button
                            className="relative focus:outline-none hover:underline"
                            onClick={handleClick}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={
                                    isActive
                                        ? "/assets/activeBell.svg" // Image when active
                                        : isHovered
                                          ? "/assets/hoverBell.svg" // Image when hovered
                                          : "/assets/notification.png" // Default image
                                }
                                alt="Notification"
                                className="w-5 h-6 mr-1"
                            />
                            <div className="absolute top-0 left-0 w-10 h-10 transition duration-300 ease-in-out rounded-sm opacity-0"></div>
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-custom w-96 max-full ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="">
                                <Menu.Items>
                                    <NotificationPopup />
                                </Menu.Items>

                                <div className="flex flex-row w-full h-10 hover:bg-gray-200 ">
                                    <a
                                        href="/notification"
                                        className="flex items-center w-full px-4 py-2 font-bold text-black rounded bg-white-500"
                                    >
                                        View All
                                        <svg
                                            width="16"
                                            height="12"
                                            viewBox="0 0 16 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-4 ml-4"
                                        >
                                            <path
                                                d="M1 6H8"
                                                stroke="#222222"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M11.7941 5.84152C11.8981 5.92158 11.8981 6.07842 11.7941 6.15848L10.072 7.48418C9.94049 7.58542 9.75 7.49166 9.75 7.32569L9.75 4.6743C9.75 4.50834 9.94049 4.41458 10.072 4.51582L11.7941 5.84152Z"
                                                fill="#222222"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M15 6C15 8.76142 12.7614 11 9.99999 11C8.46035 11 7.08325 10.3041 6.16606 9.2097C6.05778 9.08051 5.90044 9 5.73188 9C5.31911 9 5.069 9.44402 5.32822 9.76525C6.42809 11.1282 8.11223 12 9.99999 12C13.3137 12 16 9.31371 16 6C16 2.68629 13.3137 0 9.99999 0C8.11223 0 6.42809 0.871801 5.32822 2.23475C5.069 2.55598 5.31911 3 5.73188 3C5.90044 3 6.05779 2.91949 6.16606 2.7903C7.08325 1.69589 8.46035 1 9.99999 1C12.7614 1 15 3.23858 15 6Z"
                                                fill="#222222"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>

                <table>
                    <tr>
                        <td>
                            <a href="../profile">
                                <img
                                    src={profileDummy}
                                    alt="Profile"
                                    className="w-12 h-12 ml-4 mr-2 rounded-full"
                                />
                            </a>
                        </td>
                        <td>
                            <span className="mr-2 font-semibold">Username</span>
                        </td>
                    </tr>
                </table>
            </div>
        </header>
    );
};

export default Header;
