import { CommunityContext } from "@/Pages/CommunityContext";
import { useContext } from "react";

export function CommunityTitle({ post }) {
    const { isAdmin } = useContext(CommunityContext);

    if (post.post_as === "member") {
        return (
            <div className="text-base font-semibold text-neutral-800">
                {post.user.name}
            </div>
        );
    }

    const title = post.community.name + (isAdmin ? ` (${post.user.name})` : "");

    return (
        <div className="text-base font-semibold text-neutral-800">{title}</div>
    );
}

export function DepartmentTitle({ post }) {
    const isAdmin = true;
    // TODO: check roles, if not admin or superadmin, show community name without poster name
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
