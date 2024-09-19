import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { useRef } from "react";

import dummyProfilePic from "../../../public/assets/dummyProfilePic.png";

export const WhosOnlineContext = createContext({
    onlineUsers: [],
});

export function useSetupWhosOnline() {
    const [onlineUsers, setOnlineUsers] = useState([]);

    const pendingOfflineUsers = useRef(new Set([]));

    const checkIfUserIsStillOffline = (user) => {
        const offlineTimeout = 5 * 60 * 1000;

        // if after 5 mins user is still in pending offline users, remove them
        setTimeout(() => {
            if (pendingOfflineUsers.current.has(user.id)) {
                setOnlineUsers((prevOnlineUsers) =>
                    prevOnlineUsers.filter(
                        (onlineUser) => onlineUser.id !== user.id
                    )
                );

                pendingOfflineUsers.current.delete(user.id);
            }
        }, offlineTimeout);
    };

    useEffect(() => {
        window.Echo.join("online")
            .here((users) => {
                const dedupedUsers = users.filter(
                    (user) =>
                        !onlineUsers.find(
                            (onlineUser) => onlineUser.id === user.id
                        )
                );

                setOnlineUsers(
                    dedupedUsers.map((user) => ({
                        ...user,
                        avatar: dummyProfilePic,
                    }))
                );
            })
            .joining((user) => {
                if (
                    onlineUsers.find((onlineUser) => onlineUser.id === user.id)
                ) {
                    return;
                }

                if (pendingOfflineUsers.current.has(user.id)) {
                    pendingOfflineUsers.current.delete(user.id);
                    return;
                }

                setOnlineUsers((prevOnlineUsers) => [
                    ...prevOnlineUsers,
                    { ...user, avatar: dummyProfilePic },
                ]);
            })
            .leaving((user) => {
                // add to pending offline users
                pendingOfflineUsers.current.add(user.id);

                checkIfUserIsStillOffline(user);
            });

        return () => {
            window.Echo.leave("online");
        };
    }, []);

    return { onlineUsers };
}

export function useWhosOnline() {
    const { onlineUsers } = useContext(WhosOnlineContext);

    return { onlineUsers };
}
