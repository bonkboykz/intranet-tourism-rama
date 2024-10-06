import { useEffect } from "react";
import { useMemo } from "react";
import { FaLock } from "react-icons/fa";
import { usePage } from "@inertiajs/inertia-react";

import { getProfileImage } from "@/Utils/getProfileImage";
import { getUserPosition } from "@/Utils/getUserPosition";
import { useLoading } from "@/Utils/hooks/useLazyLoading";
import { useSearchParams } from "@/Utils/hooks/useSearchParams";

import { PersonalWall } from "../Reusable/WallPosting/PersonalWall";
import { WallContext } from "../Reusable/WallPosting/WallContext";

const CommunityItem = ({ id, name, type, banner, membersCount }) => {
    return (
        <article className="flex items-center w-full gap-3 py-1 ">
            <div className="">
                <img
                    src={banner ?? "assets/departmentsDefault.jpg"}
                    alt={`${name} community image`}
                    className="block w-[66px] h-[66px] object-cover object-center rounded-full max-w-[80px] max-h-[80px]"
                />
            </div>
            <div className="flex flex-col w-full overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
                <div className="flex items-center">
                    <h2 className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {name}
                    </h2>
                    {type === "private" && (
                        <FaLock className="w-3 h-3 ml-2 text-gray-600 fill-black" /> // Lock icon for private communities
                    )}
                </div>
                <p className="text-xs font-semibold text-neutral-600">
                    {membersCount} followers
                </p>
            </div>

            <a href={`/communityInner?communityId=${id}`}>
                <button
                    className="justify-center text-white font-semibold px-5 rounded-3xl border bg-blue-500 hover:bg-white hover:text-blue-500"
                    aria-label="Visit"
                >
                    Visit
                </button>
            </a>
        </article>
    );
};

const UserItem = ({ id, name, image, position }) => {
    return (
        <a href={`/users/${id}`}>
            <article className="flex items-center w-full gap-3 py-1 ">
                <div className="">
                    <img
                        src={image}
                        alt={`${name} profile image`}
                        className="block w-[66px] h-[66px] object-cover object-center rounded-full max-w-[80px] max-h-[80px]"
                    />
                </div>
                <div className="flex flex-col w-full overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
                    <div className="flex items-center">
                        <h2 className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {name}
                        </h2>
                    </div>
                    <p className="text-xs font-semibold text-neutral-600">
                        {position}
                    </p>
                </div>
            </article>
        </a>
    );
};

export function GlobalSearch() {
    const { searchParams } = useSearchParams();

    const q = searchParams.get("q") ?? "";

    const { data, isLoading } = useLoading("/api/search?q=" + q);

    const communities = useMemo(() => {
        return data?.communities?.data ?? [];
    }, [data]);

    const users = useMemo(() => {
        return data?.users?.data ?? [];
    }, [data]);

    const posts = useMemo(() => {
        return data?.posts?.data ?? [];
    }, [data]);

    const onLoadMorePosts = () => {};

    if (q === "") {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-600">No search query</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {communities.length > 0 && (
                <section className="flex flex-col items-start py-2 px-4 bg-white border-2 rounded-2xl shadow-custom max-w-[700px]">
                    <h2
                        style={{
                            fontWeight: "bold",
                            fontSize: "24px",
                            fontFamily: "Nunito Sans",
                            marginTop: "10px",
                            textAlign: "start",
                        }}
                    >
                        Communities
                    </h2>
                    <hr className="border border-gray-200 w-full"></hr>
                    <div className="flex flex-col justify-center w-full py-4">
                        {communities.map((community) => {
                            console.log("community", community);
                            return (
                                <CommunityItem
                                    key={community.id}
                                    id={community.id}
                                    name={community.name}
                                    type={community.type}
                                    banner={community.banner}
                                    membersCount={community.members_count}
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            {users.length > 0 && (
                <section className="flex flex-col items-start py-2 px-4 bg-white border-2 rounded-2xl shadow-custom  max-w-[700px]">
                    <h2
                        style={{
                            fontWeight: "bold",
                            fontSize: "24px",
                            fontFamily: "Nunito Sans",
                            marginTop: "10px",
                            textAlign: "start",
                        }}
                    >
                        Users
                    </h2>
                    <hr className="border border-gray-200 w-full"></hr>

                    <div className="flex flex-col justify-center w-full py-4">
                        {users.map((user) => {
                            return (
                                <UserItem
                                    key={user.id}
                                    id={user.id}
                                    name={user.name}
                                    image={getProfileImage(
                                        user.profile,
                                        user.name
                                    )}
                                    position={getUserPosition(
                                        user.employment_posts
                                    )}
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            <PersonalWall
                posts={posts}
                onLoad={onLoadMorePosts}
                hasMore={false}
            />
        </div>
    );
}