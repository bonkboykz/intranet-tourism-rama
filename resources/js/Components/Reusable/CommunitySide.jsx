import React, { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa"; // Import the lock icon
import axios from "axios";

const CommunityItem = ({
    id,
    name,
    category,
    imgSrc,
    altText,
    memberCount,
}) => (
    <a href={`/communityInner?communityId=${id}`}>
        <article className="flex items-start w-full gap-3 py-1 ">
            <div className="flex flex-col items-center mt-2 text-xs font-semibold uppercase">
                <img
                    src={imgSrc}
                    alt={altText}
                    className="w-[120px] h-[40px] rounded-md object-cover object-center"
                />
            </div>
            <div className="flex flex-col w-full mt-2 overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
                <div className="flex items-center">
                    <h2 className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {name}
                    </h2>
                    {category === "private" && (
                        <FaLock className="w-3 h-3 ml-2 text-gray-600 fill-black" /> // Lock icon for private communities
                    )}
                </div>
                <p className="text-xs font-semibold text-neutral-600">
                    {memberCount} followers
                </p>
            </div>
        </article>
    </a>
);

function MyComponent() {
    const [communities, setCommunities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCommunities = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/communities/communities`, {
                params: {
                    // ?perpage=5&page=1&limit=1&sort=created_at&order=desc
                    perpage: 5,
                    page: 1,
                    limit: 5,
                    sort: [{ created_at: "desc" }],
                    filter: [
                        {
                            field: "is_archived",
                            type: "like",
                            value: false,
                        },
                    ],
                },
            });
            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Network response was not ok");
            }
            const data = response.data;

            const communityData = data.data.data.map((community) => {
                return {
                    id: community.id,
                    name: community.name,
                    category: community.type,
                    imgSrc: community.banner
                        ? community.banner
                        : "assets/departmentsDefault.jpg",
                    altText: `${community.name} community image`,
                    createdAt: new Date(community.created_at),
                    isArchived: community.is_archived,
                    memberCount: community.members_count,
                };
            });

            setCommunities(communityData);
        } catch (error) {
            console.error("Error fetching communities:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    return (
        <div className="flex flex-col justify-center max-w-[320px] text-neutral-800 mb-10">
            <section className="flex flex-col items-start py-2 px-4 bg-white border-2 rounded-2xl shadow-custom">
                <h2
                    style={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        fontFamily: "Nunito Sans",
                        marginTop: "10px",
                        textAlign: "start"
                    }}
                >
                    Communities
                </h2>
                <hr className="border border-gray-200 w-full"></hr>
                <div className="flex flex-col justify-center w-full py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        communities.map((community, index) => (
                            <CommunityItem
                                key={index}
                                id={community.id}
                                name={community.name}
                                category={community.category}
                                imgSrc={community.imgSrc}
                                altText={community.altText}
                                memberCount={community.memberCount}
                            />
                        ))
                    )}
                </div>
                <hr className="border border-gray-200 w-full"></hr>
                <a href="../community">
                    <button className="flex items-center my-2 text-sm font-bold">
                        VIEW ALL
                        <img
                            src="assets/viewAllArrow.png"
                            alt="Arrow right"
                            className="w-4 h-3 ml-2"
                        />
                    </button>
                </a>
            </section>
        </div>
    );
}

export default MyComponent;
