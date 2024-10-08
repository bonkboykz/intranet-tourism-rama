import React from "react";

import RequestSentMessage from "./RequestAdmin";

function UpdatePhotoButton({ onClose }) {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
        console.log("Sub-popup opened for further actions");
    };

    const handleIconClick = (e) => {
        e.stopPropagation(); // Stop event propagation to prevent unintended interactions
        openPopup(e); // Open the RequestSentMessage popup or perform any action
        // Assuming action takes little to no time, we schedule the close
        setTimeout(() => {
            // Use setTimeout to simulate delay if needed
            console.log("Action completed, closing all popups");
            setIsPopupOpen(false); // Close the RequestSentMessage popup
            onClose(e); // Close the main popup
        }, 1200); // Set timeout for 3000 ms or adjust based on actual needs
    };

    const handleCloseClick = (e) => {
        console.log("Closing popup via internal close"); // Debug log
        setIsPopupOpen(false);
        onClose(e);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
            onClick={handleCloseClick}
        >
            <div
                className="p-2 rounded-3xl w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                <section className="flex flex-col px-2.5 py-1 font-bold text-center bg-white rounded-3xl shadow-custom w-[380px]">
                    {/* <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d5c01ea628264d796f4bd86723682019081b89678cb8451fb7b48173e320e5ff"
               alt="Close icon"
               className="self-end w-6 my-2 aspect-square cursor-pointer"
               onClick={handleCloseClick}
          /> */}
                    <div className="flex flex-col pr-2.5 pl-2 w-full rounded-2xl ">
                        <h2 className="text-xl text-neutral-800 font-semibold mt-5">
                            Update Photo to Staff Directory?
                        </h2>
                        <div className="flex justify-center space-x-4 text-sm my-4">
                            <button
                                className="px-4 py-2 bg-white border-2 border-grey-400 hover:bg-gray-400 text-gray-400 hover:text-white rounded-full"
                                onClick={handleCloseClick}
                            >
                                No
                            </button>
                            <button
                                className="px-4 py-2 text-white bg-primary hover:bg-primary-hover rounded-full"
                                onClick={handleIconClick}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            {isPopupOpen && <RequestSentMessage onClose={handleCloseClick} />}
        </div>
    );
}

export default UpdatePhotoButton;
