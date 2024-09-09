import { DefaultPostCard } from "./DefaultPostCard/DefaultPostCard";
import { AnnouncementPostCard } from "./AnnouncementPostCard/AnnouncementPostCard";

export function PersonalWall({ filteredFinalPosts }) {
    return filteredFinalPosts.map((post, index) => {
        return (
            <div className="w-full" key={post.id}>
                {/* Conditional Rendering for Announcement */}
                {post.type === "announcement" && (
                    <AnnouncementPostCard announce={post.announce} />
                )}

                {/* Main Post Content */}
                {post.type !== "birthday" && <DefaultPostCard post={post} />}
            </div>
        );
    });
}
