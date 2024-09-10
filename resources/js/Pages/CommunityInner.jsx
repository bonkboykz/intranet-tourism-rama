import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import PageTitle from "../Components/Reusable/PageTitle";
import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import CommunityWall from "../Components/Reusable/Community/CommunityWall";
import "./css/StaffDirectory.css";
import Example from "@/Layouts/DashboardLayoutNew";
import EditCommunity from "@/Components/Reusable/Community/EditCommunity";
import { set } from "date-fns";
import { CommunityContext } from "./CommunityContext";
import { Loader2 } from "lucide-react";

const CommunityInner = () => {
    const { id } = usePage().props;
    const [communityData, setCommunityData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [type, setType] = useState(null);

    const getCommunityIdFromQuery = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("communityId");
    };

    const fetchDepartmentData = async (communityId) => {
        try {
            const response = await fetch(
                `/api/communities/communities/${communityId}`
            );
            const result = await response.json();
            if (result.data) {
                setCommunityData(result.data);
                setType(result.data.type);
            }
        } catch (error) {
            console.error("Error fetching community data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = () => {
        setIsEditPopupOpen(true);
    };

    const handleSave = (updatedData) => {
        setCommunityData(updatedData);
        setIsEditPopupOpen(false);
        fetchDepartmentData(getCommunityIdFromQuery()); // Reload the department data
    };

    useEffect(() => {
        const communityId = getCommunityIdFromQuery();
        if (communityId) {
            fetchDepartmentData(communityId);
        }
    }, []);

    console.log("DEPARTMENT DATA", communityData);

    if (!communityData) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin" />
            </div>
        );
    }

    return (
        <CommunityContext.Provider
            value={{
                is_member: communityData?.is_member,
                role: communityData?.role,
                type: communityData?.type,
                communityID: communityData?.id,
                isJoinRequestPending: communityData?.is_join_request_pending,
            }}
        >
            <Example>
                <main className="relative ml-4 mr-4 lg:w-full xl:pl-96 xl:pr-24 sm:pr-44 2xl:pl-80 lg:ml-10 lg:mr-24 bottom-10">
                    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 max-w-full lg:max-w-[900px] mx-auto ">
                        {isLoading ? (
                            <div className="flex items-center justify-center min-h-screen">
                                <div className="flex items-center justify-center">
                                    <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                </div>
                                <p className="mt-4 ml-6 text-lg font-semibold text-gray-700">
                                    Loading community data...
                                </p>
                            </div>
                        ) : (
                            <CommunityWall
                                communityID={getCommunityIdFromQuery()}
                                departmentHeader={communityData?.name}
                                departmentDescription={
                                    communityData?.description
                                }
                                departmentBanner={
                                    communityData?.banner
                                        ? communityData.banner
                                        : "/assets/defaultCommunity.png"
                                }
                                userId={id}
                                type={type}
                                onEditClick={handleEditClick}
                            />
                        )}
                    </div>
                </main>

                <aside className="fixed bottom-0 left-0 hidden w-full px-4 py-6 overflow-y-auto border-r border-gray-200 lg:left-20 top-16 lg:w-96 sm:px-6 lg:px-8 xl:block">
                    <style>
                        {`
          aside::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          `}
                    </style>
                    <div className="file-directory-header">
                        <PageTitle title="Community" />
                    </div>
                    <hr className="file-directory-underline" />
                    <div>
                        <FeaturedEvents />
                        {/* <WhosOnline /> */}
                    </div>
                </aside>

                {isEditPopupOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <EditCommunity
                            department={communityData}
                            onCancel={() => setIsEditPopupOpen(false)}
                            onSave={handleSave}
                        />
                    </div>
                )}
            </Example>
        </CommunityContext.Provider>
    );
};

export default CommunityInner;
