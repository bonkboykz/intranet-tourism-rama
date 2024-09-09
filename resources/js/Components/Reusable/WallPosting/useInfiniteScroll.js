import { useMemo } from "react";
import { useState, useEffect } from "react";

const postsPerScroll = 5;

export function useInfiniteScroll() {
    const [loading, setLoading] = useState(false);
    const [rawPosts, setRawPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const hasMore = currentPage < totalPages;

    // const [postsWithUserProfiles, setPostsWithUserProfiles] = useState([]);

    async function fetchData() {
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
                    page: currentPage,
                },
            });

            if ([401, 403, 500].includes(postsResponse.status)) {
                throw new Error("Network response was not ok");
            }
            // const postsData = await postsResponse.json();
            const postsData = postsResponse.data;

            // Add the data from the current page to allPosts
            // allPosts = allPosts.concat(
            //     postsData.data.data.map((post) => {
            //         post.attachments = Array.isArray(post.attachments)
            //             ? post.attachments
            //             : [post.attachments];
            //         return post;
            //     })
            // );

            console.log("posts data", postsData);
            setRawPosts((prevPosts) => {
                return prevPosts.concat(
                    postsData.data.data.map((post) => {
                        post.attachments = Array.isArray(post.attachments)
                            ? post.attachments
                            : [post.attachments];
                        return post;
                    })
                );
            });

            console.log("postsData", postsData);
            setTotalPages(postsData.data.last_page);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // const loadProfilesForPosts = async (rawPosts) => {
    //     setLoading(true);
    //     const data = await Promise.all(
    //         rawPosts.map(async (post) => {
    //             const userProfileResponse = await fetch(
    //                 `/api/users/users/${post.user_id}?with[]=profile`,
    //                 {
    //                     method: "GET",
    //                 }
    //             );
    //             const userProfileData = await userProfileResponse.json();
    //             post.userProfile = userProfileData.data;

    //             if (
    //                 Array.isArray(post.accessibilities) &&
    //                 post.accessibilities.length > 0
    //             ) {
    //                 const departmentNames = await Promise.all(
    //                     post.accessibilities.map(async (accessibility) => {
    //                         // TODO: Why we need this check?
    //                         if (
    //                             accessibility.accessable_type ===
    //                             accessibility.accessable_type
    //                         ) {
    //                             const departmentResponse = await fetch(
    //                                 `/api/department/departments/${accessibility.accessable_id}`
    //                             );
    //                             const departmentData =
    //                                 await departmentResponse.json();
    //                             return departmentData.data.name;
    //                         }
    //                         return null;
    //                     })
    //                 );
    //                 post.departmentNames = departmentNames
    //                     .filter((name) => name !== null)
    //                     .join(", ");
    //             } else {
    //                 post.departmentNames = null;
    //             }

    //             return post;
    //         })
    //     );

    //     console.log("Data", data);

    //     setPostsWithUserProfiles(data);

    //     setLoading(false);
    // };

    // useEffect(() => {
    //     loadProfilesForPosts(rawPosts);
    // }, [rawPosts]);

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
    };
}
