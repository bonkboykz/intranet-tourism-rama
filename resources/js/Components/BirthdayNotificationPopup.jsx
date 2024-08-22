import React, { useState, useEffect } from 'react';
import Popup from './Reusable/Popup';
import BirthdayCom from './Reusable/Birthdayfunction/birthdaypopup';

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
                const response = await fetch(`/api/profile/profiles?filter[]=dob&paginate=false`);

                const data = await response.json();

                if (data && data.data && Array.isArray(data.data.data)) {
                    allProfiles = [...allProfiles, ...data.data.data];
                    totalPages = data.data.last_page;
                    currentPage++;
                } else {
                    console.error('Error: Expected an array, but got:', data);
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
                        profileId: profile.id,
                        profileImage: getAvatarSource(profile.image, profile.bio),
                    });
                }

                return acc;
            }, []);

            // Sort the birthday events by name alphabetically
            birthdayEvents.sort((a, b) => a.name.localeCompare(b.name));

            console.log('birthdayEvents', birthdayEvents);
            

            setBirthdays(birthdayEvents);
        } catch (error) {
            console.error('Error fetching birthdays: ', error);
        }
    };

    const getAvatarSource = (src, name) => {
        let source = null;

        if (!src || src.trim() === '') {
            // If src is empty or only contains whitespace, use the UI Avatars URL
            source = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${name}`;
        } else if (src.startsWith('avatar/')) {
            // If src already starts with 'avatar/', map it directly
            source = `/storage/${src}`;
        } else {
            // If src doesn't start with 'avatar/', check if it's a placeholder or not
            source = src === '/assets/dummyStaffPlaceHolder.jpg' 
              ? src 
              : `/avatar/${src}`;
        }

        return source;
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
                    Today's Birthdays
                </p>
                {renderBirthdays()}
                {birthdays.length === 0 && (
                    <p className="text-sm text-gray-600 mt-1">No birthday today.</p>
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
                
                <Popup isOpen={isBirthdayComOpen} onClose={closeBirthdayComPopup}>
                    <BirthdayCom loggedInUser={userData} profileImage={selectedBirthday.profileImage} name={selectedBirthday.name} />
                </Popup>
            )}
        </>
    );
}

export default BirthdayNotificationPopup;
