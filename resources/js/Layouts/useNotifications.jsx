import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

export const NotificationsContext = createContext({
    notifications: [],
    setNotifications: () => {},
});

export function useSetupNotifications() {
    const [notifications, setNotifications] = useState([]);

    const {
        props: {
            auth: { user },
        },
    } = usePage();

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("/api/notifications/recent");

            if ([200, 201, 204].includes(response.status)) {
                const {
                    data: { data },
                } = response.data;

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
        // Listen for notifications on the user's private channel
        // window.Echo.private(`user.${user.id}`).listen(
        //     ".notification-event",
        //     (e) => {
        //         setNotifications([...notifications, e.notification]);
        //         console.log("New notification received:", e.notification);
        //     }
        // );

        console.log(`Listening for notifications on users.${user.id}`);

        window.Echo.private(`users.${user.id}`)
            .notification((notification) => {
                console.log("Notification received:", notification);
            })
            .listenToAll((event, data) => {
                console.log(event, data);
            });

        // window.Echo.channel(`users.${user.id}`).listenToAll((event, data) => {
        //     // do what you need to do based on the event name and data
        //     console.log(event, data);
        // });
        // .listen(
        //     ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
        //     (e) => {
        //         // setNotifications([...notifications, e.notification]);
        //         console.log("New notification received:", e.notification);
        //     }
        // )
        // .listen(".App\\Notifications\\RequestNotification", (e) => {
        //     // setNotifications([...notifications, e.notification]);
        //     console.log("New notification received:", e.notification);
        // });

        // window.Echo.private(`user.${user.id}`)
        //     .notification((notification) => {
        //         console.log("Notification received:", notification);
        //     })
        //     .listen(".notification-event", (e) => {
        //         setNotifications([...notifications, e.notification]);
        //         console.log("New notification received:", e.notification);
        //     });

        return () => {
            console.log(`Leaving users.${user.id}`);
            window.Echo.leave(`users.${user.id}`);
            // Unsubscribe from the private channel when the component is unmounted
            // window.Echo.leaveChannel(`user.${user.id}`);
        };
    }, []);

    return { notifications, setNotifications };
}

export function useNotifications() {
    const { notifications } = useContext(NotificationsContext);

    return {
        notifications,
    };
}
