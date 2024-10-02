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
    const [role, setRole] = useState("All");

    return (
        <>
            <AuditTrailSearch
                setRole={setRole} // Pass the handleUserType function
                search={search}
                onSearch={setSearch}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
            />
            <AuditTrailTable
                search={search}
                startDate={startDate}
                endDate={endDate}
                role={role}
            />
        </>
    );
}
