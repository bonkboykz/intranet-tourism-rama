export const getUserPosition = (employmentPosts) => {
    if (!employmentPosts) {
        return "No title";
    }

    if (employmentPosts.length === 0) {
        return "No title";
    }

    const employmentPost = employmentPosts[0];

    if (!employmentPost) {
        return "No title";
    }

    const businessPost = employmentPost.business_post;

    if (!businessPost) {
        return "No title";
    }

    return businessPost.title;
};
