import React, { useEffect, useState } from "react";
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function Pautan() {
  const [extlink, setExtlink] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const itemsToShow = 10;

  useEffect(() => {
    const fetchExtlink = async () => {
      let allLinks = [];
      let currentPage = 1;
      let lastPage = 1;

      try {
        while (currentPage <= lastPage) {
          const response = await fetch(`/api/crud/external_links?page=${currentPage}`, {
            method: "GET",
            headers: { Accept: 'application/json' }
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          allLinks = allLinks.concat(data.data.data);
          lastPage = data.data.last_page;
          currentPage++;
        }
        const sortedLinks = allLinks.sort((a, b) => a.label.localeCompare(b.label));
        setExtlink(sortedLinks);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchExtlink();
  }, []);

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <>
      <ul
        role="list"
        className="divide-y divide-gray-100 bg-white w-full shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
      >
        {/* Display the items, either a limited number or all */}
        {(showAll ? extlink : extlink.slice(0, itemsToShow)).map((refer, index) => {
          const isTop = index === 0;
          const isBottom = index === extlink.length - 1;
          return (
            <li
              key={refer.id}
              className={`relative flex justify-between gap-x-4 px-2 py-4 hover:bg-blue-100 sm:px-4 ${
                isTop ? 'rounded-t-lg' : isBottom ? 'rounded-b-lg' : ''
              }`}
            >
              <a href={refer.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 gap-x-4 w-full px-4">
                <img
                  src={`https://icons.duckduckgo.com/ip2/${new URL(refer.url).hostname}.ico`}
                  alt={`${refer.label} favicon`}
                  className="h-6 w-6 flex-none"
                />
                <div className="min-w-0 flex-auto self-center pl-2">
                  <p className="text-md font-semibold leading-5 text-gray-900">
                    {refer.label}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-x-2">
                  <ChevronRightIcon className="h-6 w-6 flex-none text-gray-400" aria-hidden="true" />
                </div>
              </a>
            </li>
          );
        })}

        {/* Show More / Show Less Button, treated as a list item */}
        {extlink.length > itemsToShow && (
          <li className="relative flex justify-between gap-x-4 px-2 py-4 hover:bg-blue-100 sm:px-4">
            <button
              onClick={toggleShowAll}
              className="w-full text-left text-blue-500 font-bold px-4 py-0 hover:bg-blue-100 flex justify-between items-center"
            >
              <span>{showAll ? 'Show Less' : 'Show More'}</span>
              {/* <ChevronRightIcon className={`h-6 w-6 ${showAll ? 'rotate-0' : ''} text-blue-500`} aria-hidden="true" /> */}
            </button>
          </li>
        )}
      </ul>
    </>
  );
}
