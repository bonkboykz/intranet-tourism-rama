import React from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

import { useSetupTheme } from "@/Utils/hooks/useTheme";

import Header from "../Components/DashboardHeaderNew";
import Sidebar from "../Components/SideNavBarNew";
import {
    NotificationsContext,
    useSetupNotifications,
} from "./useNotifications";
import { SettingsContext, useSetupSettings } from "./useSettings";
import { UserContext, useSetupUser } from "./useUser";
import { useSetupWhosOnline, WhosOnlineContext } from "./useWhosOnline";

import "../Components/Reusable/css/FileManagementSearchBar.css";
import "react-toastify/dist/ReactToastify.css";

const Example = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        notifications,
        hasNewNotifications,
        setHasNewNotifications,
        fetchNotifications,
    } = useSetupNotifications();

    const { onlineUsers } = useSetupWhosOnline();

    const { user, userData } = useSetupUser();

    const { settings, fetchSettings } = useSetupSettings();

    useSetupTheme();

    return (
        <SettingsContext.Provider
            value={{
                settings,
                fetchSettings,
            }}
        >
            <UserContext.Provider
                value={{
                    user,
                    userData,
                }}
            >
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
                            <ToastContainer />
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
            </UserContext.Provider>
        </SettingsContext.Provider>
    );
};

export default Example;
