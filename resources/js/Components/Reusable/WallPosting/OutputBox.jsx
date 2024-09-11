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

    return (
        <WallContext.Provider
            value={{
                variant,
                loggedInUserId,
            }}
        >
            <Polls polls={polls} />

            {/* TODO: PersonalWall is used on communities page, which could trigger multiple loads */}
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
