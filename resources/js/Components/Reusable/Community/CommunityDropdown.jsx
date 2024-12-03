import React, { useState } from "react";

import { usePermissions } from "@/Utils/hooks/usePermissions";

function MenuItem({ src, alt, text, isActive, onClick }) {
    return (
        <div
            className={`flex items-center gap-3 p-2 m-0.5 rounded-xl cursor-pointer ${
                isActive ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
            onClick={() => onClick(text, src)}
        >
            <img
                loading="lazy"
                src={src}
                alt={alt}
                className={`shrink-0 aspect-square w-[21px] ${
                    isActive ? "opacity-100" : "opacity-100"
                }`} // Change opacity based on active/inactive state
            />
            <span
                className={`my-auto ${
                    isActive ? "text-neutral-800 font-bold" : "text-neutral-800"
                }`} // Change text color and style based on active/inactive state
            >
                {text}
            </span>
        </div>
    );
}

function IconMenu({ menuItems, onSelectFilter, closeDropdown }) {
    return (
        <aside className="absolute flex flex-col p-2 bg-white rounded-xl shadow-lg w-[160px] text-neutral-800 mt-[180px] z-10 ">
            {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                    <MenuItem
                        src={item.src}
                        alt={item.alt}
                        text={item.text}
                        isActive={item.isActive} // Pass active state to MenuItem
                        onClick={(text, src) => {
                            onSelectFilter(text, src);
                            closeDropdown(); // Close the dropdown after selecting an option
                        }}
                    />
                </React.Fragment>
            ))}
        </aside>
    );
}

function Filter({ onSelectFilter }) {
    const { hasRole } = usePermissions();
    const isSuperAdmin = hasRole("superadmin");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState({
        text: "All",
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/206f67ee2b58618f2c710e12ff29852a94c07b8a9ab92c6681c10b5d14e697fc?apiKey=285d536833cc4168a8fbec258311d77b&", // Default icon
    });
    const [menuItems, setMenuItems] = useState(() => {
        const baseMenu = [
            {
                src: "https://cdn.builder.io/api/v1/image/assets/TEMP/206f67ee2b58618f2c710e12ff29852a94c07b8a9ab92c6681c10b5d14e697fc?apiKey=285d536833cc4168a8fbec258311d77b&",
                alt: "All Posts Icon",
                text: "All",
                isActive: true, // Default active state for 'All'
            },
            {
                src: "/assets/public.svg",
                alt: "Public Icon",
                text: "Public",
                isActive: false,
            },
            {
                src: "/assets/lock.svg",
                alt: "Lock Icon",
                text: "Private",
                isActive: false,
            },
        ];
        if (isSuperAdmin) {
            baseMenu.push({
                src: "/assets/ArchiveIcon.svg",
                alt: "Lock Icon",
                text: "Archive",
                isActive: false,
            });
        }
        return baseMenu;
    });
    console.log("menuItems: ", menuItems);
    console.log("set menu items: ", setMenuItems);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const handleSelectFilter = (text, src) => {
        setSelectedFilter({ text, icon: src }); // Update the filter text and icon
        onSelectFilter(text); // Call the parent function

        // Update active state for the icons
        const updatedMenuItems = menuItems.map((item) =>
            item.text === text
                ? { ...item, isActive: true }
                : { ...item, isActive: false }
        );
        setMenuItems(updatedMenuItems);

        closeDropdown(); // Close the dropdown
    };

    return (
        <div className="flex flex-col justify-center text-sm max-w-[132px] text-neutral-800 relative mr-96 -mb-2 -mt-6">
            <div
                className="flex gap-5 justify-between px-4 py-3 bg-white rounded-2xl shadow-lg mb-4 h-auto w-[160px] cursor-pointer"
                onClick={toggleDropdown}
            >
                <div className="flex items-center gap-3">
                    <img
                        loading="lazy"
                        src={selectedFilter.icon}
                        alt="Selected Filter Icon"
                        className="shrink-0 aspect-square w-[21px]"
                    />
                    <span>{selectedFilter.text}</span>
                </div>
                <img
                    loading="lazy"
                    src="assets/Dropdownarrow.svg"
                    alt="Decorative icon"
                    className={`shrink-0 my-auto aspect-[1.89] stroke-[2px] w-[15px] ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                />
            </div>
            {isOpen && (
                <IconMenu
                    menuItems={menuItems} // Pass the menuItems with active states
                    onSelectFilter={handleSelectFilter}
                    closeDropdown={closeDropdown}
                />
            )}
        </div>
    );
}

export default Filter;
