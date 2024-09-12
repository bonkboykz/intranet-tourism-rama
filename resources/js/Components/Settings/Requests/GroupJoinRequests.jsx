import { formatTime } from "@/Utils/format";
import { getProfileImage } from "@/Utils/getProfileImage";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// Reusable Row Components
const GroupJoinRow = ({
    id,
    name,
    department,
    time,
    group,
    followers,
    profileImage,
    groupImage,
    status,
    onUpdate,
}) => {
    const [loading, setLoading] = useState(false);
    const onApprove = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/approveGroupJoinRequest", {
                request_id: id,
            });

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
            const response = await axios.post("/api/rejectGroupJoinRequest", {
                request_id: id,
            });

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
                to join
            </p>
            <div className="flex items-center w-1/4">
                <img
                    className="w-10 h-10 rounded-full"
                    src={groupImage}
                    alt="Group"
                />
                <div className="ml-3">
                    <p className="text-sm font-bold text-black">{group}</p>
                    <p className="text-xs text-gray-400">{followers}</p>
                </div>
            </div>
            {status === "pending" && (
                <div className="flex justify-end w-1/4">
                    {loading === true ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <button
                                className="px-4 py-1 text-sm font-bold text-white bg-blue-500 rounded-full"
                                onClick={onApprove}
                            >
                                Approve
                            </button>
                            <button
                                className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full"
                                onClick={onReject}
                            >
                                Reject
                            </button>
                        </>
                    )}
                </div>
            )}

            {status === "approved" && (
                <div className="flex justify-end w-1/4">
                    <p className="text-sm font-bold text-green-500">Approved</p>
                </div>
            )}

            {status === "rejected" && (
                <div className="flex justify-end w-1/4">
                    <p className="text-sm font-bold text-red-500">Rejected</p>
                </div>
            )}
        </div>
    );
};

export const GroupJoinRequests = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/getGroupJoinRequests", {
                params: {
                    sort: [{ created_at: "desc" }],
                },
            });

            if ([200, 201, 204].includes(response.status)) {
                const {
                    data: { data },
                } = response.data;

                console.log(data);

                setRequests(data);
            }
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const preparedRequests = requests.map((request, index) => ({
        id: request.id,
        name: request.user.name,
        department: request.userDepartment,
        time: new Date(request.created_at),
        group: request.group.name,
        followers: `${request.groupFollowersCount} followers`,
        profileImage: getProfileImage(request.userProfile, request.user.name),
        groupImage: request.group.banner ?? "/assets/defaultCommunity.png",
        status: request.status,
    }));

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-5">
            <h2 className="mb-4 text-2xl font-bold text-blue-500">
                Group Join
            </h2>
            {loading ? (
                <div className="w-full flex items-center justify-center">
                    <Loader2 className="w-16 h-16 animate-spin" />
                </div>
            ) : (
                preparedRequests.map((data, index) => (
                    <GroupJoinRow
                        key={data.id}
                        {...data}
                        onUpdate={fetchRequests}
                    />
                ))
            )}
        </section>
    );
};