export function UserProfileAvatar({ post }) {
    if (post.community) {
        return (
            <img
                loading="lazy"
                src={
                    post.community.banner
                        ? post.community.banner ===
                          "/assets/dummyStaffPlaceHolder.jpg"
                            ? post.community.image
                            : post.community.image.startsWith("avatar/")
                            ? `/storage/${post.community.banner}`
                            : `/avatar/${post.community.banner}`
                        : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
                              post.community.name
                          )}&rounded=true`
                }
                alt={post.community.name}
                className="shrink-0 aspect-square w-[53px] rounded-image"
            />
        );
    }

    if (post.department) {
        return (
            <img
                loading="lazy"
                src={
                    post.department.banner
                        ? post.department.banner ===
                          "/assets/dummyStaffPlaceHolder.jpg"
                            ? post.department.image
                            : post.department.image.startsWith("avatar/")
                            ? `/storage/${post.department.banner}`
                            : `/avatar/${post.department.banner}`
                        : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
                              post.department.name
                          )}&rounded=true`
                }
                alt={post.department.name}
                className="shrink-0 aspect-square w-[53px] rounded-image"
            />
        );
    }

    return (
        <img
            loading="lazy"
            src={
                post.userProfile.profile?.image
                    ? post.userProfile.profile.image ===
                      "/assets/dummyStaffPlaceHolder.jpg"
                        ? post.userProfile.profile.image
                        : post.userProfile.profile.image.startsWith("avatar/")
                        ? `/storage/${post.userProfile.profile.image}`
                        : `/avatar/${post.userProfile.profile.image}`
                    : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
                          post.user.name
                      )}&rounded=true`
            }
            alt={post.user.name}
            className="shrink-0 aspect-square w-[53px] rounded-image"
        />
    );
}
