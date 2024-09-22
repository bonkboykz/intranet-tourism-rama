import React, { useState } from "react";

import { StoryNew } from "@/Components/Dashboard";
import AdvertisementDashboard from "@/Components/Reusable/AdvertisementDashboard";
import MyComponent from "@/Components/Reusable/CommunitySide";
import InfoGraphic from "@/Components/Reusable/InfoGraphic";
import {
    Filter,
    OutputData,
    ShareYourThoughts,
} from "@/Components/Reusable/WallPosting";
import { WallContext } from "@/Components/Reusable/WallPosting/WallContext";
import Example from "@/Layouts/DashboardLayoutNew";
import useUserData from "@/Utils/hooks/useUserData";

import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";

const Dashboard = () => {
    const { isAdmin, id } = useUserData();
    const [polls, setPolls] = useState([]);
    const [filterType, setFilterType] = useState(null);

    const handleCreatePoll = (poll) => {
        setPolls((prevPolls) => [...prevPolls, poll]);
    };

    const handleFilterChange = (filter) => {
        setFilterType(filter);
    };

    return (
        // <WallContext.Provider
        //     value={{
        //         loggedInUserId: id,
        //         variant: "dashboard",
        //     }}
        // >
        //     <Example>
        //         <div className="flex-row">
        //             <div className="">
        //                 <main className="xl:pl-[calc(22%+4rem)] xl:pr-[calc(25%+2rem)] min-h-screen bg-gray-100">
        //                     <div className="flex flex-col items-start px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
        //                         <StoryNew userId={id} />
        //                         <ShareYourThoughts
        //                             userId={id}
        //                             onCreatePoll={handleCreatePoll}
        //                         />
        //                         <Filter
        //                             className="mr-10"
        //                             onFilterChange={handleFilterChange}
        //                         />
        //                         <div className="mb-4"></div>
        //                         <OutputData
        //                             loggedInUserId={id}
        //                             polls={polls}
        //                             postType={filterType}
        //                         />
        //                     </div>
        //                 </main>

        //                 <aside className="fixed bottom-0 hidden w-1/4 px-4 py-6 overflow-y-auto left-20 top-16 sm:px-6 lg:px-8 xl:block">
        //                     <style>
        //                         {`
        //                             aside::-webkit-scrollbar {
        //                             width: 0px !important;
        //                             background: transparent !important;
        //                             }
        //                             aside {
        //                             scrollbar-width: none !important; /* For Firefox */
        //                             -ms-overflow-style: none;  /* IE и Edge */
        //                             }
        //                         `}
        //                     </style>
        //                     <div className="file-directory-header">
        //                         <PageTitle title="My Wall" />
        //                     </div>
        //                     <hr className="file-directory-underline" />
        //                     <div>
        //                         <FeaturedEvents />
        //                         <WhosOnline />
        //                     </div>
        //                 </aside>

        //                 <aside className="fixed bottom-0 right-0 hidden w-1/4 px-4 py-6 overflow-y-auto border-l border-gray-200 top-16 sm:px-6 lg:px-4 xl:block">
        //                     <div>
        //                         <MyComponent />
        //                     </div>
        //                     <div>
        //                         <AdvertisementDashboard />
        //                     </div>
        //                     <div>
        //                         <InfoGraphic />
        //                     </div>
        //                 </aside>
        //             </div>
        //         </div>
        //     </Example>
        // </WallContext.Provider>
        <WallContext.Provider
            value={{
                loggedInUserId: id,
                variant: "dashboard",
            }}
        >
            <Example>
    <div className="flex-row w-full">
        <main className="min-h-screen bg-gray-100 flex-row flex justify-center gap-20 md:gap-12">
            {/* left widgets */}
            <div className="z-0 pl-10 pt-10 pb-20 overflow-y-auto h-auto w-full max-w-[330px] max-h-[100vh] sticky top-0 hidden lg:block no-scrollbar">
                <div className="file-directory-header">
                    <PageTitle title="My Wall" />
                </div>
                <hr className="file-directory-underline" />
                <div>
                    <FeaturedEvents />
                    <WhosOnline />
                </div>
            </div>

            {/* center content */}
            <div className="w-full flex flex-col justify-center min-w-[440px] max-w-[700px] pt-10 max-md:px-10">
                <StoryNew userId={id} />
                <ShareYourThoughts userId={id} onCreatePoll={handleCreatePoll} />
                <Filter className="mr-10" onFilterChange={handleFilterChange} />
                <div className="mb-4"></div>
                <OutputData loggedInUserId={id} polls={polls} postType={filterType} />
            </div>

            {/* right widgets */}
            <div className="flex-col pr-10 pt-10 pb-20 w-full max-w-[330px] max-h-[100vh] overflow-y-auto sticky top-0 hidden lg:block no-scrollbar">
                <MyComponent />
                <AdvertisementDashboard />
                <InfoGraphic />
            </div>
        </main>
    </div>
</Example>


        </WallContext.Provider>
    );
};

export default Dashboard;
