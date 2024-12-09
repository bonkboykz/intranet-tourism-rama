import { React, useEffect, useState } from "react";
import axios from "axios";

import { formatTime } from "@/Utils/format.js";
import { getProfileImage } from "@/Utils/getProfileImage.js";
import { useLazyLoading } from "@/Utils/hooks/useLazyLoading.jsx";

const ProfileInformationRow = ({
    name,
    department,
    time,
    profileImage,
    changeType,
    oldOfficeNumber,
    newOfficeNumber,
    oldUnit,
    newUnit,
    oldLocation,
    newLocation,
    location,
    id,
    status,
    onUpdate,
}) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleApprove = async () => {
        try {
            const response = await axios.post(
                `api/approveRequestForUpdateProfileDepartment`,
                {
                    request_id: id,
                }
            );
            if ([200, 201, 204].includes(response.status)) {
                console.log("Approved");

                onUpdate();
            }
        } catch (error) {
            console.error("Error approving request:", error);
        }
    };

    const handleReject = async () => {
        try {
            const response = await axios.post(
                `api/rejectRequestForUpdateProfileDepartment`,
                {
                    request_id: id,
                }
            );
            if ([200, 201, 204].includes(response.status)) {
                console.log("Approved");

                onUpdate();
            }
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

    return (
        <>
            <div className="relative flex items-center justify-between py-4 border-t border-gray-200">
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
                    want to change of
                </p>
                <div className="flex items-center w-1/4">
                    <p
                        className="font-medium text-primary cursor-pointer"
                        onClick={() => setIsPopupVisible(true)}
                    >
                        {changeType}
                    </p>
                </div>
                <div className="flex justify-end w-1/4">
                    <button
                        onClick={handleApprove}
                        className="px-4 py-1 text-sm font-bold text-white bg-primary rounded-full"
                    >
                        Approve
                    </button>
                    <button
                        onClick={handleReject}
                        className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full"
                    >
                        Reject
                    </button>
                </div>
            </div>

            {isPopupVisible && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm"
                    onClick={() => setIsPopupVisible(false)}
                >
                    <div
                        className="relative p-8 bg-white shadow-custom rounded-xl w-120"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <h2 className="mb-4 text-lg font-bold">
                                {name} wants to change {changeType}
                            </h2>
                            <hr
                                className="border-t border-gray-300"
                                style={{
                                    borderColor: "#E4E4E4",
                                    width: "100%",
                                }}
                            />
                            <p className="mb-4 text-xl font-bold text-left flex flex-col gap-3">
                                <a className="text-xl font-bold">
                                    Unit from{" "}
                                    <span className={"text-primary"}>
                                        {oldUnit !== null ? oldUnit : "No Unit"}
                                    </span>{" "}
                                    to{" "}
                                    <span className={"text-red-500"}>
                                        {newUnit}
                                    </span>
                                </a>
                                <a className="text-xl font-bold">
                                    Location from{" "}
                                    <span className={"text-primary"}>
                                        {oldLocation}
                                    </span>{" "}
                                    to{" "}
                                    <span className={"text-red-500"}>
                                        {newLocation}
                                    </span>
                                </a>
                                <a className="text-xl font-bold">
                                    Office number from{" "}
                                    <span className={"text-primary"}>
                                        {oldOfficeNumber}
                                    </span>{" "}
                                    to{" "}
                                    <span className={"text-red-500"}>
                                        {newOfficeNumber}
                                    </span>
                                </a>
                            </p>
                            <button
                                className="px-4 py-2 text-white bg-primary rounded-full"
                                onClick={() => setIsPopupVisible(false)}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const ProfileInformationRequest = () => {
    const { data: requests, fetchData } = useLazyLoading(
        "api/getRequestForUpdateProfileDepartment",
        {
            sort: [{ created_at: "desc" }],
        }
    );
    const formattedRequests = requests
        .filter(
            (item) => item.status !== "approved" && item.status !== "rejected"
        )
        .map((request) => ({
            id: request.id,
            name: request.user?.name || "Unknown User",
            department: request.userDepartment || "No Department",

            time: request.created_at ? new Date(request.created_at) : null,
            profileImage: getProfileImage(
                request.userProfile,
                request.user?.name || "Unknown User"
            ),
            status: request.status,
            changeType: "Department Information",
            oldLocation:
                request.user?.employment_post?.location || "No location",
            newLocation: request.details?.location || "No location",
            oldUnit: request.business_unit?.name || "No Unit",
            newUnit: request.details?.business_unit_name || "No Unit",
            oldOfficeNumber:
                request.user?.employment_post?.work_phone || "No Phone",
            newOfficeNumber: request.details?.work_phone || "No Phone",
        }));

    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px]">
            <h2 className="mb-4 text-2xl font-bold text-primary">
                Profile Information
            </h2>
            {formattedRequests.length > 0 ? (
                formattedRequests.map((data, index) => (
                    <ProfileInformationRow
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

export default ProfileInformationRequest;
