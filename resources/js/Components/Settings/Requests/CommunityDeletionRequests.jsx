import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { formatTime } from "@/Utils/format";
import { getProfileImage } from "@/Utils/getProfileImage";
import { useLazyLoading } from "@/Utils/hooks/useLazyLoading.jsx";

const CommunityDeletionRow = ({
    id,
    communityId,
    name,
    department,
    time,
    group,
    profileImage,
    groupImage,
    status,
    onUpdate,
    onDelete,
}) => {
    const [loading, setLoading] = useState(false);

    const onApprove = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                "/api/approveCommunityDeleteRequest",
                {
                    request_id: id,
                    community_id: communityId,
                }
            );

            if (
                response.status === 200 &&
                response.data.status === "approved"
            ) {
                toast.success("Community deletion request approved");

                onDelete(communityId);
                onUpdate();
            }
        } catch (error) {
            console.error("Error approving deletion:", error);
            toast.error("Failed to approve community deletion");
        }
        setLoading(false);
    };

    const onReject = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                "/api/rejectCommunityDeleteRequest",
                {
                    request_id: id,
                }
            );

            if ([200, 201, 204].includes(response.status)) {
                toast.success("Community deletion request rejected");
                onUpdate();
            }
        } catch (error) {
            console.error("Error rejecting deletion:", error);
            toast.error("Failed to reject community deletion");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-between py-4 border-t border-gray-200">
            <div className="flex items-center w-1/4">
                <img
                    className="w-10 h-10 rounded-full"
                    src={profileImage}
                    alt="User profile"
                />
                <div className="ml-3">
                    <p className="text-sm font-bold text-black">
                        {name} ({department})
                    </p>
                    <p className="text-xs font-semibold text-black">
                        {formatTime(time)}
                    </p>
                </div>
            </div>
            <p className="w-1/4 text-xs font-semibold text-center text-black">
                wants to delete
            </p>
            <div className="flex items-center w-1/4">
                <img
                    className="w-10 h-10 rounded-full"
                    src={groupImage}
                    alt="Group"
                />
                <div className="ml-3">
                    <p className="text-sm font-bold text-black">{group}</p>
                </div>
            </div>
            {status === "pending" && (
                <div className="flex justify-end w-1/4">
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <button
                                className="px-4 py-1 text-sm font-bold text-white bg-primary rounded-full"
                                onClick={onApprove}
                                disabled={loading}
                            >
                                Approve
                            </button>
                            <button
                                className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full"
                                onClick={onReject}
                                disabled={loading}
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

export const CommunityDeletionRequests = () => {
    const { data: requestsData, fetchData } = useLazyLoading(
        "api/getCommunityDeleteRequests",
        {
            sort: [{ created_at: "desc" }],
        }
    );

    const [requests, setRequests] = useState([]);

    const onDelete = (communityId) => {
        setRequests((prevRequests) =>
            prevRequests.filter(
                (request) => request.details.community_id !== communityId
            )
        );
    };

    const updateRequests = () => {
        fetchData(false);
    };

    useEffect(() => {
        setRequests(
            requestsData.filter(
                (item) =>
                    item.status !== "approved" && item.status !== "rejected"
            )
        );
    }, [requestsData]);

    const preparedRequests = requests.map((request) => ({
        id: request.id,
        communityId: request.details.community_id,
        name: request.user.name,
        department: request.userDepartment,
        time: new Date(request.created_at),
        group: request.group.name,
        profileImage: getProfileImage(request.userProfile, request.user.name),
        groupImage: request.group.banner ?? "/assets/defaultCommunity.png",
        status: request.status,
    }));

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-5">
            <h2 className="mb-4 text-2xl font-bold text-primary">
                Community Deletion
            </h2>
            {preparedRequests.length > 0 ? (
                preparedRequests.map((data, index) => (
                    <CommunityDeletionRow
                        key={index}
                        {...data}
                        onDelete={onDelete}
                        onUpdate={updateRequests}
                    />
                ))
            ) : (
                <div className="flex items-center justify-center w-full h-32">
                    <p className="text-lg font-semibold text-gray-400">
                        No deletion requests found
                    </p>
                </div>
            )}
        </section>
    );
};
