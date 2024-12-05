import { getProfileImage } from "@/Utils/getProfileImage";

const getDepartmentOrCommunityBannerUrl = (group) => {
    if (!group.banner) {
        return `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
            group.name
        )}&rounded=true`;
    }

    if (group.banner.includes("assets/defaultDepartmentBanner.jpg")) {
        return group.banner;
    }

    if (group.banner.startsWith("avatar/")) {
        return `/storage/${group.banner}`;
    }

    if (group.banner.startsWith("banner/")) {
        return `/storage/${group.banner}`;
    }

    return group.banner;
};

export function UserProfileAvatar({ post }) {
    if (post.community && post.post_as === "admin") {
        return (
            <img
                loading="lazy"
                src={getDepartmentOrCommunityBannerUrl(post.community)}
                alt={post.community.name}
                className="shrink-0 aspect-square w-[53px] rounded-image"
            />
        );
    }

    if (post.department && post.post_as === "admin") {
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
            src={getProfileImage(post.user?.profile)}
            alt={post.user.name}
            className="shrink-0 aspect-square w-[53px] rounded-image"
        />
    );
}
