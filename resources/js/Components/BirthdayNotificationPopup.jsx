import React, { useEffect, useState } from "react";
import axios from "axios";

import { getAvatarSource } from "@/Utils/getProfileImage";
import { isBirthdayDay } from "@/Utils/isBirthday";

import BirthdayCom from "./Reusable/Birthdayfunction/birthdaypopup";
import Popup from "./Reusable/Popup";

function BirthdayNotificationPopup({ onClose, userData }) {
    const [birthdays, setBirthdays] = useState([]);
    const [isBirthdayComOpen, setIsBirthdayComOpen] = useState(false);
    const [selectedBirthday, setSelectedBirthday] = useState(null);

    const fetchBirthdayEvents = async () => {
        try {
            const response = await axios.get("/api/profile/get_all_birthdays");

            const allProfiles = response.data.data;

            const birthdayEvents = allProfiles
                .filter((profile) => {
                    const dob = new Date(profile.dob);
                    if (isNaN(dob.getTime())) return false; // Skip invalid dob

                    return isBirthdayDay(dob, new Date());
                })
                .map((profile) => ({
                    date: new Date(profile.dob),
                    name: profile.bio,
                    profileId: profile.user_id,
                    profileImage: getAvatarSource(profile.image, profile.bio),
                }));

            // Sort the birthday events by name alphabetically
            birthdayEvents.sort((a, b) => a.name.localeCompare(b.name));

            setBirthdays(birthdayEvents);
        } catch (error) {
            console.error("Error fetching birthdays: ", error);
        }
    };

    useEffect(() => {
        fetchBirthdayEvents();
    }, []);

    const handleBirthdayClick = (birthday) => {
        setSelectedBirthday(birthday);
        setIsBirthdayComOpen(true); // Open the BirthdayCom popup
    };

    const closeBirthdayComPopup = () => {
        setIsBirthdayComOpen(false); // Close the BirthdayCom popup
    };

    const renderBirthdays = () => {
        return birthdays.map((birthday, index) => (
            <div
                key={index}
                className="cursor-pointer text-sm text-gray-600 mt-1 p-2 hover:bg-blue-100 rounded flex items-center"
                onClick={() => handleBirthdayClick(birthday)}
            >
                <img
                    src={birthday.profileImage}
                    alt={`${birthday.name}'s avatar`}
                    className="w-8 h-8 rounded-full mr-2"
                />
                <p className="font-semibold">{birthday.name}</p>
            </div>
        ));
    };

    return (
        <>
            <div className="absolute right-0 z-10 mt-2.5 w-60 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-gray-900">
                    Today&apos;s Birthdays
                </p>
                {/* Scrollable Birthday List */}
                <div className="birthday-list max-h-[200px] overflow-y-auto mt-2">
                    {renderBirthdays()}
                    {birthdays.length === 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            No birthday today.
                        </p>
                    )}
                </div>
                <div className="w-full flex justify-end">
                    <button
                        onClick={onClose}
                        className="mt-2 text-sm text-blue-600 hover:underline block"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Independent BirthdayCom Popup */}
            {selectedBirthday && (
                <Popup
                    isOpen={isBirthdayComOpen}
                    onClose={closeBirthdayComPopup}
                >
                    <BirthdayCom
                        loggedInUser={userData}
                        profileImage={selectedBirthday.profileImage}
                        name={selectedBirthday.name}
                        selectedID={selectedBirthday.profileId}
                    />
                </Popup>
            )}
        </>
    );
}

export default BirthdayNotificationPopup;
