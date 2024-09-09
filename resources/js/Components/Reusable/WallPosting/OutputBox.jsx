import React from "react";

import { useInfiniteScroll } from "./useInfiniteScroll";
import { Loader2 } from "lucide-react";
import { useFilterPosts } from "./useFilterPosts";
import { UserWall } from "./UserWall";
import { PersonalWall } from "./PersonalWall";
import { Polls } from "./Polls";
import { WallContext } from "./WallContext";

import "./index.css";

function OutputData({
    polls,
    filterType,
    filterId,
    userId,
    loggedInUserId,
    postType,
    variant,
}) {
    const { posts, loading, fetchData, hasMore } = useInfiniteScroll({
        userId: userId,
    });

    const { someonesPosts, filteredUserPosts } = useFilterPosts({
        postData: posts,
        filterId,
        filterType,
        postType,
    });

    console.log("someonesPosts", someonesPosts);

    // if (loading) {
    //     return (
    //         <div className="h-full w-full min-h-32 flex items-center justify-center">
    //             <Loader2 className="w-12 h-12 animate-spin" />
    //         </div>
    //     );
    // }

    return (
        <WallContext.Provider
            value={{
                variant,
                loggedInUserId,
            }}
        >
            <Polls polls={polls} />
            {userId ? (
                <UserWall
                    posts={someonesPosts}
                    onLoad={fetchData}
                    hasMore={hasMore}
                    userId={userId}
                />
            ) : (
                <PersonalWall
                    posts={filteredUserPosts}
                    onLoad={fetchData}
                    hasMore={hasMore}
                />
            )}
        </WallContext.Provider>
    );
}

export default OutputData;
