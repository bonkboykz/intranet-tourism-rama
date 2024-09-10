import React from "react";
import Header from "../Components/DashboardHeaderNew";
import Sidebar from "../Components/SideNavBarNew";
import { useState } from "react";
import "../Components/Reusable/css/FileManagementSearchBar.css";
import {
    NotificationsContext,
    useSetupNotifications,
} from "./useNotifications";

const Example = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { notifications } = useSetupNotifications();

    return (
        <NotificationsContext.Provider value={{ notifications }}>
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
    );
};

export default Example;
