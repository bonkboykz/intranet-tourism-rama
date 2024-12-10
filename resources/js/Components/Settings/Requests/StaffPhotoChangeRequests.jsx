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
    const [isStatus, setIsStatus] = useState("");

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
                setIsStatus("approved");

                setTimeout(() => onUpdate(), 10000);
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
                setIsStatus("rejected");

                setTimeout(() => onUpdate(), 10000);
            }
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    return (
        <>
            <div className="relative flex items-center justify-between py-4 border-t border-gray-200">
                <div className="flex items-center w-1/4 max-md:flex-col max-md:justify-start max-md:items-start">
                    <img
                        className="w-10 h-10 rounded-full"
                        src={currentImage}
                        alt="User profile"
                    />
                    <div className="ml-3 max-md:ml-0 max-md:mt-1">
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
                <div className="flex items-center w-1/4 max-md:flex-col max-md:justify-center max-md:items-center max-md:mx-3">
                    <img
                        className="w-10 h-10 rounded-full cursor-pointer"
                        src={changeImage}
                        alt="Change"
                        onClick={() => setIsPopupVisible(true)}
                    />
                </div>
                {status === "pending" && (
                    <div className="flex justify-end w-1/4 max-md:flex-col max-md:justify-center max-md:gap-2">
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : isStatus === "approved" ? (
                            <span className="text-green-600 font-bold">
                                Approved
                            </span>
                        ) : isStatus === "rejected" ? (
                            <span className="text-red-600 font-bold">
                                Rejected
                            </span>
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

    const preparedRequests = requests
        .filter(
            (item) => item.status !== "approved" && item.status !== "rejected"
        )
        .map((request, index) => ({
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
            <h2 className="mb-4 text-2xl font-bold text-primary">
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
