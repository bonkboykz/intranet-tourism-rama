import React from "react";

import { PersonalWall } from "./PersonalWall";
import { Polls } from "./Polls";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { UserWall } from "./UserWall";
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
    const { posts, fetchData, hasMore } = useInfiniteScroll({
        userId: userId,
        communityId,
        departmentId,
        filter: {
            filterId,
            filterType,
            postType,
        },
    });

    return (
        <WallContext.Provider
            value={{
                variant,
                loggedInUserId,
            }}
        >
            {/* <Polls polls={polls} /> */}

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
