import { React } from "react";

import ProfileInformationRequest from "@/Components/Settings/Requests/ProfileInformationRequest.jsx";

import { CommunityCreationRequests } from "./Requests/CommunityCreationRequests";
import { CommunityDeletionRequests } from "./Requests/CommunityDeletionRequests";
import { GroupJoinRequests } from "./Requests/GroupJoinRequests";
import { StaffPhotoChangeRequests } from "./Requests/StaffPhotoChangeRequests";

// Main Component
const Requests = () => {
    return (
        <div>
            <GroupJoinRequests />
            <CommunityCreationRequests />
            <CommunityDeletionRequests />
            <StaffPhotoChangeRequests />
            <ProfileInformationRequest />
        </div>
    );
};

export default Requests;
