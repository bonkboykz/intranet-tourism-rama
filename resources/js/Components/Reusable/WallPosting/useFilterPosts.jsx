import { useCallback } from "react";
import { useMemo } from "react";

export function useFilterPosts({
    postData,
    // filterType = null,
    // filterId = null,
    postType,
}) {
    // Define the filtering function
    const filterPosts = useCallback(
        (post) => {
            if (!postType) return true;

            // Handle mention type
            if (postType === "mention") {
                return post.mentions && JSON.parse(post.mentions).length > 0;
            }

            // Handle image, video, and file types based on the attachment extensions
            if (
                postType === "image" ||
                postType === "video" ||
                postType === "file"
            ) {
                const validExtensions = {
                    image: ["jpg", "jpeg", "png", "gif", "webp"],
                    video: ["mp4", "mov", "avi"],
                    file: ["pdf", "doc", "docx", "xls", "xlsx"],
                };

                return post.attachments.some((attachment) =>
                    validExtensions[postType].includes(attachment.extension)
                );
            }

            // Handle announcement type
            if (postType === "announcement") {
                return post.type === "announcement";
            }

            // Default filter by type
            return post.type === postType;
        },
        [postType]
    );

    const { finalPosts } = useMemo(() => {
        // Filter posts based on accessable_type and accessable_id
        let filteredPostData = postData.filter((post) => post.type !== "story");

        // if (filterType !== null && filterId !== null) {
        //     filteredPostData = filteredPostData.filter((post) => {
        //         if (
        //             Array.isArray(post.accessibilities) &&
        //             post.accessibilities.length > 0
        //         ) {
        //             return post.accessibilities.some(
        //                 (accessibility) =>
        //                     accessibility.accessable_type === filterType &&
        //                     accessibility.accessable_id == filterId
        //             );
        //         }
        //         return false;
        //     });
        // }

        // Separate announcements and non-announcements
        const announcements = filteredPostData.filter(
            (post) => post.type === "announcement"
        );
        const nonAnnouncements = filteredPostData.filter(
            (post) => post.type !== "announcement"
        );

        // Reverse the non-announcement posts
        // const reversedNonAnnouncements = filterType
        //     ? [...nonAnnouncements]
        //     : [...nonAnnouncements];

        // console.log("REVERSEDNON", reversedNonAnnouncements);

        // Combine announcements at the top with the reversed non-announcement posts
        const finalPosts = [...announcements, ...nonAnnouncements].filter(
            (post) => {
                return (
                    post.type !== "story" &&
                    post.type !== "files" &&
                    post.type !== "comment"
                );
            }
        );

        return { finalPosts };
    }, [postData]);

    return {
        // Apply the filter function to both postData and finalPosts
        someonesPosts: postData,
        filteredUserPosts: finalPosts,
    };
}
