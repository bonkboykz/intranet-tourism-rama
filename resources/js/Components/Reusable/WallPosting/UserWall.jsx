import InfiniteScroll from "react-infinite-scroller";
import { Loader2 } from "lucide-react";

import { DefaultPostCard } from "@/Components/Reusable/WallPosting/DefaultPostCard/DefaultPostCard.jsx";

import { PollPostCard } from "./PollPostCard/PollPostCard";

export function UserWall({ onLoad, hasMore, posts, userId }) {
    const filderedPosts = posts.filter((post) => {
        const isAuthor = post.user.id === userId;
        const isMentioned =
            post.mentions &&
            JSON.parse(post.mentions).some((mention) => mention.id == userId);

        return isAuthor || isMentioned;
    });

    return (
        <>
            <InfiniteScroll
                pageStart={1}
                loadMore={onLoad}
                hasMore={hasMore}
                loader={
                    <div
                        className="loader h-full w-full min-h-32 flex items-center justify-center"
                        key={0}
                    >
                        <Loader2 className="w-12 h-12 animate-spin" />
                    </div>
                }
            >
                {filderedPosts.map((post, index) => {
                    if (post.type === "poll") {
                        return <PollPostCard key={post.id} post={post} />;
                    }
                    return <DefaultPostCard key={post.id} post={post} />;
                })}
            </InfiniteScroll>
        </>
    );
}
