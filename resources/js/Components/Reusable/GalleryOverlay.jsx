import { format } from "date-fns";

export function GalleryOverlay({ currentImage, images }) {
    if (!currentImage || !currentImage.src) {
        return null;
    }

    const post = images.find((post) =>
        post.attachments.some((attachment) =>
            currentImage.src?.includes(attachment.path)
        )
    );

    const author = post?.user;

    const renderUploadLocation = (post) => {
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

    return (
        <div className="absolute left-0 bottom-0 p-2 w-full min-h-24 text-sm text-slate-300 z-50 bg-black/50">
            Uploaded by {author?.profile?.bio} <br />
            On {format(new Date(post.created_at), "PPpp")}
            {renderUploadLocation()}
        </div>
    );
}
