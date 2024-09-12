import { BirthdayPostCard } from "./BirthdayPostCard";
import {DefaultPostCard} from "@/Components/Reusable/WallPosting/DefaultPostCard/DefaultPostCard.jsx";
import {Loader2} from "lucide-react";
import InfiniteScroll from "react-infinite-scroller";

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
                    if (post.type === "birthday") {
                        return (
                            <BirthdayPostCard
                                key={post.id}
                                post={post}
                                index={index}
                                // сюда нужно чуть позже передать остальные props
                            />
                        );
                    }

                    return <DefaultPostCard key={post.id} post={post} />;
                })}
            </InfiniteScroll>
        </>
    );
}
