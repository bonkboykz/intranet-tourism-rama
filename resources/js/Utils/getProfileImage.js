export const getProfileImage = (profile, name = "User") => {
    if (!profile || !profile.image || !profile.staff_image) {
        return `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
            name
        )}&rounded=true`;
    }

    if (!profile.image && profile.staff_image) {
        if (profile.staff_image.startsWith("avatar/")) {
            return `/storage/${profile.staff_image}`;
        }

        return `/avatar/${profile.staff_image}`;
    }

    if (profile.image === "/assets/dummyStaffPlaceHolder.jpg") {
        return profile.image;
    }

    if (profile.image.startsWith("avatar/")) {
        return `/storage/${profile.image}`;
    }

    return `/avatar/${profile.image}`;
};
