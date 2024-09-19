import { formatTimeAgo } from "@/Utils/format";

import { UserPostTitle } from "../../UserPostTitle";
import { UserProfileAvatar } from "../../UserProfileAvatar";

export function CardImage({ post }) {
    return (
        <div className="flex gap-1.5 -mt-1">
            <UserProfileAvatar post={post} />
            <div className="flex flex-col my-auto ml-1">
                <UserPostTitle post={post} />
                <time className="mt-1 text-xs text-neutral-800 text-opacity-50">
                    {formatTimeAgo(post.created_at)}
                </time>
            </div>
        </div>
    );
}
