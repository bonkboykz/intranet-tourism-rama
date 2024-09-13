import { useState } from "react";

export const PopupMenuAdmin = ({ onRemove, onAssign, closePopup }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleRemoveClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setShowPopup(true);
    };

    const handleAssign = () => {
        event.preventDefault();
        event.stopPropagation();
        onAssign();
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleConfirmRemove = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemove();
        setShowPopup(false);
        closePopup();
    };

    return (
        <div className="relative">
            <div className="absolute right-0 z-50 bg-white border shadow-lg w-[190px] rounded-xl -mt-3">
                <button
                    onClick={handleAssign}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-t-xl"
                >
                    <img
                        src="/assets/personIcon.svg"
                        alt="Assign"
                        className="w-6 h-6 mr-2"
                    />
                    Assign as User
                </button>
                <button
                    onClick={handleRemoveClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-b-xl"
                >
                    <img
                        src="/assets/🦆 icon _image_.svg"
                        alt="Remove"
                        className="w-6 h-6 mr-2"
                    />
                    Remove
                </button>
            </div>

            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative p-8 bg-white shadow-lg rounded-2xl w-96">
                        <h2 className="mb-4 text-xl font-bold text-center">
                            Delete member?
                        </h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-6 py-2 text-base font-bold text-gray-400 bg-white border border-gray-400 rounded-full hover:bg-gray-400 hover:text-white"
                                onClick={handleClosePopup}
                            >
                                No
                            </button>
                            <button
                                className="px-8 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                                onClick={handleConfirmRemove}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
