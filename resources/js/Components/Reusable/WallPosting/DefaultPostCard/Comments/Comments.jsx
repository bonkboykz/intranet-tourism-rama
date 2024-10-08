import { CommentsIcon } from "@/Components/Icons/CommentsIcon";

export function Comments({ comments, onCommentsOpen }) {
    const commentsCount = comments.length;

    return (
        <>
            <CommentsIcon
                className="w-6 h-6 cursor-pointer text-primary"
                onClick={onCommentsOpen}
            />
            {commentsCount > 0 && (
                <span className="text-sm font-medium">{commentsCount}</span>
            )}
        </>
    );
}
