export const getProfileImage = (profile, name = "User") => {
    if (!profile || !profile.image) {
        return `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
            name
        )}&rounded=true`;
    }

    if (profile.image === "/assets/dummyStaffPlaceHolder.jpg") {
        return profile.image;
    }

    if (profile.image.startsWith("avatar/")) {
        return `/storage/${profile.image}`;
    }

    return `/avatar/${profile.image}`;
};
