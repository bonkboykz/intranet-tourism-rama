import React, { useState, useEffect } from 'react';
import { FaLock } from 'react-icons/fa'; // Import the lock icon

const CommunityItem = ({ id, name, category, imgSrc, altText, memberCount }) => (
  <a href={`/communityInner?communityId=${id}`}>
    <article className="flex items-start w-full gap-3 px-4 py-1 mt-1">
      <div className="flex flex-col items-center mt-2 text-xs font-semibold uppercase">
        <img
          src={imgSrc}
          alt={altText}
          className="w-[120px] h-[40px] rounded-md object-cover object-center"
        />
      </div>
      <div className="w-full flex flex-col mt-2 text-md font-bold text-ellipsis overflow-hidden whitespace-nowrap">
        <div className="flex items-center">
          <h2 className="text-ellipsis overflow-hidden whitespace-nowrap">{name}</h2>
          {category === 'private' && (
            <FaLock className="ml-2 h-3 w-3 text-gray-600 fill-black" /> // Lock icon for private communities
          )}
        </div>
        <p className="text-xs font-semibold text-neutral-600">{memberCount} followers</p>
       
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
      const response = await fetch('/api/communities/communities', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const archivedState = JSON.parse(localStorage.getItem('archivedCommunities')) || {};

      const communityDataPromises = data.data.data.map(async (community) => {
        const memberCountResponse = await fetch(`/api/communities/community_members?community_id=${community.id}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        const memberCountData = await memberCountResponse.json();
        const memberCount = memberCountData.length || 0;

        return {
          id: community.id,
          name: community.name,
          category: community.type,
          imgSrc: community.banner ? community.banner : 'assets/departmentsDefault.jpg',
          altText: `${community.name} community image`,
          createdAt: new Date(community.created_at),
          isArchived: archivedState[community.id] || false, // Check if the community is archived
          memberCount, // Add member count here
        };
      });

      const communityData = await Promise.all(communityDataPromises);

      setCommunities(
        communityData
          .filter((community) => !community.isArchived) // Filter out archived communities
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 5) // Limit to 5 latest communities
      );
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="flex flex-col justify-center max-w-[320px] text-neutral-800 mb-20">
      <section className="flex flex-col items-start py-2 bg-white border-2 rounded-2xl shadow-custom">
        <h1 className="ml-4 mt-2 text-2xl font-bold">Communities</h1>
        <hr className="border border-gray-200 w-[270px] mx-4 -mt-4"></hr>
        {isLoading ? (
          <div className="mt-20 ml-20 loading-spinner"></div>
        ) : (
          communities.map((community, index) => (
            <CommunityItem
              key={index}
              id={community.id}
              name={community.name}
              category={community.category}
              imgSrc={community.imgSrc}
              altText={community.altText}
              memberCount={community.memberCount} // Pass member count as a prop
            />
          ))
        )}
        <hr className="border border-gray-200 w-[270px] mx-4 mt-2"></hr>
        <a href='../community'>
          <button className="ml-4 my-2 font-bold text-sm flex items-center">
            VIEW ALL
            <img src="assets/viewAllArrow.png" alt="Arrow right" className="ml-2 h-3 w-4" />
          </button>
        </a>
      </section>
    </div>
  );
}


export default MyComponent;
