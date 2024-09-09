import React from "react";
import Header from "../Components/DashboardHeaderNew";
import Sidebar from "../Components/SideNavBarNew";
import { useState } from "react";
import "../Components/Reusable/css/FileManagementSearchBar.css";

const Example = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
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
    );
};

export default Example;
