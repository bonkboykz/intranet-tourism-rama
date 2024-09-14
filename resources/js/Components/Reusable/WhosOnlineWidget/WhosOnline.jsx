import React, { useState } from "react";
import { createPortal } from "react-dom";

import { useWhosOnline } from "@/Layouts/useWhosOnline";

import arrowRight from "../../../../../public/assets/viewAllArrow.png";
import UserAvatar from "./UserAvatar";

import "../css/WhosOnline.css";
import "@fontsource/nunito-sans/400.css"; // Specify weight
import "@fontsource/nunito-sans/400-italic.css"; // Specify weight and style

import "@fontsource/nunito-sans"; // Defaults to weight 400

const Tooltip = ({ item, position }) => {
    const tooltipStyles = {
        position: "fixed",
        left: `${position.left + position.width / 2}px`,
        top: `${position.bottom}px`,
        transform: "translateX(-50%)", // Center horizontally
        marginTop: "1rem", // Space between the avatar and the tooltip
        backgroundColor: "#1a1a1a",
        color: "#fff",
        fontSize: "0.75rem",
        borderRadius: "0.25rem",
        padding: "0.5rem",
        zIndex: 9999,
        whiteSpace: "nowrap",
    };

    return createPortal(
        <div style={tooltipStyles}>{item.name}</div>,
        document.body
    );
};

const WhosOnline = () => {
    const [tooltip, setTooltip] = useState({
        visible: false,
        user: null,
        position: {},
    });

    const { onlineUsers } = useWhosOnline();

    const handleMouseEnter = (event, user) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltip({
            visible: true,
            user,
            position: rect,
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ visible: false, user: null, position: {} });
    };

    return (
        <div className="whos-online-container border-2 shadow-2xl flex-col justify-start">
            <div className="whos-online-header flex justify-between items-center">
                <h2
                    style={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        fontFamily: "Nunito Sans",
                    }}
                >
                    Who&apos;s Online
                </h2>
                <span
                    className="online-count"
                    style={{
                        fontFamily: "Nunito Sans",
                        fontWeight: "bold",
                        fontSize: "18px",
                    }}
                >
                    {onlineUsers.length}
                </span>
            </div>
            <hr
                style={{ marginTop: "5px", marginBottom: "5px" }}
                className="underline"
            />
            <div className="online-users text-left flex justify-start">
                {onlineUsers.length === 0 ? (
                    <p>No one is online</p>
                ) : (
                    onlineUsers.map((user, index) => (
                        <div
                            key={index}
                            onMouseEnter={(event) =>
                                handleMouseEnter(event, user)
                            }
                            onMouseLeave={handleMouseLeave}
                        >
                            <UserAvatar {...user} ID_USER={user.id} />
                        </div>
                    ))
                )}
            </div>
            <hr
                style={{ marginTop: "5px", marginBottom: "5px" }}
                className="underline"
            />
            <div className="view-all-container">
                <a href="../onlinelist">
                    <button
                        style={{ fontFamily: "Nunito Sans" }}
                        className="view-all-btn"
                    >
                        VIEW ALL
                        <img
                            src={arrowRight}
                            alt="Arrow right"
                            className="arrow-icon"
                        />
                    </button>
                </a>
            </div>
            {tooltip.visible && (
                <Tooltip item={tooltip.user} position={tooltip.position} />
            )}
        </div>
    );
};

export default WhosOnline;
