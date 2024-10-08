// import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// import UserFilePopup from '../Reusable/UserFilePopup';
// import Pagination from '../Paginator';
// const SearchInput = () => (
//   <div className="flex w-full gap-0 px-5 py-0 text-md bg-gray-100 rounded-full text-neutral-800 text-opacity-50 mt-8 my-2">
//     {/* <img
//       loading="lazy"
//       src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9a74adec558c689d2c2036311d5dad5a1cc1d44aea0cf5f88c1bd1bafeea3ce?apiKey=285d536833cc4168a8fbec258311d77b&"
//       alt="Search Icon"
//       className="shrink-0 w-4 aspect-square"
//     /> */}
//     <input
//       type="text"
//       className="w-full py-2 px-2 text-neutral-800 bg-gray-100 border-none font-bold focus:outline-none"
//       placeholder="Search files"
//     />
//   </div>
// );

// const SearchButton = () => (
//   <button className="justify-center px-4 py-3 my-auto text-sm font-bold text-center text-white bg-primary hover:bg-primary-hover rounded-3xl mt-8">
//     Search
//   </button>
// );

// // const Table = ({ userId }) => {
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10;
// //   const [files, setFiles] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchFiles = async () => {
// //       try {
// //         const response = await fetch(`/api/crud/resources`);
// //         if (!response.ok) {
// //           throw new Error('Failed to fetch files');
// //         }
// //         const responseData = await response.json();
// //         const filesData = responseData.data.data;

// //         // Filter the files based on the document types and userId
// //         const documentFiles = filesData.filter(file => {
// //           const ext = file.extension.toLowerCase();
// //           return (
// //             ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext) &&
// //             file.user_id === userId
// //           );
// //         });

// //         setFiles(documentFiles);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching files:', error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchFiles();
// //   }, [userId]);

// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);

// //   const handleRename = (index, newName) => {
// //     const updatedFiles = files.map((file, i) => {
// //       if (i === index) {
// //         const metadata = JSON.parse(file.metadata);
// //         metadata.name = newName;
// //         return { ...file, metadata: JSON.stringify(metadata) };
// //       }
// //       return file;
// //     });
// //     setFiles(updatedFiles);
// //   };

// //   const handleDelete = (index) => {
// //     const updatedFiles = files.filter((_, i) => i !== index);
// //     setFiles(updatedFiles);
// //   };

// //   return (
// //     <div className="w-full px-4 sm:px-0 lg:px-0 overflow-visible">
// //       <div className="mt-8 flow-root">
// //         <div className="overflow-visible">
// //           <div className="bg-white-200 w-full h-[715px] px-8 py-8 rounded-2xl shadow-custom overflow-visible">
// //             {files.length === 0 ? (
// //               <div className="text-center text-neutral-800">No files available</div>
// //             ) : (
// //               <table className="w-full rounded-2xl bg-white table-fixed overflow-visible border-separate border-spacing-1">
// //                 <thead>
// //                   <tr>
// //                     <th scope="col" className="w-1/3 md:w-1/2 lg:w-2/4 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-primary sm:pl-1 shadow-custom">Name</th>
// //                     <th scope="col" className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-primary shadow-custom">Size (MB)</th>
// //                     <th scope="col" className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-primary shadow-custom">Extension</th>
// //                     <th scope="col" className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-primary shadow-custom">Date Created</th>
// //                     <th scope="col" className="w-1/12 relative py-3.5 pl-3 pr-4 sm:pl-3"><span className="sr-only">Edit</span></th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y-reverse divide-neutral-300 text-center rounded-full">
// //                   {currentItems.map((item, index) => {
// //                     const metadata = JSON.parse(item.metadata);
// //                     return (
// //                       <tr key={index}>
// //                         <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 sm:pl-1 overflow-hidden text-ellipsis">
// //                           {metadata.name}
// //                         </td>
// //                         <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 overflow-hidden text-ellipsis">
// //                           {(item.filesize / 1024 / 1024).toFixed(2)} MB
// //                         </td>
// //                         <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 overflow-hidden text-ellipsis">
// //                           {item.extension}
// //                         </td>
// //                         <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 overflow-hidden text-ellipsis">
// //                           {new Date(item.created_at).toLocaleDateString()}
// //                         </td>
// //                         <td className="flex relative mt-3.5">
// //                           <UserFilePopup
// //                             name={metadata.name}
// //                             onRename={(newName) => handleRename(indexOfFirstItem + index, newName)}
// //                             onDelete={() => handleDelete(indexOfFirstItem + index)}
// //                           />
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             )}
// //             {files.length > 0 && (
// //               <Pagination totalItems={files.length} itemsPerPage={itemsPerPage} paginate={setCurrentPage} currentPage={currentPage} />
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// const Table = ({ userId, departmentID }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await fetch(`/api/crud/resources`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch files');
//         }
//         const responseData = await response.json();
//         const filesData = responseData.data.data;

