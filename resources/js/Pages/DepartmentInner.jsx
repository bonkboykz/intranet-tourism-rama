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

    // console.log("DEPARTMENT DATA", departmentData);

    // console.log("userData", userData);

    return (
        <DepartmentContext.Provider
            value={{
                user: userData,
                isMember: departmentData?.is_member,
                departmentID: departmentData?.id,
                isAdmin: ["admin", "superadmin"].includes(departmentData?.role),
                role: departmentData?.role,
            }}
        >
            <Example>
                <main className="z-0 bg-gray-100 min-h-screen w-full flex-row flex justify-center items-start gap-20 md:gap-12">
                    {/* left widgets */}
                    <div className="z-0 pl-10 pt-10 pb-20 overflow-y-auto h-auto w-full max-w-[330px] max-h-[100vh] sticky top-0 hidden md:hidden lg:block no-scrollbar">
                        <div className="file-directory-header">
                            <PageTitle title="Departments" />
                        </div>
                        <hr className="file-directory-underline" />
                        <div>
                            <FeaturedEvents />
                            <WhosOnline />
                        </div>
                    </div>

                    {/* main content */}
                    <div className="flex flex-col justify-start w-full max-w-[1200px] max-sm:max-w-[100vw] max-sm:px-4 max-md:px-6">
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
