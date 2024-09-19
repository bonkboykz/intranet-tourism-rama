import React, { useEffect, useState } from "react";

import { getAvatarSource } from "@/Utils/getProfileImage";

import BirthdayCom from "./Reusable/Birthdayfunction/birthdaypopup";
import Popup from "./Reusable/Popup";

function BirthdayNotificationPopup({ onClose, userData }) {
    // console.log("GGG", userData);

    const [birthdays, setBirthdays] = useState([]);
    const [isBirthdayComOpen, setIsBirthdayComOpen] = useState(false);
    const [selectedBirthday, setSelectedBirthday] = useState(null);

    const fetchBirthdayEvents = async () => {
        try {
            let allProfiles = [];
            let currentPage = 1;
            let totalPages = 1;

            while (currentPage <= totalPages) {
                // const response = await fetch(`/api/profile/profiles?page=${currentPage}`);
                const response = await fetch(
                    `/api/profile/profiles?filter[]=dob&paginate=false`
                );

                const data = await response.json();

                if (data && data.data && Array.isArray(data.data.data)) {
                    allProfiles = [...allProfiles, ...data.data.data];
                    totalPages = data.data.last_page;
                    currentPage++;
                } else {
                    console.error("Error: Expected an array, but got:", data);
                    break;
                }
            }

            const today = new Date();
            const currentMonth = today.getMonth();
            const currentDay = today.getDate();

            let birthdayEvents = allProfiles.reduce((acc, profile) => {
                if (!profile.dob) return acc;

                const dob = new Date(profile.dob);
                if (isNaN(dob.getTime())) return acc;

                const dobMonth = dob.getMonth();
                const dobDay = dob.getDate();

                // Only include birthdays that are today
                if (dobMonth === currentMonth && dobDay === currentDay) {
                    acc.push({
                        name: profile.bio,
                        profileId: profile.user_id,
                        profileImage: getAvatarSource(
                            profile.image,
                            profile.bio
                        ),
                    });
                }

                return acc;
            }, []);

            // Sort the birthday events by name alphabetically
            birthdayEvents.sort((a, b) => a.name.localeCompare(b.name));

            console.log("birthdayEvents", birthdayEvents);

            setBirthdays(birthdayEvents);
        } catch (error) {
            console.error("Error fetching birthdays: ", error);
        }
    };

    useEffect(() => {
        fetchBirthdayEvents();
    }, []);

    const handleBirthdayClick = (birthday) => {
        // console.log("BDAY", birthday);

        setSelectedBirthday(birthday);
        setIsBirthdayComOpen(true); // Open the BirthdayCom popup
    };

    const closeBirthdayComPopup = () => {
        setIsBirthdayComOpen(false); // Close the BirthdayCom popup
    };

    const renderBirthdays = () => {
        return birthdays.map(
            (birthday, index) => (
                console.log("BIRTHDAYS", birthday),
                (
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
                )
            )
        );
    };

    return (
        <>
            <div className="absolute right-0 z-10 mt-2.5 w-60 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-gray-900">
                    Today&apos;s Birthdays
                </p>
                {renderBirthdays()}
                {birthdays.length === 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                        No birthday today.
                    </p>
                )}
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
                // console.log("SBDAY", selectedBirthday.id),

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