//         // Filter the files based on the document types, userId, and departmentID
//         const documentFiles = filesData.filter(file => {
//           const ext = file.extension.toLowerCase();
//           return (
//             ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext) &&
//             file.user_id === userId &&
//             file.department_id === departmentID
//           );
//         });

//         setFiles(documentFiles);
//         console.log('DATA', documentFiles);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching files:', error);
//         setLoading(false);
//       }
//     };

//     fetchFiles();
//   }, [userId, departmentID]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (files.length === 0) {
//     return <div>No files available</div>;
//   }

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);

//   const handleRename = (index, newName) => {
//     const updatedFiles = files.map((file, i) => {
//       if (i === index) {
//         const metadata = JSON.parse(file.metadata);
//         metadata.name = newName;
//         return { ...file, metadata: JSON.stringify(metadata) };
//       }
//       return file;
//     });
//     setFiles(updatedFiles);
//   };

//   const handleDelete = (index) => {
//     const updatedFiles = files.filter((_, i) => i !== index);
//     setFiles(updatedFiles);
//   };

//   return (
//     <div className="w-full px-4 sm:px-0 lg:px-0 overflow-visible">
//       <div className="mt-8 flow-root">
//         <div className="overflow-visible">
//           <div className="bg-white-200 w-full h-[715px] px-8 py-8 rounded-2xl shadow-custom overflow-visible">
//             <table className="w-full rounded-2xl bg-white table-fixed overflow-visible border-separate border-spacing-1">
//               <thead>
//                 <tr>
//                   <th scope="col" className="w-1/3 md:w-1/2 lg:w-2/4 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-primary sm:pl-1 shadow-custom">Name</th>
//                   <th scope="col" className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-primary shadow-custom">Size (MB)</th>
//                   <th scope="col" className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-primary shadow-custom">Extension</th>
//                   <th scope="col" className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-primary shadow-custom">Date Created</th>
//                   <th scope="col" className="w-1/12 relative py-3.5 pl-3 pr-4 sm:pl-3"><span className="sr-only">Edit</span></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y-reverse divide-neutral-300 text-center rounded-full">
//                 {currentItems.map((item, index) => {
//                   const metadata = JSON.parse(item.metadata);
//                   return (
//                     <tr key={index}>
//                       <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 sm:pl-1 overflow-hidden text-ellipsis">
//                         {metadata.name}
//                       </td>
//                       <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 overflow-hidden text-ellipsis">
//                         {(item.filesize / 1024 / 1024).toFixed(2)} MB
//                       </td>
//                       <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 overflow-hidden text-ellipsis">
//                         {item.extension}
//                       </td>
//                       <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 overflow-hidden text-ellipsis">
//                         {new Date(item.created_at).toLocaleDateString()}
//                       </td>
//                       <td className="flex relative mt-3.5">
//                         <UserFilePopup
//                           name={metadata.name}
//                           onRename={(newName) => handleRename(indexOfFirstItem + index, newName)}
//                           onDelete={() => handleDelete(indexOfFirstItem + index)}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//             <Pagination totalItems={files.length} itemsPerPage={itemsPerPage} paginate={setCurrentPage} currentPage={currentPage} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { SearchButton, SearchInput, Table };

import React, { useEffect, useState } from "react";
import axios from "axios";

import Pagination from "../Paginator";
import UserFilePopup from "../Reusable/UserFilePopup";

