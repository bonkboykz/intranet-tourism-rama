import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import { useCsrf } from "@/composables";

import { People } from "../WallPosting/InputPeople";

import "../../../../css/style.css";
import "../Birthdayfunction/birthday.css";

const BirthdayCom = ({ profileImage, name, loggedInUser, selectedID }) => {
    const [backgroundImage, setBackgroundImage] = useState(
        "/assets/abstract-gray-oil-paint-textured-background.jpg"
    );
    const [text, setText] = useState("Make a wish...");
    const csrfToken = useCsrf();
    const [inputText, setInputText] = useState(text);
    const [inputValue, setInputValue] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [taggedPeople, setTaggedPeople] = useState([name]); // State to store tagged people
    const [showTaggingPopup, setShowTaggingPopup] = useState(false); // State to control tagging popup visibility

    const [backgroundTemplates, setBackgroundTemplates] = useState([]);

    const fetchBirthdayTemplates = async () => {
        try {
            const response = await axios.get("/api/birthday-templates");

            const data = response.data.data
                .map((item) => {
                    return {
                        ...item,
                        background: item.background.includes("/assets")
                            ? item.background
                            : `/storage/${item.background}`,
                    };
                })
                .filter((item) => item.is_enabled);

            setBackgroundTemplates(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchBirthdayTemplates();
    }, []);

    const handleBackgroundChange = (imageSrc) => {
        setBackgroundImage(imageSrc);
    };

    const handleTextChange = (e) => {
        setInputText(e.target.value);
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setText(inputText);
    };

    let source = null;

    if (
        !loggedInUser.profile?.image ||
        loggedInUser.profile?.image.trim() === ""
    ) {
        source = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${loggedInUser.profile?.bio}`;
    } else if (loggedInUser.profile?.image.startsWith("avatar/")) {
        source = `/storage/${loggedInUser.profile?.image}`;
    } else {
        source =
            loggedInUser.profile?.image === "/assets/dummyStaffPlaceHolder.jpg"
                ? loggedInUser.profile?.image
                : `/avatar/${loggedInUser.profile?.image}`;
    }

    const handleClickSend = () => {
        const formData = new FormData();

        // Append common fields
        formData.append("user_id", loggedInUser.id);
        formData.append("type", "birthday");
        formData.append("visibility", "public");
        formData.append("content", inputValue);

        // Append tagged people
        // const mentions = taggedPeople.map(name => ({
        //   id: selectedID,  // Assuming `selectedID` is related to the tagged person
        //   name: name
        // }));

        const mentions = taggedPeople
            .map((name) => `{ "id": "${selectedID}", "name": "${name}" }`)
            .join(", ");
        const formattedMentions = `[${mentions}]`;
        formData.append("mentions", formattedMentions);

        // Append the selected background image as an attachment if it's a supported format
        fetch(backgroundImage)
            .then((res) => res.blob())
            .then((blob) => {
                const allowedFormats = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "image/bmp",
                ];
                if (allowedFormats.includes(blob.type)) {
                    const file = new File(
                        [blob],
                        `background.${blob.type.split("/")[1]}`,
                        { type: blob.type }
                    );
                    formData.append("attachments[]", file);
                } else {
                    alert(
                        "Only JPG, JPEG, PNG, WEBP, and BMP formats are supported for background images."
                    );
                    return;
                }

                // Append any additional attachments
                attachments.forEach((file, index) => {
                    formData.append(`attachments[${index}]`, file);
                });

                // Make the API call
                fetch("/api/posts/posts", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-Token": csrfToken,
                    },
                })
                    .then((response) => {
                        if (!response.ok)
                            throw new Error("Network response was not ok");
                    })
                    .then(() => {
                        // Reset state
                        setInputValue("");
                        setAttachments([]);
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            });
    };

    return (
        <section className="flex flex-col bg-white rounded-xl w-full max-w-xl mx-auto">
            <div className="flex flex-col px-4 w-full">
                <div className="flex flex-col gap-2 text-xs font-semibold text-neutral-800">
                    <div className="flex justify-center">
                        <p className="text-2xl -mt-6 mb-2">Create Post</p>
                    </div>
                    {/* <div className="w-full border-b-2 mb-2 mt-2"></div> */}
                    <div className="flex flex-row items-center mb-2">
                        <img
                            loading="lazy"
                            src={source}
                            className="w-8 h-8 rounded-full mr-2"
                            alt="Profile"
                        />
                        <p className="my-auto text-base">{loggedInUser.name}</p>
                    </div>
                </div>

                <div
                    className="relative rounded-xl overflow-hidden flex flex-col justify-center items-center px-16 pt-20 pb-20 mt-1.5 text-3xl font-black text-center text-white text-opacity-70"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full bg-transparent border-none outline-none text-center text-white drop-shadow-custom text-3xl font-black custom-placeholder"
                        placeholder="Make a wish..."
                        style={{ textShadow: "2px 2px 4px #000000" }}
                    />
                </div>

                <div className="relative mt-2 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-16 xl:grid-cols-20 h-24 w-full overflow-x-auto border-2 rounded-2xl px-2 py-2">
                    {backgroundTemplates.map((template, index) => (
                        <img
                            key={index}
                            src={template.background}
                            className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                            alt={`image ${index}`}
                            onClick={() =>
                                handleBackgroundChange(template.background)
                            }
                        />
                    ))}
                    {/* <img
                        loading="lazy"
                        src="/assets/Birthday-Template-1.png"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 1"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-1.png"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-2.png"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 2"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-2.png"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-3.png"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 3"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-3.png"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-4.jpg"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 4"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-4.jpg"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-5.png"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 5"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-5.png"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-6.jpg"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 6"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-6.jpg"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-7.png"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 7"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-7.png"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-8.jpg"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 8"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-8.jpg"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-9.png"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 9"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-9.png"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-10.png"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 10"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-10.png"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-11.jpg"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 11"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-11.jpg"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-12.jpg"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 12"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-12.jpg"
                            )
                        }
                    />
                    <img
                        loading="lazy"
                        src="/assets/Birthday-Template-1.png"
                        className="w-12 h-9 cursor-pointer rounded-lg mb-1.5"
                        alt="image 1"
                        onClick={() =>
                            handleBackgroundChange(
                                "/assets/Birthday-Template-1.png"
                            )
                        }
                    /> */}
                    {/* Additional images */}
                </div>

                <form
                    className="flex flex-col w-full mt-4"
                    onSubmit={handleSubmit}
                >
                    <div className="flex items-center">
                        <img
                            src={profileImage}
                            alt={`${name}'s avatar`}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <p className="my-auto font-semibold text-gray-800">
                            {name}
                        </p>
                        {/* <button
              onClick={() => setShowTaggingPopup(true)}
              className="ml-auto text-sm text-blue-600 hover:underline"
            >
              Tag People
            </button> */}
                    </div>
                    {/* {taggedPeople.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-2">
    {taggedPeople.map((id) => (
      <div
        key={id}  // Ensure person.id is unique
        className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-lg shadow-sm"
      >
        <span className="text-neutral-800">{name}</span>
      </div>
    ))}
  </div> */}

                    <button
                        type="submit"
                        className="flex justify-center items-center py-2 my-4 text-sm font-bold text-white bg-blue-500 hover:bg-blue-700 rounded-full"
                        onClick={handleClickSend}
                    >
                        Post
                    </button>
                </form>
            </div>
            {showTaggingPopup && (
                <People
                    onClose={() => setShowTaggingPopup(false)}
                    onSavePeople={(people) => {
                        setTaggedPeople(people);
                        setShowTaggingPopup(false);
                    }}
                    chosenPeople={taggedPeople}
                />
            )}
        </section>
    );
};

export default BirthdayCom;
