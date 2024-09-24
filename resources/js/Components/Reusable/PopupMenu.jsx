import React from "react";

const PopupMenu = ({ onAssign, selectedDepartmentId }) => {
    return (
        <div className="absolute right-0 z-50 bg-white border shadow-lg w-[190px] rounded-xl -mt-3">
            {/* TODO: remove when implemented */}
            {/* <button onClick={onAssign} className="flex items-center w-full px-4 py-2 text-sm font-extrabold text-gray-700 hover:bg-gray-100 hover:rounded-t-xl">
        Reporting Structure
      </button> */}
            <a
                href={`/ordering?departmentId=${selectedDepartmentId}`}
                className="flex items-center w-full px-4 py-2 text-sm font-extrabold text-gray-700 hover:bg-gray-100 hover:rounded-b-xl"
            >
                Ordering
            </a>
        </div>
    );
};

export default PopupMenu;
