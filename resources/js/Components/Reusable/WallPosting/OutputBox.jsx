import React from "react";

import { PersonalWall } from "./PersonalWall";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { UserWall } from "./UserWall";

import "./index.css";

function OutputData({
    filterType,
    filterId,
    communityId,
    departmentId,
    userId,
    postType,
}) {
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
        <>
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
        </>
    );
}

export default OutputData;
