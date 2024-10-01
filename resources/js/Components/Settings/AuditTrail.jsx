import React, { useEffect, useRef, useState } from "react";
import { format, startOfMonth } from "date-fns";

import { AuditTrailSearch } from "./AuditTrail/Search";
import { AuditTrailTable } from "./AuditTrail/Table";

export function AuditTrail() {
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(
        format(startOfMonth(new Date()), "yyyy-MM-dd")
    );
    const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));


    const options = [
        { value: "All", label: "All" },
        { value: "superadmin", label: "SuperAdmin" },
        { value: "admin_department", label: "Department Admin" },
        { value: "admin_community", label: "Community Admin" },
        { value: "user", label: "User" }
    ];


    const [selectedType, setSelectedType] = useState(options[0]); // State for the selected user type


    const handleUserType = (type) => {
        setSelectedType(type);
        console.log("Selected user type:", type); // You can perform additional actions here
    };

    return (
        <>
            <AuditTrailSearch
                onChange={handleUserType} // Pass the handleUserType function
                search={search}
                onSearch={setSearch}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                options={options}
            />
            <AuditTrailTable
                search={search}
                startDate={startDate}
                endDate={endDate}
                userRoles={selectedType}
            />
        </>
    );
}
