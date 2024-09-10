import React from "react";
import NotificationPopup from "../Components/NotificationPopup";

const NotificationDy = () => {
    return (
        <div className="custom-notification-container flex flex-colum">
            <div>My Notifications</div>
            <div>
                <NotificationPopup />
            </div>

            <style jsx>{`
                .custom-notification-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh; /* Full viewport height */
                    width: 100%;
                    background-color: rgb(226 232 240);

                    /* Optional: background color for the container */
                }
                .custom-notification-container .notification-list {
                    /* Custom styles for the notification list */
                }

                .custom-notification-container .notification-box {
                    margin-top: 100px;
                    width: 900px;
                    height: 80vh;
                    position: relative;
                }
                .custom-notification-container .tab-button {
                    /* Custom styles for the tab buttons */
                }
                /* Add more custom styles as needed */
            `}</style>
        </div>
    );
};

export default NotificationDy;
