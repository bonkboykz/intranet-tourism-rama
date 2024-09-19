// import React, { useEffect, useState } from "react";
// import { ChevronRightIcon, ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';

// const PAGE_SIZE = 15;

// export default function Pautan() {
//   const [extlink, setExtlink] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchExtlink = async () => {
//       let allLinks = [];
//       let currentPage = 1;
//       let lastPage = 1;

//       try {
//         while (currentPage <= lastPage) {
//           const response = await fetch(`/api/crud/external_links?page=${currentPage}`, {
//             method: "GET",
//             headers: { Accept: 'application/json' }
//           });
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           const data = await response.json();
//           allLinks = allLinks.concat(data.data.data);
//           lastPage = data.data.last_page;
//           currentPage++;
//         }
//         const sortedLinks = allLinks.sort((a, b) => a.label.localeCompare(b.label));
//         setExtlink(sortedLinks);
//       } catch (error) {
//         console.error('Error fetching links:', error);
//       }
//     };

//     fetchExtlink();
//   }, []);

//   const getCurrentPageLinks = () => {
//     const start = (currentPage - 1) * PAGE_SIZE;
//     const end = start + PAGE_SIZE;
//     return extlink.slice(start, end);
//   };

//   const totalPages = Math.ceil(extlink.length / PAGE_SIZE);

//   return (
//     <>
//       <ul
//         role="list"
//         className="divide-y divide-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
//       >
//         {getCurrentPageLinks().map((refer) => (
//           <li key={refer.id} className="relative flex justify-between gap-x-4 px-2 py-2 hover:bg-gray-50 sm:px-4">
//             <a href={refer.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 gap-x-4 w-full">
//               <div className="min-w-0 flex-auto">
//                 <p className="text-sm font-semibold leading-5 text-gray-900">
//                   {refer.label}
//                 </p>
//               </div>
//               <div className="flex shrink-0 items-center gap-x-2">
//                 <ChevronRightIcon className="h-4 w-4 flex-none text-gray-400" aria-hidden="true" />
//               </div>
//             </a>
//           </li>
//         ))}
//       </ul>

//       <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-4">
//         <div className="-mt-px flex w-0 flex-1">
//           <button
//             onClick={() => setCurrentPage(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
//           >
//             <ArrowLongLeftIcon aria-hidden="true" className="mr-3 h-5 w-5 text-gray-400" />
//             Previous
//           </button>
//         </div>
//         <div className="hidden md:-mt-px md:flex">
//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`inline-flex items-center border-t-2 ${
//                 currentPage === i + 1 ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
//               } px-4 pt-4 text-sm font-medium`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//         <div className="-mt-px flex w-0 flex-1 justify-end">
//           <button
//             onClick={() => setCurrentPage(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
//           >
//             Next
//             <ArrowLongRightIcon aria-hidden="true" className="ml-3 h-5 w-5 text-gray-400" />
//           </button>
//         </div>
//       </nav>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function Pautan() {
  const [extlink, setExtlink] = useState([]);

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

  return (
    <>
      <ul
        role="list"
        className="divide-y divide-gray-100 bg-white w-full shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
      >
        {extlink.map((refer, index) => {
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
      </ul>
    </>
  );
}







