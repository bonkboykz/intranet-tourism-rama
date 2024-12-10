import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";

import { formatWorkNumber } from "@/Utils/format";
import { usePermissions } from "@/Utils/hooks/usePermissions";

import "../../../css/app.css";
import "react-phone-input-2/lib/style.css";

function ProfileDepartment({
    department,
    departmentId,
    unit,
    jobtitle,
    position,
    grade,
    report_to,
    is_hod,
    is_assistance,
    location,
    phone,
    isEditing,
    onFormDataChange,
    originalFormData,
}) {
    const [localFormData, setLocalFormData] = useState({
        department,
        unit,
        jobtitle,
        position,
        grade,
        report_to,
        is_hod,
        is_assistance,
        location,
        phone,
        countryCode: "",
    });

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [jobTitleOptions, setJobTitleOptions] = useState([]);
    const [isHod, setIsHod] = useState(false);
    const [isAssistance, setIsAssistance] = useState(false);
    const [positionOptions, setPositionOptions] = useState([
        "Tetap",
        "Kontrak",
        "MySTEP",
        "Interim",
    ]);
    const [gradeOptions, setGradeOptions] = useState([]);
    const [supervisorsOptions, setSupervisorsOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [phoneOptions, setPhoneOptions] = useState([]);

    const inputRef = useRef(null);

    const csrfToken = ""; // Add your CSRF token here if needed

    useEffect(() => {
        setIsHod(localFormData.is_hod);
        setIsAssistance(localFormData.is_assistance);
        fetchData(
            "/api/department/departments",
            setDepartmentOptions,
            "Departments"
        );
        fetchBusinessUnits();
        fetchData(
            "/api/department/business_posts",
            setJobTitleOptions,
            "Job Title"
        );
        fetchData("/api/department/business_grades", setGradeOptions, "Grades");
        fetchData(
            `/api/users/by-department/${departmentId}`,
            setSupervisorsOptions,
            "Supervisors"
        );
        // TODO: get the list of location options
        // fetchData(
        //     "/api/department/employment_posts",
        //     setLocationOptions,
        //     "Location"
        // );
        // TODO: get the list of phone options
        // fetchData(
        //     "/api/department/employment_posts",
        //     setPhoneOptions,
        //     "Phones"
        // );
    }, []);

    const fetchData = async (API_URL, setOptions, label) => {
        let allItems = [];
        let currentPage = 1;
        let lastPage = 1;

        try {
            // TODO: refactor this, too many requests
            while (currentPage <= lastPage) {
                const response = await fetch(
                    `${API_URL}?page=${currentPage}&perpage=100`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "X-CSRF-Token": csrfToken,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${label}`);
                }
                const data = await response.json();
                allItems = allItems.concat(data.data.data);
                lastPage = data.data.last_page;
                currentPage++;
            }
            setOptions(allItems);
        } catch (error) {
            console.error(`Error fetching data for ${label}:`, error);
        }
    };

    console.log("DDDD", department);

    const fetchBusinessUnits = async () => {
        let allUnits = [];
        let currentPage = 1;
        let lastPage = 1;

        try {
            while (currentPage <= lastPage) {
                const response = await fetch(
                    `/api/department/business_units?department_id=${departmentId}&page=${currentPage}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "X-CSRF-Token": csrfToken,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok for Units");
                }
                const data = await response.json();
                allUnits = allUnits.concat(data.data);
                lastPage = data.last_page;
                currentPage++;
            }

            // Remove duplicates, keeping only one "No Unit"
            const filteredUnits = allUnits.filter(
                (unit, index, self) =>
                    index === self.findIndex((u) => u.name === unit.name)
            );

            setUnitOptions(filteredUnits);
        } catch (error) {
            console.error("Error fetching data for Units:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;

        setLocalFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (onFormDataChange) {
            const updatedData = { [name]: value };

            if (name === "department") {
                updatedData.department_id = value;
            } else if (name === "unit") {
                updatedData.business_unit_id = value;
            } else if (name === "jobtitle") {
                updatedData.business_post_id = value;
            } else if (name === "grade") {
                updatedData.business_grade_id = value;
            } else if (name === "is_hod") {
                updatedData.is_hod = checked;
                setIsHod(checked);
            } else if (name === "is_assistance") {
                updatedData.is_assistance = checked;
                setIsAssistance(checked);
            } else if (name === "report_to") {
                updatedData.report_to = value;
            } else if (name === "location") {
                updatedData.location = value;
            } else if (name === "phone") {
                updatedData.work_phone = value;
            } else if (name === "position") {
                updatedData.position = value;
            }

            onFormDataChange(updatedData);
        }
    };

    const userDepartment = departmentOptions.find(
        (option) => option.id === departmentId
    );

    const formatPhoneNumber = (number) => {
        // Remove non-digit characters
        const cleaned = ("" + number).replace(/\D/g, "");
        // Split the number into parts for formatting
        const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return number;
    };

    const handlePhoneChange = (value, country, e, formattedValue) => {
        const formattedPhone = formatPhoneNumber(formattedValue);

        setLocalFormData((prevData) => ({
            ...prevData,
            phone: formattedPhone,
        }));

        if (onFormDataChange) {
            const updatedData = { phone: formattedPhone };
            updatedData.work_phone = formattedPhone;
            onFormDataChange(updatedData);
        }
    };

    const renderField = (
        label,
        name,
        value,
        options,
        editable = true,
        onChangeHandler = handleInputChange
    ) => (
        <tr key={name}>
            <td className="w-1/3 py-2 font-semibold capitalize align-center text-neutral-800 ">
                {label}
            </td>
            <td className="w-2/3 py-2 align-center">
                {isEditing && editable ? (
                    <select
                        name={name}
                        value={localFormData[name] || ""}
                        onChange={onChangeHandler}
                        className="block w-full p-2 mt-1 overflow-y-auto text-sm border-2 rounded-full sm:w-full md:w-full lg:w-full text-neutral-800 text-opacity-80 border-stone-300 max-md:ml-4"
                        ref={inputRef}
                        style={{ maxHeight: "150px" }}
                    >
                        <option value="">
                            {localFormData[`${name}_display`] || value}
                        </option>
                        {options &&
                            options.map((option, index) => (
                                <option key={index} value={option.id || option}>
                                    {typeof option === "object"
                                        ? option.name ||
                                          option.title ||
                                          option.code
                                        : option}
                                </option>
                            ))}
                    </select>
                ) : (
                    <div className="block w-full p-2 mt-1 text-sm border-2 border-transparent rounded-md text-neutral-800 text-opacity-80">
                        {localFormData[`${name}_display`] || value}
                    </div>
                )}
            </td>
        </tr>
    );

    const { hasRole } = usePermissions();

    const isSuperAdmin = hasRole("superadmin");

    return (
        <div className="flex-auto p-4 my-auto">
            <div className="flex gap-5 sm:flex-col md:flex-col lg:flex-col sm:gap-4 lg:gap-6">
                <div className="flex flex-col w-full md:ml-0 md:w-full">
                    <table className="w-full text-left border-collapse table-auto">
                        <tbody>
                            {userDepartment ? (
                                <tr>
                                    <td className="w-1/3 py-2 font-semibold capitalize align-center text-neutral-800">
                                        Department
                                    </td>
                                    <td className="w-2/3 px-2 py-2 align-center text-sm">
                                        <a
                                            href={`/departmentInner?departmentId=${userDepartment.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {userDepartment.name}
                                        </a>
                                    </td>
                                </tr>
                            ) : null}
                            {renderField(
                                "Unit",
                                "unit",
                                localFormData.unit || "No Unit", // Show "No Unit" if localFormData.unit is empty
                                unitOptions.length > 0
                                    ? unitOptions
                                    : [{ id: "", name: "No Unit" }], // Use "No Unit" if unitOptions is empty
                                true,
                                handleInputChange
                            )}

                            {renderField(
                                "Job Title",
                                "jobtitle",
                                localFormData.jobtitle,
                                jobTitleOptions,
                                isSuperAdmin,
                                handleInputChange
                            )}
                            {renderField(
                                "Position",
                                "position",
                                localFormData.position,
                                positionOptions,
                                isSuperAdmin,
                                handleInputChange
                            )}
                            {renderField(
                                "Grade",
                                "grade",
                                localFormData.grade,
                                gradeOptions,
                                isSuperAdmin,
                                handleInputChange
                            )}
                            {renderField(
                                "Report To",
                                "report_to",
                                localFormData.report_to,
                                supervisorsOptions,
                                true,
                                handleInputChange
                            )}
                            <tr>
                                <td className="w-1/3 py-2 font-semibold capitalize align-center text-neutral-800">
                                    Is HOD
                                </td>
                                <td className="w-2/3 py-2 align-center">
                                    {isEditing ? (
                                        <input
                                            type="checkbox"
                                            name="is_hod"
                                            value={localFormData.is_hod}
                                            checked={isHod}
                                            onChange={handleInputChange}
                                            className="block p-2 mt-1 text-sm border-2 text-neutral-800 text-opacity-80 border-stone-300"
                                        />
                                    ) : (
                                        <div className="block w-full p-2 mt-1 text-sm border-2 border-transparent rounded-md text-neutral-800 text-opacity-80">
                                            {localFormData.is_hod
                                                ? "Yes"
                                                : "No"}
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="w-1/3 py-2 font-semibold capitalize align-center text-neutral-800">
                                    Is Secretary
                                </td>
                                <td className="w-2/3 py-2 align-center">
                                    {isEditing ? (
                                        <input
                                            type="checkbox"
                                            name="is_assistance"
                                            value={localFormData.is_assistance}
                                            checked={isAssistance}
                                            onChange={handleInputChange}
                                            className="block p-2 mt-1 text-sm border-2 text-neutral-800 text-opacity-80 border-stone-300"
                                        />
                                    ) : (
                                        <div className="block w-full p-2 mt-1 text-sm border-2 border-transparent rounded-md text-neutral-800 text-opacity-80">
                                            {localFormData.is_assistance
                                                ? "Yes"
                                                : "No"}
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="w-1/3 py-2 font-semibold capitalize align-center text-neutral-800">
                                    Location
                                </td>
                                <td className="w-2/3 py-2 align-center">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={localFormData.location || ""}
                                            onChange={handleInputChange}
                                            className="block w-full p-2 mt-1 text-sm border-2 rounded-full sm:w-full md:w-full lg:w-full text-neutral-800 text-opacity-80 border-stone-300 max-md:ml-4"
                                        />
                                    ) : (
                                        <div className="block w-full p-2 mt-1 text-sm border-2 border-transparent rounded-md text-neutral-800 text-opacity-80">
                                            {localFormData.location}
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="w-1/3 py-2 font-semibold capitalize align-center text-neutral-800">
                                    Office Number
                                </td>
                                <td className="w-2/3 py-2 px-2 ml-0 align-center text-neutral-800">
                                    {isEditing ? (
                                        <PhoneInput
                                            country={"my"}
                                            excludeCountries={["il"]}
                                            enableSearch={true}
                                            value={localFormData.phone}
                                            onChange={handlePhoneChange}
                                            containerClass="w-full sm:ml-[5px] md:ml-[4px] lg:ml-[1px] max-md:px-3" // Tailwind classes for margin adjustments
                                            inputStyle={{
                                                width: "100%",
                                                marginLeft: "0px",
                                            }}
                                        />
                                    ) : (
                                        <div className="font-normal text-sm text-neutral-800 text-opacity-80">
                                            {formatWorkNumber(
                                                localFormData.phone
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProfileDepartment;
