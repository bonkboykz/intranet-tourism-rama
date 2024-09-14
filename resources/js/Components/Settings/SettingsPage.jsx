// import React, { useState, useEffect, useRef  } from 'react';
// import axios from 'axios';
// import {
//   format,
//   addMonths,
//   subMonths,
//   startOfMonth,
//   endOfMonth,
//   startOfWeek,
//   endOfWeek,
//   eachDayOfInterval,
//   isSameMonth,
//   isSameDay,
//   parseISO,
//   subDays
// } from 'date-fns';
// import { Switch, Menu, Transition } from '@headlessui/react';
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
// import { ChevronLeftIcon, ChevronRightIcon, ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// const Pautan = () => {
//     const [apps, setApps] = useState([]); // Initialize apps as an array
//     const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//     const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
//     const [currentDeleteId, setCurrentDeleteId] = useState(null);
//     const [newAppName, setNewAppName] = useState('');
//     const [newAppUrl, setNewAppUrl] = useState('');

//     const PautanHandleDragEnd = (result) => {
//       if (!result.destination) return;

//       const reorderedApps = Array.from(apps);
//       const [reorderedItem] = reorderedApps.splice(result.source.index, 1);
//       reorderedApps.splice(result.destination.index, 0, reorderedItem);

//       setApps(reorderedApps);
//     };

//     const PautanHandleAddApp = async () => {
//       const newApp = { name: newAppName, url: newAppUrl };

//       try {
//         const response = await fetch('http://127.0.0.1:8000/api/crud/external_links', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newApp),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           console.error('Error:', errorData);
//           // Handle error messages as needed
//           return;
//         }

//         const responseData = await response.json();
//         const newId = responseData.id;
//         setApps([...apps, { id: newId, name: newAppName, url: newAppUrl }]);
//         setNewAppName('');
//         setNewAppUrl('');
//         setIsAddModalVisible(false);
//       } catch (error) {
//         console.error('Error:', error);
//         // Handle the error as needed
//       }
//     };

//     const PautanHandleDeleteApp = () => {
//       setApps(apps.filter(app => app.id !== currentDeleteId));
//       setIsDeleteModalVisible(false);
//     };

//     const handleMoveUp = (index) => {
//       if (index === 0) return;
//       const newApps = [...apps];
//       [newApps[index - 1], newApps[index]] = [newApps[index], newApps[index - 1]];
//       setApps(newApps);
//     };

//     const handleMoveDown = (index) => {
//       if (index === apps.length - 1) return;
//       const newApps = [...apps];
//       [newApps[index + 1], newApps[index]] = [newApps[index], newApps[index + 1]];
//       setApps(newApps);
//     };

//     const handleSave = () => {
//       console.log("Changes saved", apps);
//     };

//     return (
//       <>
//         <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-10">
//           <div className="flex items-center justify-between mb-2 border-b border-gray-200">
//             <h2 className="mb-3 text-2xl font-bold text-blue-500 ">External Apps</h2>
//             <button
//               className="px-4 py-1 mb-2 font-bold text-white bg-blue-500 rounded-full"
//               onClick={() => setIsAddModalVisible(true)}
//             >
//               + Add
//             </button>
//           </div>
//           <DragDropContext onDragEnd={PautanHandleDragEnd}>
//             <Droppable droppableId="apps">
//               {(provided) => (
//                 <table className="min-w-full divide-y divide-gray-200" {...provided.droppableProps} ref={provided.innerRef}>
//                   <thead>
//                     <tr>
//                       <th className="px-6 py-3 text-base font-bold text-center text-gray-900">App name</th>
//                       <th className="px-6 py-3 text-base font-bold text-center text-gray-900">URL</th>
//                       <th className="px-6 py-3 text-base font-bold text-center text-gray-900">Order</th>
//                       <th className="px-6 py-3 text-base font-bold text-center text-gray-900">Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody {...provided.droppableProps} ref={provided.innerRef}>
//                     {apps.map((app, index) => (
//                       <Draggable key={app.id} draggableId={String(app.id)} index={index}>
//                         {(provided) => (
//                           <tr
//                             ref={provided.innerRef}
//                             className="bg-white border-t border-gray-200"
//                             {...provided.draggableProps}
//                           >
//                             <td className="px-6 py-4 text-sm font-semibold text-black whitespace-nowrap" {...provided.dragHandleProps}>
//                               <input
//                                 type="text"
//                                 value={app.name}
//                                 onChange={(e) => {
//                                   const newApps = [...apps];
//                                   newApps[index].name = e.target.value;
//                                   setApps(newApps);
//                                 }}
//                                 className="w-full p-1 border rounded-md outline-none border-E4E4E4"
//                               />
//                             </td>
//                             <td className="px-6 py-4 text-sm font-semibold text-black whitespace-nowrap" {...provided.dragHandleProps}>
//                               <input
//                                 type="text"
//                                 value={app.url}
//                                 onChange={(e) => {
//                                   const newApps = [...apps];
//                                   newApps[index].url = e.target.value;
//                                   setApps(newApps);
//                                 }}
//                                 className="w-full p-1 border rounded-md outline-none border-E4E4E4"
//                               />
//                             </td>
//                             <td className="px-6 py-4 text-sm font-semibold text-black whitespace-nowrap" {...provided.dragHandleProps}>
//                               <div className="flex items-center justify-center">
//                                 <button
//                                   className="px-2"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleMoveUp(index);
//                                   }}
//                                   disabled={index === 0}
//                                   style={{ opacity: index === 0 ? 0.6 : 1 }}
//                                 >
//                                   <img src="assets/orderingup.svg" alt="Up" />
//                                 </button>
//                                 <button
//                                   className="px-2"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleMoveDown(index);
//                                   }}
//                                   disabled={index === apps.length - 1}
//                                   style={{ opacity: index === apps.length - 1 ? 0.6 : 1 }}
//                                 >
//                                   <img src="assets/orderingdown.svg" alt="Down" />
//                                 </button>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 text-sm font-semibold text-black whitespace-nowrap">
//                               <div className="flex items-center justify-center">
//                                 <button
//                                   className="text-red-500"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     setCurrentDeleteId(app.id);
//                                     setIsDeleteModalVisible(true);
//                                   }}
//                                 >
//                                   <img src="assets/redDeleteIcon.svg" alt="Delete" />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </tbody>
//                 </table>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </section>

