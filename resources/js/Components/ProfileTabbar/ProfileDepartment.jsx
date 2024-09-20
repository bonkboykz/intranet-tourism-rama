import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";

function ProfileDepartment({
    department,
    departmentId,
    unit,
    jobtitle,
    position,
    grade,
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
        location,
        phone,
        countryCode: "",
    });

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [jobTitleOptions, setJobTitleOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([
        "Tetap",
        "Kontrak",
        "MySTEP",
    ]);
    const [gradeOptions, setGradeOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [phoneOptions, setPhoneOptions] = useState([]);

    const inputRef = useRef(null);

    const csrfToken = ""; // Add your CSRF token here if needed

    useEffect(() => {
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
            "/api/department/employment_posts",
            setLocationOptions,
            "Location"
        );
        fetchData(
            "/api/department/employment_posts",
            setPhoneOptions,
            "Phones"
        );
    }, []);

    const fetchData = async (API_URL, setOptions, label) => {
        let allItems = [];
        let currentPage = 1;
        let lastPage = 1;

        try {
            // TODO: refactor this, too many requests
            while (currentPage <= lastPage) {
                const response = await fetch(
                    `${API_URL}?page=${currentPage}&perpage=20`,
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
                // const response = await fetch(`/api/department/business_units?page=${currentPage}`, {
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
            setUnitOptions(allUnits);
        } catch (error) {
            console.error("Error fetching data for Units:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

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
                        className="block w-full sm:w-full md:w-full lg:w-full p-2 mt-1 overflow-y-auto text-sm border-2 rounded-full text-neutral-800 text-opacity-80 border-stone-300 max-md:ml-4"
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

    return (
        <div className="flex-auto p-4 my-auto">
            <div className="flex gap-5 sm:flex-col md:flex-col lg:flex-col sm:gap-4 lg:gap-6">
                <div className="flex flex-col w-full md:ml-0 md:w-full">
                    <table className="w-full text-left border-collapse table-auto">
                        <tbody>
                            {renderField(
                                "Department",
                                "department",
                                localFormData.department,
                                departmentOptions,
                                false,
                                handleInputChange
                            )}
                            {renderField(
                                "Unit",
                                "unit",
                                localFormData.unit,
                                unitOptions,
                                true,
                                handleInputChange
                            )}
                            {renderField(
                                "Job Title",
                                "jobtitle",
                                localFormData.jobtitle,
                                jobTitleOptions,
                                true,
                                handleInputChange
                            )}
                            {renderField(
                                "Position",
                                "position",
                                localFormData.position,
                                positionOptions,
                                true,
                                handleInputChange
                            )}
                            {renderField(
                                "Grade",
                                "grade",
                                localFormData.grade,
                                gradeOptions,
                                true,
                                handleInputChange
                            )}
                            <tr>
                                <td className="w-1/3  py-2 font-semibold capitalize align-center text-neutral-800">
                                    Location
                                </td>
                                <td className="w-2/3 py-2 align-center">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={localFormData.location || ""}
                                            onChange={handleInputChange}
                                            className="block w-full sm:w-full md:w-full lg:w-full p-2 mt-1 text-sm border-2 rounded-full text-neutral-800 text-opacity-80 border-stone-300 max-md:ml-4"
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
                                <td className="w-2/3 py-2 align-center ml-20 text-neutral-800">
                                    {isEditing ? (
                                        <PhoneInput
                                            country={"my"}
                                            value={localFormData.phone}
                                            onChange={handlePhoneChange}
                                            containerClass="w-full sm:ml-[5px] md:ml-[4px] lg:ml-[1px] max-md:px-3" // Tailwind classes for margin adjustments
                                            inputStyle={{
                                                width: "100%",
                                                marginLeft: "0px",
                                            }}
                                        />
                                    ) : (
                                        <div className="text-neutral-800 text-opacity-80 font-normal">
                                            +{localFormData.phone}
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
