import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

import { WallContext } from "@/Components/Reusable/WallPosting/WallContext";
import Example from "@/Layouts/DashboardLayoutNew";
import useUserData from "@/Utils/hooks/useUserData";

import DepartmentWall from "../Components/DepartmentWall";
import EditDepartments from "../Components/Reusable/Departments/EditDepartments";
import FeaturedEvents from "../Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "../Components/Reusable/PageTitle";
import WhosOnline from "../Components/Reusable/WhosOnlineWidget/WhosOnline";
import { DepartmentContext } from "./DepartmentContext";

import "./css/StaffDirectory.css";

const DepartmentInner = () => {
    const { id } = usePage().props;
    const [departmentData, setDepartmentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

    const userData = useUserData(id);

    const getDepartmentIdFromQuery = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("departmentId");
    };

    const fetchDepartmentData = async (departmentId) => {
        try {
            const response = await fetch(
                `/api/department/departments/${departmentId}`
            );
            const result = await response.json();
            if (result.data) {
                setDepartmentData(result.data);
            }
        } catch (error) {
            console.error("Error fetching department data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = () => {
        setIsEditPopupOpen(true);
    };

    const handleSave = (updatedData) => {
        setDepartmentData(updatedData);
        setIsEditPopupOpen(false);
        fetchDepartmentData(getDepartmentIdFromQuery()); // Reload the department data
    };

    useEffect(() => {
        const departmentId = getDepartmentIdFromQuery();
        if (departmentId) {
            fetchDepartmentData(departmentId);
        }
    }, []);

    // if (isLoading) {
    //   return <div>Loading...</div>;
    // }

    console.log("DEPARTMENT DATA", departmentData);

    return (
        <DepartmentContext.Provider
            value={{
                isMember: departmentData?.is_member,
                departmentID: departmentData?.id,
                isAdmin: ["admin", "superadmin"].includes(departmentData?.role),
                role: departmentData?.role,
            }}
        >
            <Example>
                <main className="relative lg:w-full ml-4 mr-4 xl:pl-96 xl:pr-24 sm:pr-44 2xl:pl-80 lg:ml-10 lg:mr-24 bottom-10">
                    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 max-w-full lg:max-w-[900px] mx-auto ">
                        <DepartmentWall
                            departmentID={getDepartmentIdFromQuery()}
                            departmentHeader={departmentData?.name}
                            departmentDescription={departmentData?.description}
                            departmentBanner={
                                departmentData?.banner
                                    ? departmentData.banner
                                    : "assets/departmentsDefault.jpg"
                            }
                            userId={id}
                            onEditClick={handleEditClick}
                        />
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
                        <PageTitle title="Department" />
                    </div>
                    <hr className="file-directory-underline" />
                    <div>
                        <FeaturedEvents />
                        {/* <WhosOnline /> */}
                    </div>
                </aside>

                {isEditPopupOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <EditDepartments
                            department={departmentData}
                            onCancel={() => setIsEditPopupOpen(false)}
                            onSave={handleSave}
                        />
                    </div>
                )}
            </Example>
        </DepartmentContext.Provider>
    );
};

export default DepartmentInner;
