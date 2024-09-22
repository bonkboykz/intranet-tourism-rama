import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useCsrf } from "@/composables";
import { toastError } from "@/Utils/toast";

import defaultImage from "../../../../public/assets/dummyStaffPlaceHolder.jpg";

import "react-phone-input-2/lib/style.css";
import "./AddMemberPopup.css";

const ConfirmationPopup = ({ selectedPerson, onConfirm, onCancel }) => {
    const departmentTitle =
        selectedPerson.employment_post?.department?.name ||
        "unknown department";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-3xl pt-7 px-6 w-[500px] shadow-lg max-md:mx-4">
                <h1 className="flex justify-start mb-2 text-2xl max-md:text-lg font-bold text-neutral-800">
                    Confirm Action
                </h1>
                <p className="max-md:text-sm">
                    This user currently exists in <b>{departmentTitle}</b>.
                </p>
                <p className="max-md:text-sm">
                    Do you want to remove this user from{" "}
                    <b>{departmentTitle}</b>?
                </p>
                <div className="flex flex-col mt-4">
                    <button
                        className="w-full px-4 py-2 mb-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                        onClick={() => onConfirm("remove")}
                    >
                        Yes, Remove
                    </button>
                    <button
                        className="w-full px-4 py-2 mb-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700"
                        onClick={() => onConfirm("keep")}
                    >
                        No, Keep & Add
                    </button>
                    <button
                        className="w-full px-4 py-2 mb-4 font-bold text-gray-400 border-2 border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddMemberPopup = ({
    isAddMemberPopupOpen,
    setIsAddMemberPopupOpen,
    departmentId,
    onNewMemberAdded,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [currentMembers, setCurrentMembers] = useState([]);
    const [titles, setTitles] = useState([]);
    const [units, setUnits] = useState([]);
    const [title, setTitle] = useState("");
    const [unit, setUnit] = useState("");
    const [titleId, setTitleId] = useState("");
    const [unitId, setUnitId] = useState("");
    const [location, setLocation] = useState("");
    const [workPhoneNumber, setWorkPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [gradeError, setGradeError] = useState(false);
    const [unitError, setUnitError] = useState(false);
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedGradeId, setSelectedGradeId] = useState("");
    const csrfToken = useCsrf();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMaxDepartmentPopup, setShowMaxDepartmentPopup] = useState(false);

    useEffect(() => {
        fetchCurrentMembers();
    }, [departmentId]);

    let debounceTimeout;

    // TODO: use a custom hook for debouncing
    useEffect(() => {
        clearTimeout(debounceTimeout);

        if (searchTerm.trim() !== "") {
            setLoading(true);
            debounceTimeout = setTimeout(() => {
                fetchAllSearchResults(searchTerm);
            }, 1000);
        } else {
            setSearchResults([]);
            setLoading(false);
        }

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm]);

    useEffect(() => {
        fetchTitles("/api/department/business_posts?page=1");
        fetchUnits(
            `/api/department/business_units?department_id=${departmentId}&page=1`
        );
        fetchGrades("/api/department/business_grades?page=1");
    }, [departmentId]);

    useEffect(() => {
        if (isAddMemberPopupOpen) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    }, [isAddMemberPopupOpen]);

    const fetchCurrentMembers = async () => {
        try {
            const response = await fetch(
                `/api/department/employment_posts?department_id=${departmentId}`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const data = await response.json();
            const fetchedMembers = data.members || [];
            setCurrentMembers(fetchedMembers.map((member) => member.user_id));
        } catch (error) {
            console.error("Error fetching current members:", error);
        }
    };

    const fetchAllSearchResults = async (query) => {
        setError("");
        let allResults = [];

        try {
            const response = await fetch(
                `/api/users/users?search=${query}&disabledPagination=true&with[]=profile&with[]=employmentPosts.department&with[]=employmentPosts.businessPost&with[]=employmentPosts.businessUnit`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const responseText = await response.text();
            const data = responseText ? JSON.parse(responseText) : {};

            allResults = data.data;

            setSearchResults(allResults);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setError("Failed to fetch search results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchTitles = async (url) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json" },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const titleData = data.data.data.map((item) => ({
                id: item.id,
                title: item.title,
            }));

            setTitles((prevTitles) => {
                const allTitles = [...prevTitles, ...titleData];
                return allTitles.sort((a, b) => a.title.localeCompare(b.title));
            });

            if (data.data.next_page_url) {
                fetchTitles(data.data.next_page_url);
            }
        } catch (error) {
            console.error("Error fetching titles:", error);
        }
    };

    const fetchUnits = async (url) => {
        let allUnits = [];
        let hasMorePages = true;

        try {
            while (hasMorePages) {
                const response = await fetch(url, {
                    method: "GET",
                    headers: { Accept: "application/json" },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                const unitData = data.data.map((unit) => ({
                    id: unit.id,
                    name: unit.name,
                }));

                allUnits = [...allUnits, ...unitData];

                if (data.next_page_url) {
                    const urlObj = new URL(data.next_page_url);
                    const params = new URLSearchParams(urlObj.search);
                    params.set("department_id", departmentId);
                    url = `${urlObj.origin}${
                        urlObj.pathname
                    }?${params.toString()}`;
                } else {
                    hasMorePages = false;
                }
            }
            setUnits(allUnits.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    };

    const fetchGrades = async (url) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json" },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const gradeData = data.data.data.map((item) => ({
                id: item.id,
                grade: item.code,
            }));

            setGrades((prevGrades) => {
                const allGrades = [...prevGrades, ...gradeData];
                return allGrades.sort((a, b) => a.grade.localeCompare(b.grade));
            });

            if (data.data.next_page_url) {
                fetchGrades(data.data.next_page_url);
            }
        } catch (error) {
            console.error("Error fetching grades:", error);
        }
    };

    const handleSelectPerson = (person) => {
        if (currentMembers.includes(person.id)) {
            setError("This user is already in the department.");

            return;
        }
        console.log("person", person);

        // Check if the user has more than two employment posts
        console.log("person.employment_posts", person.employment_posts);
        console.log(
            "person.employment_posts.length",
            person.employment_posts.length
        );
        if (person.employment_posts && person.employment_posts.length >= 2) {
            console.log(
                "User has more than two employment posts:",
                person.employment_posts
            );
            setShowMaxDepartmentPopup(true);
            return;
        }

        // If the user has exactly one employment post, pre-fill form fields
        if (person.employment_posts && person.employment_posts.length === 1) {
            const employmentPost = person.employment_posts[0];
            console.log("employmentPost", employmentPost);
            setTitle(employmentPost.business_post?.title || "");
            setTitleId(employmentPost.business_post_id || "");
            setSelectedGrade(employmentPost.business_grade?.code || "");
            setSelectedGradeId(employmentPost.business_grade_id || "");
            setLocation(employmentPost.location || "");
            setWorkPhoneNumber(employmentPost.work_phone || "");
        } else {
            // Reset form fields if there are no employment posts or more than one post
            setTitle("");
            setTitleId("");
            setLocation("");
            setWorkPhoneNumber("");
            setSelectedGrade("");
            setSelectedGradeId("");
        }

        setSelectedPerson(person);
        setSearchTerm(person.name);
        setError("");
    };

    const handleCloseMaxDepartmentPopup = () => {
        setShowMaxDepartmentPopup(false);
    };

    const handleClose = () => {
        setIsAddMemberPopupOpen(false);
        setSelectedPerson(null);
        setSearchTerm("");
        setSearchResults([]);
        setTitle("");
        setUnit("");
        setLocation("");
        setWorkPhoneNumber("");
        setError("");
        setSuccess("");
        setTitleError(false);
        setGradeError(false);
        setSelectedGrade("");
        setSelectedGradeId("");
        setShowConfirmation(false);
    };

    const handleAdd = () => {
        let hasError = false;

        if (!title) {
            setTitleError(true);
            hasError = true;
        } else {
            setTitleError(false);
        }

        if (!selectedGrade) {
            setGradeError(true);
            hasError = true;
        } else {
            setGradeError(false);
        }

        if (!unit) {
            setUnitError(true);
            hasError = true;
        } else {
            setUnitError(false);
        }

        if (hasError) {
            return;
        }

        if (selectedPerson?.employment_post) {
            setShowConfirmation(true);
        } else {
            addMemberToDepartment();
        }
    };

    const addMemberToDepartment = async () => {
        setIsAddMemberPopupOpen(false);
        if (!title && !selectedPerson.employment_post && !selectedGrade) {
            setGradeError(true);
            setTitleError(true);
            return;
        }

        if (!title) {
            setTitleError(true);
            return;
        }
        setTitleError(false);

        if (!selectedPerson.employment_post && !selectedGrade) {
            setGradeError(true);
            return;
        }
        setGradeError(false);

        const url = "/api/department/employment_posts";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-Token": csrfToken,
            },
        };

        const userId = selectedPerson.id;
        const businessPostId = titleId;
        const order = "0";

        const body = {
            department_id: String(departmentId),
            business_post_id: String(businessPostId),
            business_grade_id: selectedPerson.employment_post
                ? String(selectedPerson.employment_post.business_grade_id)
                : String(selectedGradeId),
            business_scheme_id: "1",
            user_id: String(userId),
            order: order,
        };

        if (unitId !== "") {
            body.business_unit_id = String(unitId);
        }
        if (location !== "") {
            body.location = location;
        }
        if (workPhoneNumber !== "") {
            body.work_phone = workPhoneNumber;
        }

        try {
            const response = await fetch(url, {
                ...options,
                body: JSON.stringify(body),
            });
            const responseText = await response.text();
            if (!response.ok) {
                console.error(
                    "Error adding member to department:",
                    responseText
                );
                if (
                    responseText.includes(
                        "already has an employment post in this department"
                    )
                ) {
                    toastError(
                        "User already has an employment post in this department"
                    );
                }

                setError(`Failed to add ${selectedPerson.name}.`);
                return;
            }

            const data = responseText ? JSON.parse(responseText) : {};
            console.log("Successfully added member:", data);

            const newMember = {
                id: userId,
                name: selectedPerson.name,
                role: title,
                status: "Online",
                imageUrl:
                    selectedPerson.profile?.staff_image ||
                    "/assets/dummyStaffPlaceHolder.jpg",
                workNo: workPhoneNumber || "",
                phoneNo: selectedPerson.profile?.phone_no,
                isDeactivated: selectedPerson.is_active,
                order: order,
            };

            onNewMemberAdded(newMember);

            setSuccess("Member successfully added!");
        } catch (error) {
            console.error("Error adding member to department:", error);
            setError(`An error occurred while adding ${selectedPerson.name}.`);
        }

        setTimeout(() => {
            handleClose();
        }, 1000);
    };

    const handleConfirmation = async (action) => {
        if (action === "remove") {
            try {
                const url = `/api/department/employment_posts/${selectedPerson.employment_post.id}`;
                const options = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-CSRF-Token": csrfToken,
                    },
                };

                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(
                        `Failed to remove employment post: ${response.statusText}`
                    );
                }

                console.log(
                    "Successfully removed employment post:",
                    selectedPerson.employment_post.id
                );
            } catch (error) {
                console.error("Error removing employment post:", error);
                setError(
                    "Failed to remove existing employment post. Please try again."
                );
                return;
            }
        }

        if (action === "remove" || action === "keep") {
            addMemberToDepartment();
        } else {
            handleClose();
        }
    };

    const getImageSource = (imageUrl) => {
        console.log("imageURL", imageUrl);
        if (imageUrl === defaultImage) {
            return defaultImage;
        }
        if (imageUrl.startsWith("staff_image/")) {
            return `/storage/${imageUrl}`;
        } else {
            return imageUrl === "/assets/dummyStaffPlaceHolder.jpg"
                ? imageUrl
                : `/avatar/${imageUrl}`;
        }
    };

    const renderTitles = (employmentPosts) => {
        if (!employmentPosts || employmentPosts.length === 0) {
            return (
                <span className="font-light text-gray-600">
                    No title available
                </span>
            );
        }

        const uniqueTitles = [
            ...new Set(
                employmentPosts
                    .map((post) => post.business_post?.title)
                    .filter(Boolean)
            ),
        ];

        if (uniqueTitles.length === 0) {
            return (
                <span className="font-light text-gray-600">
                    No title available
                </span>
            );
        }

        return uniqueTitles.map((title, index) => (
            <div key={index} className="font-light text-gray-600">
                {title}
            </div>
        ));
    };

    return (
        <div>
            {isAddMemberPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black px-4 bg-opacity-50">
                    <div className="bg-white rounded-2xl pt-7 px-4 max-md:w-full max-md:mx-8 w-[400px]">
                        <h1 className="flex justify-start mx-2 mb-4 text-2xl font-bold text-neutral-800">
                            Add staff
                        </h1>
                        <input
                            type="text"
                            placeholder="Search name"
                            value={
                                selectedPerson
                                    ? selectedPerson.name
                                    : searchTerm
                            }
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={!!selectedPerson}
                            className="w-full px-4 py-2 mb-4 bg-gray-200 border border-gray-200 rounded-full"
                        />
                        <div className="overflow-y-auto max-h-[290px] pl-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                searchResults.map((person, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center p-2 cursor-pointer"
                                        onClick={() =>
                                            handleSelectPerson(person)
                                        }
                                    >
                                        <img
                                            src={getImageSource(
                                                person.profile?.staff_image ||
                                                    defaultImage
                                            )}
                                            alt={person.name}
                                            className="object-cover w-10 h-10 mr-4 rounded-full"
                                        />
                                        <div>
                                            <div className="text-lg font-bold">
                                                {person.name}
                                            </div>
                                            <div>
                                                {renderTitles(
                                                    person.employment_posts
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {error && (
                                <div className="mt-2 text-red-500">{error}</div>
                            )}
                        </div>
                        {selectedPerson && (
                            <div className="mx-0 my-2">
                                <div className="mb-2">
                                    <label className="block font-bold text-gray-700">
                                        Job Title
                                    </label>
                                    <Menu
                                        as="div"
                                        className="relative inline-block w-full text-left"
                                    >
                                        <MenuButton
                                            className={`inline-flex w-full justify-between items-center gap-x-1.5 rounded-full border px-3 py-2 ${
                                                titleError
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } text-gray-700 hover:bg-gray-50`}
                                        >
                                            {title || "Select Title"}
                                            <ChevronDownIcon
                                                aria-hidden="true"
                                                className="w-5 h-5 -mr-1 text-gray-400"
                                            />
                                        </MenuButton>
                                        <MenuItems className="absolute z-10 w-full mt-2 overflow-y-auto origin-top-right bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none custom-scrollbar">
                                            {titles.map((title) => (
                                                <MenuItem
                                                    key={title.id}
                                                    onClick={() => {
                                                        setTitle(title.title);
                                                        setTitleId(title.id);
                                                        setTitleError(false);
                                                    }}
                                                >
                                                    {({ active }) => (
                                                        <a
                                                            href="#"
                                                            className={`block px-4 py-2 text-sm ${
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700"
                                                            }`}
                                                        >
                                                            {title.title}
                                                        </a>
                                                    )}
                                                </MenuItem>
                                            ))}
                                        </MenuItems>
                                    </Menu>
                                    {titleError && (
                                        <div className="mt-2 text-red-500">
                                            You must select a title
                                        </div>
                                    )}
                                </div>
                                <div className="mb-2">
                                    <label className="block font-bold text-gray-700">
                                        Unit
                                    </label>
                                    <Menu
                                        as="div"
                                        className="relative inline-block w-full text-left"
                                    >
                                        <MenuButton
                                            className={`inline-flex w-full justify-between items-center gap-x-1.5 rounded-full border px-3 py-2 ${
                                                unitError
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } text-gray-700 hover:bg-gray-50`}
                                        >
                                            {unit || "Select Unit"}
                                            <ChevronDownIcon
                                                aria-hidden="true"
                                                className="w-5 h-5 -mr-1 text-gray-400"
                                            />
                                        </MenuButton>
                                        <MenuItems className="absolute z-10 w-full mt-2 overflow-y-auto origin-top-right bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none custom-scrollbar">
                                            <MenuItem
                                                key="no-unit"
                                                onClick={() => {
                                                    setUnit("No Unit");
                                                    setUnitId("");
                                                }}
                                            >
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={`block px-4 py-2 text-sm ${
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        No Unit
                                                    </a>
                                                )}
                                            </MenuItem>
                                            {units.map((unit) => (
                                                <MenuItem
                                                    key={unit.id}
                                                    onClick={() => {
                                                        setUnit(unit.name);
                                                        setUnitId(unit.id);
                                                        setUnitError(false);
                                                    }}
                                                >
                                                    {({ active }) => (
                                                        <a
                                                            href="#"
                                                            className={`block px-4 py-2 text-sm ${
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700"
                                                            }`}
                                                        >
                                                            {unit.name}
                                                        </a>
                                                    )}
                                                </MenuItem>
                                            ))}
                                        </MenuItems>
                                    </Menu>
                                    {unitError && (
                                        <div className="mt-2 text-red-500">
                                            You must select a unit
                                        </div>
                                    )}
                                </div>
                                {!selectedPerson.employment_post && (
                                    <div className="mb-4">
                                        <label className="block font-bold text-gray-700">
                                            Grade
                                        </label>
                                        <Menu
                                            as="div"
                                            className="relative inline-block w-full text-left"
                                        >
                                            <MenuButton
                                                className={`inline-flex w-full justify-between items-center gap-x-1.5 rounded-full border px-3 py-2 ${
                                                    gradeError
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } text-gray-700 hover:bg-gray-50`}
                                            >
                                                {selectedGrade ||
                                                    "Select Grade"}
                                                <ChevronDownIcon
                                                    aria-hidden="true"
                                                    className="w-5 h-5 -mr-1 text-gray-400"
                                                />
                                            </MenuButton>
                                            <MenuItems className="absolute z-10 w-full mt-2 overflow-y-auto origin-top-right bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none custom-scrollbar">
                                                {grades.map((grade) => (
                                                    <MenuItem
                                                        key={grade.id}
                                                        onClick={() => {
                                                            setSelectedGrade(
                                                                grade.grade
                                                            );
                                                            setSelectedGradeId(
                                                                grade.id
                                                            );
                                                            setGradeError(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                className={`block px-4 py-2 text-sm ${
                                                                    active
                                                                        ? "bg-gray-100 text-gray-900"
                                                                        : "text-gray-700"
                                                                }`}
                                                            >
                                                                {grade.grade}
                                                            </a>
                                                        )}
                                                    </MenuItem>
                                                ))}
                                            </MenuItems>
                                        </Menu>
                                        {gradeError && (
                                            <div className="mt-2 text-red-500">
                                                You must select a grade
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="mb-2">
                                    <label className="block font-bold text-gray-700">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-full"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block font-bold text-gray-700">
                                        Work Phone Number
                                    </label>
                                    <PhoneInput
                                        country={"my"}
                                        value={workPhoneNumber}
                                        onChange={setWorkPhoneNumber}
                                        inputClass="text-sm text-neutral-800 text-opacity-80 mt-1 block w-full h-12 rounded-full p-2 border-2 border-stone-300 max-md:ml-4"
                                        containerClass="phone-input-container"
                                        buttonClass="phone-input-button"
                                        dropdownClass="phone-input-dropdown"
                                        disableDropdown={false}
                                    />
                                </div>
                            </div>
                        )}
                        {success && (
                            <div className="mt-2 text-green-500">{success}</div>
                        )}
                        <div className="flex justify-end -mx-4 pt-3 h-[70px] border-t border-gray-200">
                            <button
                                className="px-4 mb-4 mr-2 font-bold rounded-full text-[#222222]"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="w-[100px] px-4 mb-4 mr-4 font-bold text-white bg-red-500 hover:bg-red-700 rounded-full"
                                onClick={handleAdd}
                                disabled={!selectedPerson}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showConfirmation && (
                <ConfirmationPopup
                    selectedPerson={selectedPerson}
                    onConfirm={handleConfirmation}
                    onCancel={handleClose}
                />
            )}
            {showMaxDepartmentPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-3xl pt-7 px-6 py-2 w-[500px] shadow-lg">
                        <h1 className="flex justify-start mb-2 text-2xl font-bold text-neutral-800">
                            Cannot Add User
                        </h1>
                        <p>A user can only be in maximum of two departments</p>
                        <div className="flex flex-col mt-4">
                            <button
                                className="w-full px-4 py-2 mb-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700"
                                onClick={handleCloseMaxDepartmentPopup}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMemberPopup;