//         {isAddModalVisible && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
//             <div className="relative p-8 bg-white rounded-lg shadow-lg w-96">
//               <h2 className="mb-4 text-2xl font-bold">Add New App</h2>
//               <input
//                 type="text"
//                 placeholder="App Name"
//                 value={newAppName}
//                 onChange={(e) => setNewAppName(e.target.value)}
//                 className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
//               />
//               <input
//                 type="text"
//                 placeholder="URL"
//                 value={newAppUrl}
//                 onChange={(e) => setNewAppUrl(e.target.value)}
//                 className="w-full p-2 mb-4 border rounded-md outline-none border-E4E4E4"
//               />
//               <div className="flex justify-end space-x-4">
//                 <button className="px-6 py-1 font-bold text-white bg-blue-500 rounded-full" onClick={PautanHandleAddApp}>
//                   Add
//                 </button>
//                 <button className="px-4 py-1 text-white font-bold bg-[#FF5436] rounded-full" onClick={() => setIsAddModalVisible(false)}>
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {isDeleteModalVisible && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
//             <div className="relative p-8 bg-white rounded-lg shadow-lg w-96">
//               <h2 className="mb-4 text-xl font-bold text-center">Delete the link?</h2>
//               <div className="flex justify-center space-x-4">
//                 <button className="px-8 py-1 text-white font-bold bg-[#4880FF] rounded-full" onClick={PautanHandleDeleteApp}>
//                   Yes
//                 </button>
//                 <button className="px-8 py-1 text-base font-bold text-[#979797] bg-white rounded-full border border-[#BDBDBD]" onClick={() => setIsDeleteModalVisible(false)}>
//                   No
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <section className="flex justify-end mt-5 max-w-[900px]">
//           <button className="px-4 py-1 font-bold text-white bg-[#FF5436] rounded-full shadow-custom" onClick={handleSave}>
//             Save
//           </button>
//         </section>
//       </>
//     );
//   };

import AddTitles from "./AddTitles";
import AddUnits from "./AddUnits";
import {
    CoreFeatures,
    CoverPhotos,
    MailSettings,
    Media,
    SizeLimit,
} from "./AdvanceSettings";
import { AuditCalendar, AuditSearch, AuditTrailTable } from "./AuditTrail";
import LogoUploader from "./BasicSettings";
import Departments from "./Departments";
import Permissions from "./Permissions";
import Feedback from "./Polls/Feedback";
import { Polls } from "./Polls/Polls";
import Requests from "./Requests";
import Roles from "./Roles";
import ThemeComponent from "./Themes";

const SettingsPage = ({ currentPage }) => {
    const handleSave = (selectedImage) => {
        console.log("Selected image:", selectedImage);
    };

    return (
        <div>
            <h1 className="hidden">{currentPage}</h1>
            {currentPage === "Basic Settings" && (
                <LogoUploader onSave={handleSave} />
            )}
            {currentPage === "Themes" && <ThemeComponent onSave={handleSave} />}
            {currentPage === "Advance Settings" && (
                <>
                    <CoreFeatures onSave={handleSave} />
                    <SizeLimit onSave={handleSave} />
                    <Media onSave={handleSave} />
                    <CoverPhotos onSave={handleSave} />
                    <MailSettings onSave={handleSave} />
                </>
            )}
            {/* {currentPage === 'Departments' && <Departments onSave={handleSave} />}
      {currentPage === 'Media' && <div></div>} */}
            {currentPage === "Requests" && <Requests />}
            {currentPage === "Audit Trail" && (
                <>
                    <AuditSearch onSave={handleSave} />
                    <AuditTrailTable onSave={handleSave} />
                </>
            )}
            {currentPage === "Feedback" && <Polls />}
            {/* {currentPage === "Birthday Template" && <div></div>} */}
            {currentPage === "Business Titles" && <AddTitles />}
            {currentPage === "Business Units" && <AddUnits />}
            {currentPage === "Roles" && <Roles />}
            {currentPage === "Permissions" && <Permissions />}
        </div>
    );
};

export {
    AuditCalendar,
    AuditSearch,
    AuditTrailTable,
    CoreFeatures,
    CoverPhotos,
    Departments,
    LogoUploader,
    MailSettings,
    Media,
    Permissions,
    Requests,
    Roles,
    SettingsPage,
    SizeLimit,
    ThemeComponent,
};
