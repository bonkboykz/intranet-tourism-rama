import { React, useState } from "react";
import aishaImage from "../../../../public/assets/aishaImage.png";
import benImage from "../../../../public/assets/benImage.png";
import thomasImage from "../../../../public/assets/thomasImage.png";
import community1 from "../../../../public/assets/community1.png";
import community2 from "../../../../public/assets/community2.png";
import community3 from "../../../../public/assets/community3.png";
import changeImage1 from "../../../../public/assets/lambo5.jpeg";
import changeImage2 from "../../../../public/assets/lambo2.jpeg";
import { useEffect } from "react";
import axios from "axios";
import { GroupJoinRequests } from "./Requests/GroupJoinRequests";
import { formatTime } from "@/Utils/format";
import { CommunityCreationRequests } from "./Requests/CommunityCreationRequests";

const orgChartPhotoChangeData = [
    {
        name: "Thomas",
        department: "Department",
        time: "2024-06-20T02:00:00Z",
        currentImage: thomasImage,
        changeImage: changeImage1,
    },
    {
        name: "Aisha Binti",
        department: "Department",
        time: "2024-06-19T04:00:00Z",
        currentImage: aishaImage,
        changeImage: changeImage2,
    },
];

const profileInformationData = [
    {
        name: "Thomas",
        department: "Department",
        time: "2024-06-19T04:00:00Z",
        profileImage: thomasImage,
        changeType: "Email",
        currentValue: "thomas@tourism.com.my",
        newValue: "thomas.thomas@tourism.com.my",
    },
    {
        name: "Aisha Binti",
        department: "Department",
        time: "2024-06-10T12:00:00Z",
        profileImage: aishaImage,
        changeType: "Location",
        currentValue: "Tingkat 18",
        newValue: "Tingkat 22",
    },
];

const OrgChartPhotoChangeRow = ({
    name,
    department,
    time,
    currentImage,
    changeImage,
}) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

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
                <div className="flex justify-end w-1/4">
                    <button className="px-4 py-1 text-sm font-bold text-white bg-blue-500 rounded-full">
                        Approve
                    </button>
                    <button className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full">
                        Reject
                    </button>
                </div>
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

const ProfileInformationRow = ({
    name,
    department,
    time,
    profileImage,
    changeType,
    currentValue,
    newValue,
}) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

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
                    change of
                </p>
                <div className="flex items-center w-1/4">
                    <p
                        className="font-medium text-blue-500 cursor-pointer"
                        onClick={() => setIsPopupVisible(true)}
                    >
                        {changeType}
                    </p>
                </div>
                <div className="flex justify-end w-1/4">
                    <button className="px-4 py-1 text-sm font-bold text-white bg-blue-500 rounded-full">
                        Approve
                    </button>
                    <button className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full">
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
                                {name} wants to change
                            </h2>
                            <hr
                                className="border-t border-gray-300"
                                style={{
                                    borderColor: "#E4E4E4",
                                    width: "100%",
                                }}
                            />
                            <p className="mt-4 mb-2 text-xl font-bold text-left">
                                {changeType}: {currentValue}
                            </p>
                            <p className="mb-4 text-xl font-bold text-left">
                                To:{" "}
                                <a className="text-xl font-bold text-blue-500">
                                    {newValue}
                                </a>
                            </p>
                            <button
                                className="px-4 py-2 text-white bg-blue-500 rounded-full"
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

// Main Component
const Requests = () => {
    return (
        <div>
            <GroupJoinRequests />
            <CommunityCreationRequests />
            <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-5">
                <h2 className="mb-4 text-2xl font-bold text-blue-500">
                    Organisational Chart Photo Change
                </h2>
                {orgChartPhotoChangeData.map((data, index) => (
                    <OrgChartPhotoChangeRow key={index} {...data} />
                ))}
            </section>
            <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px]">
                <h2 className="mb-4 text-2xl font-bold text-blue-500">
                    Profile Information
                </h2>
                {profileInformationData.map((data, index) => (
                    <ProfileInformationRow key={index} {...data} />
                ))}
            </section>
        </div>
    );
};

export default Requests;
