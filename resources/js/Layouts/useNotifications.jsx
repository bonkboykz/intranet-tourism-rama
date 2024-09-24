import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

export const NotificationsContext = createContext({
    notifications: [],
    setNotifications: () => {},
    hasNewNotifications: false,
});

export function useSetupNotifications() {
    // TODO: When optimizing return to this
    // const { notifications: initialNotifications = [] } = usePage().props;

    const [notifications, setNotifications] = useState([]);
    const [hasNewNotifications, setHasNewNotifications] = useState(false);

    const {
        props: {
            auth: { user },
        },
    } = usePage();

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("/api/notifications/recent");

            if ([200, 201, 204].includes(response.status)) {
                // const {
                //     data: { data },
                // } = response.data;

                // console.log(response.data.data);

                setNotifications(response.data.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        console.log(`Listening for notifications on users.${user.id}`);

        window.Echo.private(`users.${user.id}`).notification(
            async (notification) => {
                console.log("Notification received:", notification);

                // const audio = new Audio("/assets/notification.wav");
                // audio.play();

                setHasNewNotifications(true);

                try {
                    await fetchNotifications();
                } catch (e) {
                    console.error(e);
                }

                // setNotifications([...notifications, notification]);
            }
        );

        return () => {
            console.log(`Leaving users.${user.id}`);
            window.Echo.leave(`users.${user.id}`);
        };
    }, []);

    return {
        notifications,
        setNotifications,
        hasNewNotifications,
        setHasNewNotifications,
        fetchNotifications,
    };
}

export function useNotifications() {
    const {
        notifications,
        hasNewNotifications,
        setHasNewNotifications,
        fetchNotifications,
    } = useContext(NotificationsContext);

    return {
        notifications,
        hasNewNotifications,
        setHasNewNotifications,
        fetchNotifications,
    };
}
