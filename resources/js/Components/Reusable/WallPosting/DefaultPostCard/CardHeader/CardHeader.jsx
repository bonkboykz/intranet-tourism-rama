export function CardHeader({ post }) {
    if (post.community) {
        return (
            <div className="flex w-full items-center justify-between h-auto mb-4">
                <span className="text-sm font-semibold text-neutral-600 bg-gray-200 rounded-lg px-2 py-1">
                    <span>Community:</span> {post.community.name}
                </span>
            </div>
        );
    }

    if (post.department) {
        return (
            <div className="flex w-full items-center justify-between h-auto mb-4">
                <span className="text-sm font-semibold text-neutral-600 bg-gray-200 rounded-lg px-2 py-1">
                    <span>Department:</span> {post.department.name}
                </span>
            </div>
        );
    }

    return (
        <div className="flex w-full items-center justify-between h-auto mb-4">
            {!post.announced && post.type !== "post" && (
                <span className="text-sm font-semibold text-neutral-600 bg-gray-200 rounded-lg px-2 py-1">
                    {post.accessibilities?.map((accessibility, index) => (
                        <span key={index}>
                            {accessibility.accessable_type}
                            {": "}
                        </span>
                    ))}
                    {post.departmentNames ? post.departmentNames : post.type}
                </span>
            )}
        </div>
    );
}
