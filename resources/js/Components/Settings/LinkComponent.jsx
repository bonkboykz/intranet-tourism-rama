import React, { useEffect, useState } from "react";
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function Pautan({ displayType }) {
  const [extlink, setExtlink] = useState([]);
  const [departmentLinks, setDepartmentLinks] = useState([]);
  const [nonDepartmentLinks, setNonDepartmentLinks] = useState([]);
  const [showAllDept, setShowAllDept] = useState(false);
  const [showAllNonDept, setShowAllNonDept] = useState(false);

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

        // Sort and categorize the links
        const sortedLinks = allLinks.sort((a, b) => a.label.localeCompare(b.label));
        console.log("All sorted links:", sortedLinks); // Log sorted links for debugging
        
        const deptLinks = sortedLinks.filter(link => link.label.toLowerCase().includes('dept'));
        const nonDeptLinks = sortedLinks.filter(link => !link.label.toLowerCase().includes('dept'));

        console.log("Department links:", deptLinks); // Log department links for debugging
        console.log("Non-department links:", nonDeptLinks); // Log non-department links for debugging

        setDepartmentLinks(deptLinks);
        setNonDepartmentLinks(nonDeptLinks);

      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchExtlink();
  }, []);

  // Determine which links to display
  const linksToDisplay = () => {
    console.log("Display Type:", displayType); // Log displayType for debugging
    if (displayType === 'department') {
      return showAllDept ? departmentLinks : departmentLinks.slice(0, 10);
    }
    if (displayType === 'nonDepartment') {
      return showAllNonDept ? nonDepartmentLinks : nonDepartmentLinks.slice(0, 10);
    }
    return [];
  };

  // Render the list including the "View All" or "Show Less" button
  return (
    <>
      <ul
        role="list"
        className="divide-y divide-gray-100 bg-white w-full shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
      >
        {linksToDisplay().map((refer, index) => {
          const isTop = index === 0;
          const isBottom = index === linksToDisplay().length - 1;
          const displayLabel = displayType === 'department' ? refer.label.replace(/\s*\(dept\)$/, '') : refer.label;

          return (
            <li
              key={refer.id}
              className={`relative flex justify-between gap-x-4 px-2 py-4 hover:bg-blue-100 sm:px-4 ${
                isTop ? 'rounded-t-lg' : ''
              }`}
            >
              <a href={refer.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 gap-x-4 w-full px-4">
                <img
                  src={`https://icons.duckduckgo.com/ip2/${new URL(refer.url).hostname}.ico`}
                  alt={`${displayLabel} favicon`}
                  className="h-6 w-6 flex-none"
                />
                <div className="min-w-0 flex-auto self-center pl-2">
                  <p className="text-md font-semibold leading-5 text-gray-900">
                    {displayLabel}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-x-2">
                  <ChevronRightIcon className="h-6 w-6 flex-none text-gray-400" aria-hidden="true" />
                </div>
              </a>
            </li>
          );
        })}
        {/* Button to show more or less */}
        {(displayType === 'department' || displayType === 'nonDepartment') && (
          <li className="relative flex justify-start gap-x-4 px-2 py-4 ml-4 sm:px-4 rounded-b-lg">
            <button
              onClick={() => {
                if (displayType === 'department') {
                  setShowAllDept(!showAllDept);
                } else {
                  setShowAllNonDept(!showAllNonDept);
                }
              }}
              className="text-blue-500 font-semibold"
            >
              {displayType === 'department' ? (showAllDept ? 'Show Less' : 'View All') : (showAllNonDept ? 'Show Less' : 'View All')}
            </button>
          </li>
        )}
      </ul>
    </>
  );
}
