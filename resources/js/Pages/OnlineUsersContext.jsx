import React, { createContext, useEffect, useState } from "react";

import dummyProfilePic from "../../../public/assets/dummyProfilePic.png";

export const OnlineUsersContext = createContext();

export const OnlineUsersProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const channel = window.Echo.join("online")
            .here((users) => {
                setOnlineUsers(
                    users.map((user) => ({ ...user, avatar: dummyProfilePic }))
                );
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => [
                    ...prevOnlineUsers,
                    { ...user, avatar: dummyProfilePic },
                ]);
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) =>
                    prevOnlineUsers.filter(
                        (onlineUser) => onlineUser.id !== user.id
                    )
                );
            });

        return () => {
            channel.leave();
        };
    }, []);

    return (
        <OnlineUsersContext.Provider value={{ onlineUsers }}>
            {children}
        </OnlineUsersContext.Provider>
    );
};
