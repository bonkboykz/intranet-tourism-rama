import { DefaultPostCard } from "./DefaultPostCard/DefaultPostCard";
import { AnnouncementPostCard } from "./AnnouncementPostCard/AnnouncementPostCard";
import InfiniteScroll from "react-infinite-scroller";
import { Loader2 } from "lucide-react";

export function PersonalWall({ posts, onLoad, hasMore }) {
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
                {posts.map((post, index) => {
                    return (
                        <div className="w-full" key={post.id}>
                            {/* Conditional Rendering for Announcement */}
                            {post.type === "announcement" && (
                                <AnnouncementPostCard
                                    announce={post.announce}
                                />
                            )}

                            {/* Main Post Content */}
                            {post.type !== "birthday" && (
                                <DefaultPostCard post={post} />
                            )}
                        </div>
                    );
                })}
            </InfiniteScroll>
        </>
    );
}
