export function FeedbackOption({ optionText, onVote }) {
    return (
        <div
            className="flex gap-2.5 px-3.5 py-2.5 mt-4 text-sm leading-5 bg-gray-100 rounded-3xl text-neutral-800 max-md:flex-wrap cursor-pointer"
            onClick={onVote}
        >
            <div className="shrink-0 self-start w-3 bg-white rounded-full h-[11px]" />
            <div className="flex-auto max-md:max-w-full">{optionText}</div>
        </div>
    );
}
