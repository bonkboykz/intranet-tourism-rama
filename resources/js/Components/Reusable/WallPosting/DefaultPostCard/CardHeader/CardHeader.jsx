export function CardHeader({ post, isClosed }) {
    if (post.community) {
        return (
            <div className="flex w-full items-center justify-between h-auto mb-4">
                <span className="text-sm font-semibold text-neutral-600 bg-gray-200 rounded-lg px-2 py-1">
                    <a
                        href={`/communityInner?communityId=${post.community.id}`}
                    >
                        <span>Community:</span> {post.community.name}
                    </a>
                </span>
            </div>
        );
    }

    if (post.department) {
        return (
            <div className="flex w-full items-center justify-between h-auto mb-4">
                <span className="text-sm font-semibold text-neutral-600 bg-gray-200 rounded-lg px-2 py-1">
                    <a
                        href={`/departmentInner?departmentId=${post.department.id}`}
                    >
                        <span>Department:</span> {post.department.name}
                    </a>
                </span>
            </div>
        );
    } //sini

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
            {isClosed && (
                <div
                    className={
                        "p-2 rounded-3xl min-w-20 font-bold bg-secondary text-white border-none"
                    }
                >
                    Poll is closed
                </div>
            )}
        </div>
    );
}
