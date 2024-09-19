import * as React from "react";
import { useRef, useState } from "react";

import BirthdayCom from "../Birthdayfunction/birthdaypopup";
import Popup from "../Popup";

function NotificationCard({
    imgSrc,
    altText,
    name,
    message,
    btnImgSrc,
    btnAltText,
    btnText,
}) {
    return (
        <article className="flex gap-4 py-5 pr-6 pl-4 mr-0 bg-white rounded-2xl border border-gray-200">
            <img
                src={imgSrc}
                alt={altText}
                loading="lazy"
                className="shrink-0 aspect-square w-[80px] h-[80px] rounded-full border-2 border-white shadow-lg"
            />
            <div className="flex flex-col mt-2.5 ">
                <p className="text-sm font-semibold mb-3">
                    <span className="text-neutral-800">It’s </span>
                    <span className="font-extrabold text-neutral-800">
                        {name}
                    </span>
                    <span className="text-neutral-800">{message}</span>
                </p>
                <div className="flex gap-2 mt-0 text-xs">
                    <img
                        src={btnImgSrc}
                        alt={btnAltText}
                        loading="lazy"
                        className="shrink-0 aspect-square w-[20px]"
                    />

                    <button className="flex underline " aria-label={btnText}>
                        {btnText}
                    </button>
                </div>
            </div>
        </article>
    );
}

function Birthdaypopup() {
    const [inputValue, setInputValue] = useState("");
    const [showPollPopup, setShowPollPopup] = useState(false);
    const [showPeoplePopup, setShowPeoplePopup] = useState(false);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    return (
        <main className="mb-6 flex flex-col justify-center gap-14 max-w-[320px] w-[320px] text-neutral-800 shadow-custom rounded-2xl mr-4">
            <div onClick={handlePopupOpen} style={{ color: "" }}>
                <NotificationCard
                    imgSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/80d03561f93a8c4f659ca6eb6958bfd4e2b46ee8c54d6d205eb675ead43272e1?apiKey=d66b6c2c936f4300b407b67b0a5e8c4d&"
                    altText="Musa's profile picture"
                    name="Musa’s"
                    message=" Birthday today!"
                    btnImgSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/c88916557d5108d0695fbf9e464053f706989bf26f0ecf83032e9f46a6646632?apiKey=d66b6c2c936f4300b407b67b0a5e8c4d&"
                    btnAltText="celebration icon"
                    btnText="Let’s Celebrate!"
                    loading="lazy"
                    onClick={handlePopupOpen}
                />
            </div>

            {isPopupOpen && (
                <Popup isOpen={isPopupOpen} onClose={handlePopupClose}>
                    <BirthdayCom />
                </Popup>
            )}

            {showPollPopup && <Polls onClose={closePopup} />}
            {showPeoplePopup && <People onClose={closePopup} />}
        </main>
    );
}

export default Birthdaypopup;
