import React, { useState, useEffect } from "react";

const Sidebar = () => {
    // Path to buttons
    const buttons = [
        {
            inactive: "assets/dashboard.png",
            active: "assets/dashboardActive.png",
        },
        {
            inactive: "assets/staffDirectory.png",
            to: "/staffDirectory",
            active: "assets/staffDirectoryActive.png",
            text: "Benjamin",
        },
        {
            name: "Calendar",
            to: "/calendar",
            inactive: "assets/calendar.png",
            active: "assets/calendarActive.png",
            text: "Benjamin",
        },
        {
            inactive: "assets/departments.png",
            to: "/departments",
            active: "assets/departmentsActive.png",
            text: "Benjamin",
        },
        {
            inactive: "assets/groups.png",
            to: "/community",
            active: "assets/groupsActive.png",
            text: "Benjamin",
        },
        {
            inactive: "assets/fileManagement.png",
            to: "/file-management",
            active: "assets/fileManagementActive.png",
        },
        { inactive: "assets/links.png", active: "assets/linksActive.png" },
        {
            inactive: "assets/settings.png",
            active: "assets/settingsActive.png",
        },
        {
            inactive: "assets/logout.png",
            to: "/logout",
            active: "assets/logout.png",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(null);
    const [csrfToken, setCsrfToken] = useState(null);

    console.log("csrfToken", csrfToken);

    // Fetch the CSRF token once
    useEffect(() => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");
        setCsrfToken(token);
    }, []);

    // Function to handle logout
    const handleLogout = () => {
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
        })
            .then(() => {
                window.location.href = "/";
            })
            .catch((err) => console.error(err));
    };

    return (
        <aside className="h-screen mt-1 text-white bg-white shadow-lg w-30 sticky top-0 relative">
            <nav className="flex flex-col p-4 space-y-2">
                {buttons.map((button, i) => {
                    if (button.to === "/logout") {
                        return (
                            <a
                                href="#"
                                key={i}
                                className={`z-10 w-full flex justify-center ${
                                    activeIndex === i ? "active" : ""
                                }`}
                                onClick={() => {
                                    setActiveIndex(i);
                                    handleLogout();
                                }}
                            >
                                <img
                                    src={
                                        activeIndex === i
                                            ? button.active
                                            : button.inactive
                                    }
                                    alt="Logout"
                                    className="w-12 h-12 mx-auto"
                                />
                            </a>
                        );
                    }

                    return (
                        <a
                            href={button.to}
                            key={i}
                            className={`z-10 w-full flex justify-center ${
                                activeIndex === i ? "active" : ""
                            }`}
                            onClick={() => setActiveIndex(i)}
                        >
                            <img
                                src={
                                    activeIndex === i
                                        ? button.active
                                        : button.inactive
                                }
                                alt={button.name || ""}
                                className="w-12 h-12 mx-auto"
                                onMouseEnter={() => setActiveIndex(i)}
                                onMouseLeave={() => setActiveIndex(null)}
                            />
                        </a>
                    );
                })}
            </nav>
            {showText && (
                <div
                    className="absolute bg-gray-700 text-white text-xs rounded py-1 px-2 z-20"
                    style={{
                        top: showTextPosition.top,
                        left: showTextPosition.left,
                    }}
                >
                    {showText}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
