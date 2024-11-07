export const renderUploadLocation = (post) => {
    if (!post) {
        return;
    }

    if (post.department) {
        return (
            <div>
                <span className="font-bold">Department:</span>{" "}
                {post.department.name}
            </div>
        );
    }

    if (post.community) {
        return (
            <div>
                <span className="font-bold">Community:</span>{" "}
                {post.community.name}
            </div>
        );
    }

    return <div>Wall Posting</div>;
};

export const renderUploadLocationString = (post) => {
    if (!post) {
        return;
    }

    if (post.department) {
        return `Department: ${post.department.name}`;
    }

    if (post.community) {
        return `Community: ${post.community.name}`;
    }

    return `Wall Posting`;
};
