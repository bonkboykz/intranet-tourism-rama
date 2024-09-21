// import React, { useState, useEffect } from "react";
// import { usePage } from '@inertiajs/react';

// const ProfileCard = ({ name, status , position }) => {
//   const getStatusIndicatorClass = (status) => {
//     switch (status) {
//       case "Online":
//         return "bg-green-500";
//       case "Away":
//         return "bg-yellow-500";
//       case "Offline":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className="flex gap-3 hover:bg-blue-100 w-full px-0 py-5 mt-2 rounded-xl">

//       <div className="relative flex items-center h-16 sm:h-[75px] ml-2 ">
//         <img
//           loading="lazy"
//           src="/assets/person.svg"
//           alt={`${name}'s portrait`}
//           className="shrink-0 w-16 h-16 sm:w-[75px] sm:h-[75px] rounded-full"
//         />
//         <div
//           className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${getStatusIndicatorClass(status)}`}
//         />
//       </div>
//       <div className="flex flex-col self-start mt-2.5">
//         <div className="text-base sm:text-lg font-extrabold">{name}</div>
//         <div className="sm:mt-0 text-sm">Timbalan Pengarah Kanan{position}</div>
//         <div className="sm:mt-2 text-xs text-neutral-800 text-opacity-50">{status}</div>
//       </div>
//     </div>
//   );
// };

// const MyComponent = () => {
//   const { props } = usePage();
//   const { id } = props; // Access the user ID from props
//   const [userName, setUserName] = useState('');
//   const [statusFilter, setStatusFilter] = useState("Online");

//   useEffect(() => {
//     console.log("Fetching user data...");
//     fetch("/api/crud/users", {
//       method: "GET",
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("User data fetched:", data); // Log fetched data
//         if (data && data.data) {
//           const users = Array.isArray(data.data) ? data.data : data.data.data;
//           console.log("Parsed user data:", users); // Log parsed user data
//           const currentUserData = users.find((user) => user.id === id);
//           if (currentUserData) {
//             setUserName(currentUserData.name);
//           } else {
//             console.log(`User with ID ${id} not found in fetched data.`);
//           }
//         } else {
//           console.log("No user data found.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching user data:", error);
//       });
//   }, [id]);

//   const handleStatusFilter = (status) => {
//     setStatusFilter(status);
//   };

//   const filteredUsers = userName && statusFilter === "Online" ? [{ name: userName, status: "Online" }] : [];

//   console.log("Filtered users:", filteredUsers);

//   return (
//     <div className="w-full min-h-screen bg-slate-100">
//       <section className="flex flex-col items-center py-10">
//         <header className="font-sans ml-4 text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-10 mb-6 w-full sm:w-96 sm:absolute left-5 sm:left-20">
//           Who’s Online
//           <div className="font-extrabold text-neutral-800 mt-2 mb-6 border-b-2 border-neutral-300"></div>
//         </header>
//         <div className="container max-w-screen-lg bg-white py-6 px-4 rounded-xl mt-10 sm:mt-40 mb-40 items-start shadow-2xl mx-5">
//           <div className="flex flex-col text-neutral-800 ">
//             <header className="text-xl sm:text-2xl font-extrabold text-neutral-800 ml-2">
//                 Online List
//             </header>
//             <div className="flex flex-row justify-start items-start sm:flex-row gap-2 sm:gap-4 mt-4 text-lg font-semibold text-neutral-800 ml-2 sm:ml-2 max-md:pr-5">
//               <div className="relative flex items-center gap-1 sm:ml-0">
//                 <button
//                   className={`grow ${statusFilter === "Online" ? "underline text-black" : "text-gray-700 text-opacity-50"}`}
//                   onClick={() => handleStatusFilter("Online")}
//                 >
//                   Online
//                 </button>
//                 <div
//                   className={`w-3 h-3 rounded-full border-2 border-white ${statusFilter === "Online" ? "bg-green-500" : "bg-green-500 opacity-50"}`}
//                 />
//               </div>
//               <div className="relative flex items-center gap-1">
//                 <button
//                   className={`grow ${statusFilter === "Away" ? "underline text-black" : "text-gray-700 text-opacity-50"}`}
//                   onClick={() => handleStatusFilter("Away")}
//                 >
//                   Away
//                 </button>
//                 <div className="w-6 h-6 rounded-full border-2 border-white">
//                   {statusFilter === "Away" ? (
//                     <img src="/assets/awayicon1.svg" alt="Active Away Icon" className="w-full h-full" />
//                   ) : (
//                     <img src="/assets/awayicon.svg" alt="Inactive Away Icon" className="w-full h-full opacity-50" />
//                   )}
//                 </div>
//               </div>
//               <div className="relative flex items-center gap-1">
//                 <button
//                   className={`grow ${statusFilter === "Offline" ? "underline text-black" : "text-gray-700 text-opacity-50"}`}
//                   onClick={() => handleStatusFilter("Offline")}
//                 >
//                   Offline
//                 </button>
//                 <div
//                   className={`w-3 h-3 rounded-full border-2 border-white ${statusFilter === "Offline" ? "bg-red-500" : "bg-red-500 opacity-50"}`}
//                 />
//               </div>
//             </div>

