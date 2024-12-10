import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { formatTime } from "@/Utils/format";
import { getProfileImage } from "@/Utils/getProfileImage";
import { useLazyLoading } from "@/Utils/hooks/useLazyLoading.jsx";

import aishaImage from "../../../../../public/assets/aishaImage.png";
import community1 from "../../../../../public/assets/community1.png";
import thomasImage from "../../../../../public/assets/thomasImage.png";

const communityCreationData = [
    {
        name: "Thomas",
        department: "Department",
        time: "2024-06-20T02:00:00Z",
        group: "Malaysia's spots",
        followers: "12,543 followers",
        profileImage: thomasImage,
        groupImage: community1,
    },
    {
        name: "Aisha Binti",
        department: "Department",
        time: "2024-06-19T04:00:00Z",
        group: "Where to Go",
        followers: "14,567 followers",
        profileImage: aishaImage,
        groupImage: community1,
    },
];

const CommunityCreationRow = ({
    id,
    name,
    department,
    time,
    group,
    profileImage,
    groupImage,
    onUpdate,
    status,
}) => {
    const [loading, setLoading] = useState(false);
    const onApprove = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                "/api/approveCommunityCreateRequest",
                {
                    request_id: id,
                }
            );

            if ([200, 201, 204].includes(response.status)) {
                console.log("Approved");

                onUpdate();
            }
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const onReject = async () => {
        setLoading(true);

        try {
            const response = await axios.post(
                "/api/rejectCommunityCreateRequest",
                {
                    request_id: id,
                }
            );

            if ([200, 201, 204].includes(response.status)) {
                console.log("Rejected");

                onUpdate();
            }
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-between py-4 border-t border-gray-200">
            <div className="flex items-center w-1/4 max-md:flex-col max-md:justify-start max-md:items-start">
                <img
                    className="w-10 h-10 rounded-full"
                    src={profileImage}
                    alt="User profile"
                />
                <div className="ml-3 max-md:ml-0 max-md:mt-1">
                    <p className="text-sm font-bold text-black">
                        {name} ({department})
                    </p>
                    <p className="text-xs font-semibold text-gray-600">
                        {formatTime(time)}
                    </p>
                </div>
            </div>
            <p className="w-1/4 text-xs font-semibold text-center text-black">
                wants to create
            </p>
            <div className="flex items-center w-1/4 max-md:flex-col max-md:justify-center max-md:items-center max-md:mx-3">
                <img
                    className="w-10 h-10 rounded-full"
                    src={groupImage}
                    alt="Group"
                />
                <div className="ml-3 max-md:ml-0 max-md:mt-1">
                    <p className="text-sm font-bold text-black max-md:text-center">
                        {group}
                    </p>
                </div>
            </div>
            {status === "pending" && (
                <div className="flex justify-end w-1/4 max-md:flex-col max-md:justify-center max-md:gap-2">
                    {loading === true ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <button
                                className="px-4 py-1 text-sm font-bold text-white bg-primary rounded-full"
                                onClick={onApprove}
                            >
                                Approve
                            </button>
                            <button
                                className="px-4 py-1 ml-2 max-md:ml-0 text-sm font-bold text-white bg-[#FF5436] rounded-full"
                                onClick={onReject}
                            >
                                Reject
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export const CommunityCreationRequests = () => {
    const { data: requests, fetchData } = useLazyLoading(
        "api/getCommunityCreateRequests",
        {
            sort: [{ created_at: "desc" }],
        }
    );
    const preparedRequests = requests
        .filter(
            (item) => item.status !== "approved" && item.status !== "rejected"
        )
        .map((request) => ({
            id: request.id,
            name: request.user.name,
            department: request.userDepartment,
            time: new Date(request.created_at),
            group: request.group.name,
            profileImage: getProfileImage(
                request.userProfile,
                request.user.name
            ),
            groupImage: request.group.banner ?? "/assets/defaultCommunity.png",
            status: request.status,
        }));

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-5">
            <h2 className="mb-4 text-2xl font-bold text-primary">
                Community Creation
            </h2>
            {preparedRequests.length > 0 ? (
                preparedRequests.map((data, index) => (
                    <CommunityCreationRow
                        key={index}
                        {...data}
                        onUpdate={() => fetchData(false)}
                    />
                ))
            ) : (
                <div className="flex items-center justify-center w-full h-32">
                    <p className="text-lg font-semibold text-gray-400">
                        No requests found
                    </p>
                </div>
            )}
        </section>
    );
};
