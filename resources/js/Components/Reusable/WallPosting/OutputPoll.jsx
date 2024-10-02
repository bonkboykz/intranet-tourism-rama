import * as React from "react";

function ProfileHeader({ name, timeAgo, profileImageSrc, profileImageAlt }) {
    return (
        <header className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
            <div className="flex gap-1.5">
                <img
                    loading="lazy"
                    src={profileImageSrc}
                    alt={profileImageAlt}
                    className="shrink-0 aspect-square w-[53px]"
                />
                <div className="flex flex-col my-auto">
                    <div className="text-base font-semibold text-neutral-800">
                        {name}
                    </div>
                    <time className="mt-3 text-xs text-neutral-800 text-opacity-50">
                        {timeAgo}
                    </time>
                </div>
            </div>
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e3c193bbbcd5eca7bf933dad4a6932d076b04eb038d7635c591737bbebdc61ef?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                alt=""
                className="shrink-0 self-start aspect-[3.85] w-[19px]"
            />
        </header>
    );
}

function FeedbackOption({ optionText }) {
    return (
        <div className="flex gap-2.5 px-3.5 py-2.5 mt-4 text-sm leading-5 bg-gray-100 rounded-3xl text-neutral-800 max-md:flex-wrap">
            <div className="shrink-0 self-start w-3 bg-white rounded-full h-[11px]" />
            <div className="flex-auto max-md:max-w-full">{optionText}</div>
        </div>
    );
}

function FeedbackForm() {
    return (
        <form className="flex gap-3.5 mt-4 max-md:flex-wrap max-md:max-w-full">
            <button className="grow justify-center items-start px-5 py-3 text-sm leading-5 rounded-md border border-gray-100 border-solid text-neutral-800 text-opacity-50 w-fit max-md:px-5 max-md:max-w-full">
                Give your feedback
            </button>
            <button className="flex flex-col justify-center my-auto text-xs font-semibold leading-5 text-center text-white whitespace-nowrap px-6 py-2 bg-red-500 rounded-2xl max-md:px-5">
                Send
            </button>
        </form>
    );
}

function OuputPoll() {
    const feedbackOptions = [
        "Lorem ipsum option 1",
        "Lorem ipsum option 2",
        "Lorem ipsum option 3",
    ];

    return (
        <article className="flex flex-col px-5 py-4 bg-white rounded-xl shadow-sm max-w-[610px] max-md:pl-5">
            <ProfileHeader
                name="Thomas"
                timeAgo="1 day ago"
                profileImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/3ef13379ad38d6ae401f6ab9072d8b700c8334385ee94cc72898b7cd6fee463b?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                profileImageAlt="Profile image of Thomas"
            />
            <p className="mt-3 text-base leading-6 text-neutral-800 max-md:max-w-full">
                Corem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                eu turpis molestie, dictum est a, mattis tellus. Sed dignissim,
                metus nec fringilla accumsan, risus sem sollicitudin lacus, ut
                interdum tellus elit sed risus.
            </p>
            {feedbackOptions.map((option, index) => (
                <FeedbackOption key={index} optionText={option} />
            ))}
            <FeedbackForm />
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/d36c4e55abf5012ece1a90ed95737b46c9b6970a05e3182fdd6248adca09028e?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                alt=""
                className="mt-6 aspect-[4.55] w-[76px]"
            />
        </article>
    );
}

export default OuputPoll;
