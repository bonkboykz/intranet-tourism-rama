export function UserProfileAvatar({ post }) {
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
