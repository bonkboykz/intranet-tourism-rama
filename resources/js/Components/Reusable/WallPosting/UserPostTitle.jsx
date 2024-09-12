import { useContext } from "react";

import { DepartmentContext } from "@/Pages/DepartmentContext";
import { usePermissions } from "@/Utils/hooks/usePermissions";

export function CommunityTitle({ post }) {
    // const { isAdmin } = useContext(CommunityContext);

    const { hasRole } = usePermissions();

    const isCommunityAdmin = hasRole(`community admin ${post.community.id}`);

    if (post.post_as === "member") {
        return (
            <div className="text-base font-semibold text-neutral-800">
                {post.user.name}
            </div>
        );
    }

    const title =
        post.community.name + (isCommunityAdmin ? ` (${post.user.name})` : "");

    return (
        <div className="text-base font-semibold text-neutral-800">{title}</div>
    );
}

export function DepartmentTitle({ post }) {
    const { isAdmin } = useContext(DepartmentContext);

    if (post.post_as === "member") {
        return (
            <div className="text-base font-semibold text-neutral-800">
                {post.user.name}
            </div>
        );
    }

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