//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((online, index) => (
//                 <ProfileCard
//                   key={index}
//                   name={online.name}
//                   status={online.status}
//                 />
//               ))
//             ) : (
//               <p className="ml-4 mt-2">No users found</p>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default MyComponent;

import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import Example from "@/Layouts/DashboardLayoutNew";

const ProfileCard = ({ name, status, ID_USER }) => {
    const [isUserProfile, setIsUserProfile] = useState({
        image: "",
    });

    useEffect(() => {
        fetch(`/api/users/users/${ID_USER}?with[]=profile`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(({ data }) => {
                setIsUserProfile({
                    ...data,
                    image: data.profile?.image,
                });
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, [ID_USER]);

    const source = () => {
        if (!isUserProfile.image) {
            return `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${isUserProfile.name}&rounded=true`;
        }

        return isUserProfile.image === "/assets/dummyStaffPlaceHolder.jpg"
            ? isUserProfile.image
            : isUserProfile.image.startsWith("avatar/")
              ? `/storage/${isUserProfile.image}`
              : `/avatar/${isUserProfile.image}`;
    };

    const getStatusIndicatorClass = (status) => {
        switch (status) {
            case "Online":
                return "bg-green-500";
            case "Away":
                return "bg-yellow-500";
            case "Offline":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <a href={`/user/${ID_USER}`} className="no-underline">
            <div className="flex gap-4 hover:bg-blue-100 w-full px-2 py-2 mt-1 rounded-xl">
                <div className="relative flex items-center h-16 sm:h-[75px] ml-2">
                    <img
                        loading="lazy"
                        src={source()}
                        alt={`${name}'s portrait`}
                        className="shrink-0 w-16 h-16 sm:w-[75px] sm:h-[75px] rounded-full"
                    />
                    <div
                        className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${getStatusIndicatorClass(status)}`}
                    />
                </div>
                <div className="flex flex-col self-start mt-2">
                    <div className="text-base sm:text-lg font-extrabold">
                        {name}
                    </div>
                    <div className="sm:mt-2 text-xs text-neutral-800 text-opacity-50">
                        {status}
                    </div>
                </div>
            </div>
        </a>
    );
};

const MyComponent = () => {
    const { props } = usePage();
    const { id } = props; // Access the user ID from props
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const channel = window.Echo.join("online")
            .here((users) => {
                setOnlineUsers(
                    users.map((user) => ({ ...user, status: "Online" }))
                );
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => [
                    ...prevOnlineUsers,
                    { ...user, status: "Online" },
                ]);
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) =>
                    prevOnlineUsers.filter(
                        (onlineUser) => onlineUser.id !== user.id
                    )
                );
            });

        return () => {
            channel.leave();
        };
    }, []);

    return (
        <Example>
        <div className="w-full min-h-screen bg-slate-100">
            <section className="flex flex-col items-center py-10 px-8 max-md:px-4">
                <header className="flex justify-between items-center w-full">
                    <div className="w-full font-sans text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-10 max-md:mt-4 mb-4">
                        Who’s Online
                        <div className="font-extrabold mt-4 mb-6 max-md:mb-0 border-b border-neutral-300"></div>
                    </div>
                </header>
                <div className="w-full bg-white p-6 rounded-2xl mt-4 items-start shadow-2xl">
                    <div className="flex flex-col text-neutral-800">
                        <header className="flex justify-between items-center text-xl sm:text-2xl font-extrabold text-neutral-800 mb-4">
                            <span className="underline">Online List</span>
                            <button
                                onClick={() => window.history.back()}
                                className="text-blue-500 hover:text-blue-700 font-bold"
                            >
                                Back
                            </button>
                        </header>
                        {onlineUsers.length > 0 ? (
                            onlineUsers.map((online, index) => (
                                <ProfileCard
                                    key={index}
                                    name={online.name}
                                    status={online.status}
                                    position={online.position}
                                    ID_USER={online.id}
                                />
                            ))
                        ) : (
                            <p className="ml-4 mt-2">No users found</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
        </Example>
    );
};

export default MyComponent;