const SearchInput = ({ searchTerm, onSearch }) => (
    <div className="flex w-full gap-0 px-4 py-0.5 text-md bg-gray-100 rounded-full text-neutral-800 text-opacity-50 mt-8 my-2">
        <input
            type="text"
            className="w-full text-neutral-800 bg-gray-100 border-none font-bold focus:outline-none rounded-full"
            placeholder="Search files"
            onChange={(e) => onSearch(e.target.value)}
            value={searchTerm}
        />
    </div>
);

const SearchButton = () => (
    <button className="justify-center px-4 py-3 my-auto text-sm font-bold text-center text-white bg-primary hover:bg-primary-hover rounded-3xl mt-8">
        Search
    </button>
);

const Table = ({ userId, departmentID, communityId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const params = {};

                if (communityId) {
                    params["scopes"] = [
                        {
                            accessfor: "posts",
                            accessableBy: ["Community", communityId],
                        },
                    ];
                } else if (departmentID) {
                    params["scopes"] = [
                        {
                            accessfor: "posts",
                            accessableBy: ["Department", departmentID],
                        },
                    ];
                }

                const response = await axios.get(`/api/resources/resources`, {
                    params: {
                        with: ["attachable.accessibilities"],
                        ...params,
                    },
                });

                if ([401, 403, 500].includes(response.status)) {
                    throw new Error("Failed to fetch files");
                }
                console.log(response.data);
                const filesData = response.data.data.data;

                // Filter the files based on the document types, userId, and departmentID
                const documentFiles = filesData.filter((file) => {
                    const ext = file.extension.toLowerCase();
                    return [
                        "pdf",
                        "doc",
                        "docx",
                        "xls",
                        "xlsx",
                        "ppt",
                        "pptx",
                    ].includes(ext);
                });

                setFiles(documentFiles);
                console.log("DATA", documentFiles);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching files:", error);
                setLoading(false);
            }
        };

        fetchFiles();
    }, [userId, departmentID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (files.length === 0) {
        return <div>No files available</div>;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);

    const handleRename = (index, newName) => {
        const updatedFiles = files.map((file, i) => {
            if (i === index) {
                const metadata =
                    typeof file.metadata === "string"
                        ? JSON.parse(file.metadata)
                        : file.metadata;
                metadata.name = newName;
                return { ...file, metadata: JSON.stringify(metadata) };
            }
            return file;
        });
        setFiles(updatedFiles);
    };

    const handleDelete = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
    };

    return (
        <div className="w-full px-4 sm:px-0 lg:px-0 overflow-visible">
            <div className="mt-8 flow-root">
                <div className="overflow-visible">
                    <table className="w-full rounded-2xl p-4 bg-white shadow-custom table-fixed overflow-visible border-separate border-spacing-1">
                        <thead>
                            <tr>
                                <th className="w-1/3 md:w-3/4 lg:w-3/4 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm max-md:text-xs font-semibold text-primary sm:pl-1 shadow-custom">
                                    File Name
                                </th>
                                {/* <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 max-md:px-0 text-center text-sm max-md:text-xs font-semibold text-primary shadow-custom">
                      Uploaded By
                  </th> */}
                                <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 max-md:px-0 text-center text-sm max-md:text-xs font-semibold text-primary shadow-custom">
                                    Date Created
                                </th>
                                <th className="w-1/12 relative py-3.5">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-reverse divide-neutral-300 text-center rounded-full">
                            {currentItems.map((item, index) => {
                                const metadata =
                                    typeof item.metadata === "string"
                                        ? JSON.parse(item.metadata)
                                        : item.metadata;
                                return (
                                    <tr key={index}>
                                        <td className="border-b border-r text-start font-bold border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 sm:pl-1 overflow-hidden text-ellipsis">
                                            {metadata.original_name ||
                                                "Unknown"}
                                        </td>
                                        <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 overflow-hidden text-ellipsis">
                                            {new Date(
                                                item.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="flex relative mt-3.5">
                                            <UserFilePopup
                                                name={metadata.name}
                                                onRename={(newName) =>
                                                    handleRename(
                                                        indexOfFirstItem +
                                                            index,
                                                        newName
                                                    )
                                                }
                                                onDelete={() =>
                                                    handleDelete(
                                                        indexOfFirstItem + index
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <Pagination
                        totalItems={files.length}
                        itemsPerPage={itemsPerPage}
                        paginate={setCurrentPage}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export { SearchButton, SearchInput, Table };
