import { useState } from "react";
import { format, startOfMonth } from "date-fns";

import { AuditTrailCalendar } from "./Calendar";

function SearchButton({ children }) {
    return (
        <button className="justify-center py-5 font-bold text-white bg-blue-500 px-11 rounded-3xl max-md:px-5">
            {children}
        </button>
    );
}

function Dropdown({ options, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0].label); // Use label for display

    const handleClickSelect = (option) => {
        setSelectedOption(option.label); // Display label
        setIsOpen(false);
        onChange(option.value); // Pass the value to the parent component
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative flex flex-col justify-center text-xs whitespace-nowrap text-neutral-800 w-[130px]">
            <div
                onClick={toggleDropdown}
                className="flex gap-5 justify-between px-3.5 py-2.5 bg-white rounded-2xl shadow-custom cursor-pointer"
            >
                <div>{selectedOption}</div>
                <img
                    loading="lazy"
                    src="/assets/Dropdownarrow.svg"
                    className={`shrink-0 self-center transition-transform ${
                        isOpen ? "rotate-180" : ""
                    } w-auto`}
                    alt="dropdown arrow"
                />
            </div>

            {isOpen && (
                <ul className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-custom z-10">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className={`px-3.5 py-2.5 hover:bg-gray-100 cursor-pointer ${
                                selectedOption === option.label
                                    ? "bg-gray-100"
                                    : ""
                            }`}
                            onClick={() => handleClickSelect(option)}
                        >
                            {option.label} {/* Display label */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dropdown;

const options = [
    { value: "All", label: "All" },
    { value: "superadmin", label: "SuperAdmin" },
    { value: "department admin", label: "Department Admin" },
    { value: "community admin", label: "Community Admin" },
    { value: "user", label: "User" },
];

export function AuditTrailSearch({
    search,
    onSearch = () => {},

    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setRole = () => {},
}) {
    return (
        <main className="flex flex-col w-full px-8 py-6 bg-white rounded-2xl shadow-custom max-md:px-5">
            <form className="flex gap-5 text-sm whitespace-nowrap max-md:flex-wrap max-md:max-w-full">
                <label htmlFor="searchInput" className="sr-only">
                    Search
                </label>
                <input
                    id="searchInput"
                    type="search"
                    placeholder="Search"
                    className="items-start self-start justify-center p-5 text-opacity-50 border border-solid grow rounded-3xl border-neutral-200 text-neutral-800 w-fit max-md:pr-5 max-md:max-w-full"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <SearchButton>Search</SearchButton>
            </form>
            <section className="flex self-start justify-between gap-5 mt-6">
                <AuditTrailCalendar
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
                <Dropdown options={options} onChange={setRole} />
            </section>
        </main>
    );
}
