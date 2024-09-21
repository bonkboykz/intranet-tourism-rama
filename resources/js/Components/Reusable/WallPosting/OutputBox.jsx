import React from "react";
import { useContext } from "react";

import useUserData from "@/Utils/hooks/useUserData";
import { isBirthdayDay } from "@/Utils/isBirthday";

import { DefaultPostCard } from "./DefaultPostCard/DefaultPostCard";
import { PersonalWall } from "./PersonalWall";
import { SystemBirthdayCard } from "./SystemBirthdayCard/SystemBirthdayCard";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { UserWall } from "./UserWall";
import { WallContext } from "./WallContext";

import "./index.css";

function OutputData({
    loggedInUserId,
    filterType,
    filterId,
    communityId,
    departmentId,
    userId,
    postType,
}) {
    const { variant } = useContext(WallContext);

    const { posts, fetchData, hasMore } = useInfiniteScroll({
        variant,
        userId: userId,
        communityId,
        departmentId,
        loggedInUserId,
        filter: {
            filterId,
            filterType,
            postType,
        },
    });

    const user = useUserData();

    const userHasBirthday = user.dob && isBirthdayDay(user.dob, new Date());

    const renderWall = () => {
        switch (variant) {
            case "profile":
                return (
                    <>
                        <SystemBirthdayCard />

                        <UserWall
                            posts={posts}
                            onLoad={fetchData}
                            hasMore={hasMore}
                            userId={userId}
                        />
                    </>
                );
            case "user-wall":
                return (
                    <UserWall
                        posts={posts}
                        onLoad={fetchData}
                        hasMore={hasMore}
                        userId={userId}
                    />
                );
            case "community":
            case "department":
                return (
                    <PersonalWall
                        posts={posts}
                        onLoad={fetchData}
                        hasMore={hasMore}
                    />
                );
            case "dashboard":
            default:
                return (
                    <PersonalWall
                        posts={posts}
                        onLoad={fetchData}
                        hasMore={hasMore}
                    />
                );
        }
    };

    return (
        <>
            {/* TODO: PersonalWall is used on communities page, which could trigger multiple loads */}
            {renderWall()}
        </>
    );
}

export default OutputData;
