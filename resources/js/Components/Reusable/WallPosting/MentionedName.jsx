import React, { useState } from "react";

import "./index.css";

const MentionedName = ({ name, userId }) => {
    const [profileData, setProfileData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const fetchProfileData = async () => {
        if (!profileData) {
            try {
                const response = await fetch(
                    `/api/users/users/${userId}?with[]=profile&with[]=employmentPosts.department&with[]=employmentPosts.businessPost`
                );
                const data = await response.json();
                setProfileData(data.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        }
    };

    let source = null;

    if (profileData && profileData.profile) {
        if (
            !profileData.profile.image ||
            profileData.profile.image.trim() === ""
        ) {
            // If profileData.profile.image is empty or only contains whitespace, use the UI Avatars URL
            source = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${profileData.name}`;
        } else if (profileData.profile.image.startsWith("avatar/")) {
            // If profileData.profile.image already starts with 'avatar/', map it directly
            source = `/storage/${profileData.profile.image}`;
        } else {
            // If profileData.profile.image doesn't start with 'avatar/', check if it's a placeholder or not
            source =
                profileData.profile.image ===
                "/assets/dummyStaffPlaceHolder.jpg"
                    ? profileData.profile.image
                    : `/avatar/${profileData.profile.image}`;
        }
    }

    return (
        <span
            className="tagged-text"
            onMouseEnter={() => {
                setShowPopup(true);
                fetchProfileData();
            }}
            onMouseLeave={() => setShowPopup(false)}
        >
            <a href={`/user/${userId}`} className="profile-link">
                @{name}
            </a>

            {showPopup && profileData && (
                <div className="profile-popup">
                    <div className="flex items-center">
                        {/* <img
                            src={source || '/assets/dummyStaffPlaceHolder.jpg'} // Fallback to a placeholder if source is null
                            alt={profileData.name}
                        /> */}
                        <img
                            src={source || "/assets/dummyStaffPlaceHolder.jpg"} // Fallback to a placeholder if source is null
                            alt={profileData.name}
                            style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                            }} // Adjust the size as needed
                        />
                        <div className="profile-details">
                            <h4>{profileData.name}</h4>
                            {profileData.employment_posts &&
                                profileData.employment_posts.length > 0 && (
                                    <>
                                        <p>
                                            Department:{" "}
                                            <span style={{ fontWeight: 400 }}>
                                                {
                                                    profileData
                                                        .employment_posts[0]
                                                        .department.name
                                                }
                                            </span>
                                        </p>
                                        <p>
                                            Title:{" "}
                                            <span style={{ fontWeight: 400 }}>
                                                {
                                                    profileData
                                                        .employment_posts[0]
                                                        .business_post.title
                                                }
                                            </span>
                                        </p>
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </span>
    );
};

export default MentionedName;
