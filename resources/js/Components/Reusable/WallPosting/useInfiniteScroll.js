import { useMemo } from "react";
import { useState, useEffect } from "react";

const postsPerScroll = 5;

export function useInfiniteScroll(
    options = {
        userId,
    }
) {
    const [loading, setLoading] = useState(false);
    const [rawPosts, setRawPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(-1);
    const hasMore = currentPage <= totalPages;

    async function fetchData() {
        if (totalPages !== -1 && !hasMore) {
            return;
        }

        setLoading(true);
        try {
            const postsResponse = await axios.get(`/api/posts/posts`, {
                params: {
                    with: [
                        "user",
                        "attachments",
                        "accessibilities",
                        "comments",
                    ],
                    // TODO: return post type announcement first, then sort by updated_at
                    sort: [{ updated_at: "desc" }],
                    page: currentPage,
                    paginate: true,
                    perpage: postsPerScroll,
                    limit: postsPerScroll,
                    offset: (currentPage - 1) * postsPerScroll,
                    user_id: options.userId,
                },
            });

            if ([401, 403, 500].includes(postsResponse.status)) {
                throw new Error("Network response was not ok");
            }
            const postsData = postsResponse.data;

            const deduplicatePosts = postsData.data.data.filter(
                (post) => !rawPosts.some((p) => p.id === post.id)
            );
            setRawPosts([...rawPosts, ...deduplicatePosts]);

            setTotalPages(postsData.data.last_page);
            setCurrentPage(currentPage + 1);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const announcements = useMemo(() => {
        return rawPosts
            .filter((post) => post.type === "announcement")
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }, [rawPosts]);

    const otherPosts = useMemo(() => {
        return rawPosts
            .filter((post) => post.type !== "announcement")
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [rawPosts]);

    const posts = useMemo(() => {
        return [...announcements, ...otherPosts].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
    }, [announcements, otherPosts]);

    return {
        posts,
        loading,
        fetchData,
        hasMore,
    };
}
