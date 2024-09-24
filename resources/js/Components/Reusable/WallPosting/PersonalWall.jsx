import InfiniteScroll from "react-infinite-scroller";
import { Loader2 } from "lucide-react";

import { DefaultPostCard } from "@/Components/Reusable/WallPosting/DefaultPostCard/DefaultPostCard.jsx";

import { PollPostCard } from "./PollPostCard/PollPostCard";

export function PersonalWall({ posts, onLoad, hasMore }) {
    return (
        <InfiniteScroll
            pageStart={1}
            loadMore={onLoad}
            hasMore={hasMore}
            loader={
                <div
                    className="loader min-h-32 flex items-center justify-center"
                    key={0}
                >
                    <Loader2 className="w-12 h-12 animate-spin" />
                </div>
            }
        >
            {posts.map((post, index) => {
                if (post.type === "poll") {
                    return <PollPostCard key={post.id} post={post} />;
                }

                return <DefaultPostCard key={post.id} post={post} />;
            })}
        </InfiniteScroll>
    );
}
