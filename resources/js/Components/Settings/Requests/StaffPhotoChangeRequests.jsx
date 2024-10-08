import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { formatTime } from "@/Utils/format";
import { getProfileImage, getStaffImage } from "@/Utils/getProfileImage";
import { useLazyLoading, useLoading } from "@/Utils/hooks/useLazyLoading";

const OrgChartPhotoChangeRow = ({
    id,
    name,
    department,
    time,
    currentImage,
    changeImage,
    onUpdate,
    status,
}) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const onApprove = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                "/api/approveChangeStaffImageRequest",
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
                "/api/rejectChangeStaffImageRequest",
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
        <>
            <div className="relative flex items-center justify-between py-4 border-t border-gray-200">
                <div className="flex items-center w-1/4">
                    <img
                        className="w-10 h-10 rounded-full"
                        src={currentImage}
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
                    change to
                </p>
                <div className="flex items-center w-1/4">
                    <img
                        className="w-10 h-10 rounded-full cursor-pointer"
                        src={changeImage}
                        alt="Change"
                        onClick={() => setIsPopupVisible(true)}
                    />
                </div>
                {status === "pending" && (
                    <div className="flex justify-end w-1/4">
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
                        <p className="text-sm font-bold text-green-500">
                            Approved
                        </p>
                    </div>
                )}

                {status === "rejected" && (
                    <div className="flex justify-end w-1/4">
                        <p className="text-sm font-bold text-red-500">
                            Rejected
                        </p>
                    </div>
                )}
            </div>

            {isPopupVisible && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 bg-grey-100 backdrop-blur-sm"
                    onClick={() => setIsPopupVisible(false)}
                >
                    <div
                        className="relative p-4 bg-white rounded-lg shadow-custom"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            className="object-cover rounded-lg w-96 h-96"
                            src={changeImage}
                            alt="Change"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export const StaffPhotoChangeRequests = () => {
    const {
        data: requests,
        fetchData,
        setCurrentPage,
    } = useLazyLoading("/api/getChangeStaffImageRequests", {
        sort: [{ created_at: "desc" }],
    });

    const preparedRequests = requests.map((request, index) => ({
        id: request.id,
        name: request.user.name,
        department: request.userDepartment,
        time: new Date(request.created_at),
        currentImage: getStaffImage(request.userProfile, request.user.name),
        status: request.status,
        changeImage: `/storage/${request.new_photo}`,
    }));

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-5">
            <h2 className="mb-4 text-2xl font-bold text-blue-500">
                Organisational Chart Photo Change
            </h2>

            {preparedRequests.length > 0 ? (
                preparedRequests.map((data, index) => (
                    <OrgChartPhotoChangeRow
                        key={index}
                        {...data}
                        onUpdate={() => {
                            setCurrentPage(1);
                            fetchData(false);
                        }}
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
