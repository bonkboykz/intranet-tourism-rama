import { useRef } from "react";
import { useMemo } from "react";
import { useState, useEffect } from "react";

const postsPerScroll = 5;

export function useInfiniteScroll(
    options = {
        userId,
        communityId,
        departmentId,
        filter: {
            filterId,
            filterType,
            postType,
        },
    }
) {
    const [loading, setLoading] = useState(false);
    const [rawPosts, setRawPosts] = useState([]);
    const currentPage = useRef(1);
    const totalPages = useRef(-1);
    const [hasMore, setHasMore] = useState(true);

    const activeLoading = useRef(false);

    async function fetchData() {
        if (
            loading ||
            activeLoading.current ||
            (totalPages.current !== -1 && !hasMore)
        ) {
            return;
        }

        activeLoading.current = true;

        setLoading(true);
        try {
            const filter = [];

            if (options.filter) {
                if (options.filter.postType) {
                    if (options.filter.postType === "image") {
                        // add filter that matches part of the attachment mime_type
                        filter.push({
                            field: "attachments.mime_type",
                            type: "like",
                            value: "image/%",
                        });
                    }

                    if (options.filter.postType === "video") {
                        // add filter that matches part of the attachment mime_type
                        filter.push({
                            field: "attachments.mime_type",
                            type: "like",
                            value: "video/%",
                        });
                    }

                    if (options.filter.postType === "mention") {
                        filter.push({
                            field: "mentions",
                            value: userId,
                        });
                    }

                    if (options.filter.postType === "file") {
                        filter.push({
                            field: "attachments.extension",
                            type: "like",
                            value: ["pdf", "doc", "docx", "xls", "xlsx"],
                        });
                    }

                    // TODO: add announcement filter
                    if (options.filter.postType === "announcement") {
                        filter.push({
                            field: "announced",
                            type: "like",
                            value: "true",
                        });
                    }

                    // TODO: add polls filter
                    if (options.filter.postType === "poll") {
                        filter.push({
                            field: "type",
                            type: "like",
                            value: "poll",
                        });
                    }
                }
            }

            if (options.userId) {
                filter.push({
                    field: "user_id",
                    type: "like",
                    value: options.userId,
                });
            }

            if (options.communityId) {
                filter.push({
                    field: "community_id",
                    type: "like",
                    value: options.communityId,
                });
            }

            if (options.departmentId) {
                filter.push({
                    field: "department_id",
                    type: "like",
                    value: options.departmentId,
                });
            }

            const postsResponse = await axios.get(`/api/posts/posts`, {
                params: {
                    with: [
                        "user",
                        "attachments",
                        "accessibilities",
                        "comments",
                    ],
                    // TODO: return post type announcement first, then sort by updated_at
                    // sort: [{ updated_at: "desc" }],
                    page: currentPage.current,
                    paginate: true,
                    perpage: postsPerScroll,
                    limit: postsPerScroll,
                    offset: (currentPage.current - 1) * postsPerScroll,
                    user_id: options.userId,
                    filter: [
                        {
                            field: "type",
                            type: "like",
                            value: ["post", "birthday"],
                        },
                        ...filter,
                    ].filter(Boolean),
                },
            });

            if ([401, 403, 500].includes(postsResponse.status)) {
                throw new Error("Network response was not ok");
            }
            const postsData = postsResponse.data;

            const newPosts = postsData.data.data;
            setRawPosts((prev) => [...prev, ...newPosts]);

            currentPage.current += 1;
            totalPages.current = postsData.data.last_page;

            setHasMore(postsData.data.current_page < postsData.data.last_page);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            activeLoading.current = false;
            setLoading(false);
        }
    }

    useEffect(() => {
        setRawPosts([]);
        currentPage.current = 1;
        totalPages.current = -1;

        fetchData();
    }, [options.filter?.postType]);

    return {
        posts: rawPosts,
        loading,
        fetchData,
        hasMore,
    };
}
