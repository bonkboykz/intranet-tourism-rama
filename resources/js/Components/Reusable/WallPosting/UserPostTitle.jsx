export function CommunityTitle({ post }) {
    // TODO: check roles, if not admin or superadmin, show community name without poster name
    const isAdmin = true;
    const title = post.community.name + (isAdmin ? ` (${post.user.name})` : "");

    return (
        <div className="text-base font-semibold text-neutral-800">{title}</div>
    );
}

export function DepartmentTitle({ post }) {
    // TODO: check roles, if not admin or superadmin, show community name without poster name
    const isAdmin = true;
    const title =
        post.department.name + (isAdmin ? ` (${post.user.name})` : "");

    return (
        <div className="text-base font-semibold text-neutral-800">{title}</div>
    );
}

export function UserPostTitle({ post }) {
    if (post.community) {
        return <CommunityTitle post={post} />;
    }

    if (post.department) {
        return <DepartmentTitle post={post} />;
    }

    return (
        <div className="text-base font-semibold text-neutral-800">
            {post.user.name}
        </div>
    );
}
