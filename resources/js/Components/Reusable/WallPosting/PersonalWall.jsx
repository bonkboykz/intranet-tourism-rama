import { BirthdayPostCard } from "./BirthdayPostCard";
import {DefaultPostCard} from "@/Components/Reusable/WallPosting/DefaultPostCard/DefaultPostCard.jsx";
import InfiniteScroll from "react-infinite-scroller";
import {Loader2} from "lucide-react";

export function PersonalWall({ posts, onLoad, hasMore }) {
    return (
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
    );
}
