import React from "react";
import { usePage } from "@inertiajs/react";

import { getAvatarSource } from "@/Utils/getProfileImage";

const ProfileQRPage = () => {
    const {
        props: { user, qr },
    } = usePage();

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Left side: QR Code */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-center mb-4 md:mb-0">
                <div
                    className="relative"
                    id="qr-code"
                    style={{
                        position: "relative",
                        width: "256px",
                        height: "256px",
                    }}
                >
                    <img
                        src={qr}
                        alt="QR Code"
                        style={{
                            width: 256,
                            height: 256,
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    />

                    <img
                        src="/assets/logo_tourism.png"
                        alt="Tourism Logo"
                        style={{
                            position: "absolute",
                            width: "80px",
                            height: "32px",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 1,
                        }}
                    />
                </div>
            </div>

            {/* Right side: User Information */}
            <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                    <img
                        src={getAvatarSource(
                            user.profile.image,
                            user.profile.bio
                        )}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border border-gray-300"
                    />
                    <div className="ml-4">
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-gray-500">{user.position}</p>
                    </div>
                </div>
                <div>
                    <p className="text-gray-600">
                        <span className="font-semibold">Email: </span>
                        {user.email}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold">Department: </span>
                        {user.employment_post?.department.name ??
                            "No department"}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold">WhatsApp: </span>
                        {user.profile.phone_no !== null
                            ? user.profile.phone_no !== "null"
                                ? user.profile.phone_no
                                : "No phone number"
                            : "No phone number"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileQRPage;
