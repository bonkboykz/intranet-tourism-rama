import React from "react";

import { useInfiniteScroll } from "./useInfiniteScroll";
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
    communityId,
    departmentId,
    userId,
    loggedInUserId,
    postType,
    variant,
}) {
    // TODO: return announcments
    const { posts, loading, fetchData, hasMore } = useInfiniteScroll({
        userId: userId,
        communityId,
        departmentId,
        filter: {
            filterId,
            filterType,
            postType,
        },
    });

    // const { someonesPosts, filteredUserPosts } = useFilterPosts({
    //     postData: posts,
    //     filterId,
    //     filterType,
    //     postType,
    // });

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
                    posts={posts}
                    onLoad={fetchData}
                    hasMore={hasMore}
                    userId={userId}
                />
            ) : (
                <PersonalWall
                    posts={posts}
                    onLoad={fetchData}
                    hasMore={hasMore}
                />
            )}
        </WallContext.Provider>
    );
}

export default OutputData;
