import React from "react";
import { useState } from "react";

import { usePermissions } from "@/Utils/hooks/usePermissions";

import Header from "../Components/DashboardHeaderNew";
import Sidebar from "../Components/SideNavBarNew";
import {
    NotificationsContext,
    useSetupNotifications,
} from "./useNotifications";
import { useSetupWhosOnline, WhosOnlineContext } from "./useWhosOnline";

import "../Components/Reusable/css/FileManagementSearchBar.css";

const Example = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        notifications,
        hasNewNotifications,
        setHasNewNotifications,
        fetchNotifications,
    } = useSetupNotifications();

    const { onlineUsers } = useSetupWhosOnline();

    return (
        <WhosOnlineContext.Provider
            value={{
                onlineUsers,
            }}
        >
            <NotificationsContext.Provider
                value={{
                    notifications,
                    hasNewNotifications,
                    setHasNewNotifications,
                    fetchNotifications,
                }}
            >
                <div>
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <div className="lg:pl-20 pt-16">
                        <Header setSidebarOpen={setSidebarOpen} />
                        <main>{children}</main>
                    </div>
                </div>
            </NotificationsContext.Provider>
        </WhosOnlineContext.Provider>
    );
};

export default Example;
