import React, { useState } from "react";
import useUserData from "@/Utils/hooks/useUserData";
import PageTitle from "../Components/Reusable/PageTitle";
import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import Example from "@/Layouts/DashboardLayoutNew";
import { StoryNew } from "@/Components/Dashboard";
import {
    ShareYourThoughts,
    Filter,
    OutputData,
} from "@/Components/Reusable/WallPosting";
import MyComponent from "@/Components/Reusable/CommunitySide";
import AdvertisementDashboard from "@/Components/Reusable/AdvertisementDashboard";
import InfoGraphic from "@/Components/Reusable/InfoGraphic";

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
        <Example>
            <div className="flex-row">
                <div className="">
                    <main className="xl:pl-[calc(22%+4rem)] xl:pr-[calc(25%+2rem)] min-h-screen bg-gray-100">
                        <div className="flex flex-col items-start px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
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
                    </main>

                    <aside className="fixed bottom-0 hidden w-1/4 px-4 py-6 overflow-y-auto left-20 top-16 sm:px-6 lg:px-8 xl:block">
                        <style>
                            {`
                aside::-webkit-scrollbar {
                  width: 0px !important;
                  background: transparent !important;
                }
                aside {
                  scrollbar-width: none !important; /* For Firefox */
                  -ms-overflow-style: none;  /* IE и Edge */
                }
              `}
                        </style>
                        <div className="file-directory-header">
                            <PageTitle title="My Wall" />
                        </div>
                        <hr className="file-directory-underline" />
                        <div>
                            <FeaturedEvents />
                            <WhosOnline />
                        </div>
                    </aside>

                    <aside className="fixed bottom-0 right-0 hidden w-5/10 px-4 py-6 overflow-y-auto border-l border-gray-200 top-16 sm:px-6 lg:px-4 xl:block">
                        <div>
                            <MyComponent />
                        </div>
                        <div>
                            <AdvertisementDashboard />
                        </div>
                        <div>
                            <InfoGraphic />
                        </div>
                    </aside>
                </div>
            </div>
        </Example>
    );
};

export default Dashboard;
