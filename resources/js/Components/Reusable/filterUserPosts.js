export const filterUserPosts = (posts, postType) => {
    let filteredPostData = sortedOutPosts.filter(
        (post) => post.type !== "story"
    );

    if (filterType !== null && filterId !== null) {
        filteredPostData = filteredPostData.filter((post) => {
            if (
                Array.isArray(post.accessibilities) &&
                post.accessibilities.length > 0
            ) {
                return post.accessibilities.some(
                    (accessibility) =>
                        accessibility.accessable_type === filterType &&
                        accessibility.accessable_id == filterId
                );
            }
            return false;
        });
    }

    const announcements = filteredPostData
        .filter((post) => post.type === "announcement")
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    const otherPosts = filteredPostData
        .filter((post) => post.type !== "announcement")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const sortedOutPosts = [...announcements, ...otherPosts].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const finalPosts = sortedOutPosts.filter((post) => {
        return (
            post.type !== "story" &&
            post.type !== "files" &&
            post.type !== "comment"
        );
    });

    return finalPosts.filter((post) => {
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
    });
};
