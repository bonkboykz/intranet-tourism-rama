const getDepartmentOrCommunityBannerUrl = (group) => {
    if (!group.banner) {
        return `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
            group.name
        )}&rounded=true`;
    }

    if (group.banner.includes("assets/departmentsDefault.jpg")) {
        return group.banner;
    }

    if (group.banner.startsWith("avatar/")) {
        return `/storage/${group.banner}`;
    }

    return group.banner;
};

export function UserProfileAvatar({ post }) {
    if (post.community) {
        return (
            <img
                loading="lazy"
                src={getDepartmentOrCommunityBannerUrl(post.community)}
                alt={post.community.name}
                className="shrink-0 aspect-square w-[53px] rounded-image"
            />
        );
    }

    if (post.department) {
        return (
            <img
                loading="lazy"
                src={getDepartmentOrCommunityBannerUrl(post.department)}
                alt={post.department.name}
                className="shrink-0 aspect-square w-[53px] rounded-image"
            />
        );
    }

    return (
        <img
            loading="lazy"
            src={
                post.user.profile?.image
                    ? post.user.profile.image ===
                      "/assets/dummyStaffPlaceHolder.jpg"
                        ? post.user.profile.image
                        : post.user.profile.image.startsWith("avatar/")
                          ? `/storage/${post.user.profile.image}`
                          : `/avatar/${post.user.profile.image}`
                    : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
                          post.user.name
                      )}&rounded=true`
            }
            alt={post.user.name}
            className="shrink-0 aspect-square w-[53px] rounded-image"
        />
    );
}
