import { Loader2 } from "lucide-react";

import { useLazyLoading } from "@/Utils/hooks/useLazyLoading";

import { PollCard } from "./PollCard";

export function Polls() {
    const {
        data: userPolls,
        hasMore,
        isLoading,
        nextPage,
    } = useLazyLoading("/api/posts/all-polls");

    return (
        <>
            {userPolls.map((post) => (
                <div key={post.id}>
                    <PollCard post={post} className="max-w-full" />
                </div>
            ))}

            {hasMore && (
                <button
                    disabled={isLoading}
                    onClick={nextPage}
                    className="w-full py-2 mt-4 bg-primary-600 text-white rounded-md bg-primary hover:bg-primary-hover flex align-center justify-center"
                >
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        "Load More"
                    )}
                </button>
            )}
        </>
    );
}
