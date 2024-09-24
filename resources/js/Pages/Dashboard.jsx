import React, { useState } from "react";

import { StoryNew } from "@/Components/Dashboard";
import AdvertisementDashboard from "@/Components/Reusable/AdvertisementDashboard";
import CommunitySide from "@/Components/Reusable/CommunitySide";
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
        <WallContext.Provider
            value={{
                loggedInUserId: id,
                variant: "dashboard",
            }}
        >
            <Example>
                <div className="flex-row w-full">
                    <main className="z-0 min-h-screen bg-gray-100 flex-row flex justify-center gap-20 md:gap-12">
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
                        <div className="w-full flex flex-col justify-center min-w-[440px] max-w-[700px] py-10 max-md:px-10">
                            <StoryNew userId={id} />
                            <ShareYourThoughts
                                userId={id}
                                onCreatePoll={handleCreatePoll}
                            />
                            <Filter
                                className="mr-10"
                                onFilterChange={handleFilterChange}
                            />
                            <div className="mb-4"></div>
                            <OutputData
                                loggedInUserId={id}
                                polls={polls}
                                postType={filterType}
                            />
                        </div>

                        {/* right widgets */}
                        <div className="flex-col pr-10 pt-10 pb-20 w-full max-w-[330px] max-h-[100vh] overflow-y-auto sticky top-0 hidden lg:block no-scrollbar">
                            <CommunitySide />
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
