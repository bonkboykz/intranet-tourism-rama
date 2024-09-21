import { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import { usePermissions } from "@/Utils/hooks/usePermissions";

const postsPerScroll = 5;

export function useInfiniteScroll({
    variant,
    userId,
    communityId,
    departmentId,
    filter,
    loggedInUserId,
}) {
    const [loading, setLoading] = useState(false);
    const [rawPosts, setRawPosts] = useState([]);
    const currentPage = useRef(1);
    const totalPages = useRef(-1);
    const [hasMore, setHasMore] = useState(true);

    const activeLoading = useRef(false);

    const { hasRole } = usePermissions();
    const isSuperAdmin = hasRole("superadmin");

    const constructFilter = () => {};

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
            const newFilter = [];

            if (filter) {
                if (filter.postType) {
                    if (filter.postType === "image") {
                        // add filter that matches part of the attachment mime_type
                        newFilter.push({
                            field: "attachments.mime_type",
                            type: "like",
                            value: "image/%",
                        });
                    }

                    if (filter.postType === "video") {
                        // add filter that matches part of the attachment mime_type
                        newFilter.push({
                            field: "attachments.mime_type",
                            type: "like",
                            value: "video/%",
                        });
                    }

                    if (filter.postType === "mention") {
                        newFilter.push({
                            field: "mentions",
                            value: userId ?? loggedInUserId,
                        });
                    }

                    if (filter.postType === "file") {
                        newFilter.push({
                            field: "attachments.extension",
                            type: "like",
                            value: ["pdf", "doc", "docx", "xls", "xlsx"],
                        });
                    }

                    if (filter.postType === "announcement") {
                        newFilter.push({
                            field: "announced",
                            type: "like",
                            value: "true",
                        });
                    }

                    if (filter.postType === "poll") {
                        newFilter.push({
                            field: "type",
                            type: "like",
                            value: "poll",
                        });
                    }
                }
            }

            // console.log("NEW FILTER", newFilter);

            if (userId) {
                newFilter.push({
                    user_id: userId,
                });
            }

            if (communityId) {
                newFilter.push({
                    field: "community_id",
                    type: "like",
                    value: communityId,
                });
            }

            if (departmentId) {
                newFilter.push({
                    field: "department_id",
                    type: "like",
                    value: departmentId,
                });
            }

            const isDashboardWall = variant === "dashboard";

            if (["profile", "user-wall"].includes(variant) && !isSuperAdmin) {
                newFilter.push({
                    field: "announced",
                    type: "like",
                    value: "false",
                });
            }

            const postsResponse = await axios.get(`/api/posts/posts`, {
                params: {
                    with: [
                        "user",
                        "attachments",
                        "accessibilities",
                        "comments",
                        "poll",
                        "poll.question",
                        "poll.question.options",
                        "poll.responses",
                    ],
                    page: currentPage.current,
                    paginate: true,
                    perpage: postsPerScroll,
                    limit: postsPerScroll,
                    offset: (currentPage.current - 1) * postsPerScroll,
                    user_id: userId,
                    filter: [
                        {
                            field: "type",
                            type: "like",
                            value: [
                                "post",
                                "poll",
                                ["profile", "user-wall"].includes(variant) &&
                                    "birthday",
                            ],
                        },
                        ...newFilter,
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
    }, [filter?.postType]);

    return {
        posts: rawPosts,
        loading,
        fetchData,
        hasMore,
    };
}
