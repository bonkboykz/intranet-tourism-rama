import { React } from "react";

import ProfileInformationRequest from "@/Components/Settings/Requests/ProfileInformationRequest.jsx";

import { CommunityCreationRequests } from "./Requests/CommunityCreationRequests";
import { GroupJoinRequests } from "./Requests/GroupJoinRequests";
import { StaffPhotoChangeRequests } from "./Requests/StaffPhotoChangeRequests";

// Main Component
const Requests = () => {
    return (
        <div>
            <GroupJoinRequests />
            <CommunityCreationRequests />
            <StaffPhotoChangeRequests />
            <ProfileInformationRequest />
        </div>
    );
};

export default Requests;
