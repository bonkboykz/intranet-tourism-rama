export const getStaffImage = (profile, name = "User") => {
    if (!profile || !profile.staff_image) {
        return `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
            name
        )}&rounded=true`;
    }

    return profile.staff_image.startsWith("avatar/") ||
        profile.staff_image.startsWith("staff_image/")
        ? `/storage/${profile.staff_image}`
        : `/avatar/${profile.staff_image}`;
};

export const getProfileImage = (
    profile,
    name = "User",
    isStaffFirst = false
) => {
    if (!profile) {
        return `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
            name
        )}&rounded=true`;
    }

    if (!profile.image && profile.staff_image) {
        if (
            profile.staff_image.startsWith("avatar/") ||
            profile.staff_image.startsWith("staff_image/")
        ) {
            return `/storage/${profile.staff_image}`;
        }

        return `/avatar/${profile.staff_image}`;
    }

    if (profile.staff_image && isStaffFirst) {
        if (
            profile.staff_image.startsWith("avatar/") ||
            profile.staff_image.startsWith("staff_image/")
        ) {
            return `/storage/${profile.staff_image}`;
        }

        return `/avatar/${profile.staff_image}`;
    }

    if (!profile.image) {
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

export const getAvatarSource = (src, name) => {
    let source = null;

    if (!src || src.trim() === "") {
        // If src is empty or only contains whitespace, use the UI Avatars URL
        source = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${name}`;
    } else if (src.startsWith("avatar/")) {
        // If src already starts with 'avatar/', map it directly
        source = `/storage/${src}`;
    } else {
        // If src doesn't start with 'avatar/', check if it's a placeholder or not
        source =
            src === "/assets/dummyStaffPlaceHolder.jpg"
                ? src
                : `/avatar/${src}`;
    }

    return source;
};

export const getNotificationAvatar = (imageSrc) => {
    if (imageSrc.startsWith("avatar/")) {
        return `/storage/${imageSrc}`;
    }

    if (imageSrc === "/assets/dummyStaffPlaceHolder.jpg") {
        return imageSrc;
    }

    if (imageSrc.startsWith("staff_image/")) {
        return `/storage/${imageSrc}`;
    }

    if (imageSrc.startsWith("https://")) {
        return imageSrc;
    }

    if (imageSrc.startsWith("data:image/")) {
        return imageSrc;
    }

    return `/avatar/${imageSrc}`;
};
