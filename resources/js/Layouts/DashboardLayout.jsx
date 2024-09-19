import React from "react";

import Header from "../Components/DashboardHeader";
import Sidebar from "../Components/SideNavBar";

const Layout = ({ children }) => {
    return (
        <div className="flex-row">
            <Header />
            <div className="flex " style={{ backgroundColor: "#F3F4F6" }}>
                <Sidebar />
                <main style={{ width: "100%" }}>{children}</main>
            </div>
        </div>
    );
};

export default Layout;
