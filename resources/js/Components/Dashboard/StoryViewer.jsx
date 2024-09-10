import React, { useState, useEffect } from "react";
import Stories from "react-insta-stories";
import DeleteIcon from "../../../../public/assets/DeleteRedButton.svg";
import { useCsrf } from "@/composables";

const StoryViewer = ({ stories, onClose, user, onViewed }) => {
    // console.log("USER", user);

    const csrfToken = useCsrf();

    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        setIsPaused(showDeletePopup);
    }, [showDeletePopup]);

    const handleStoryStart = async () => {
        onViewed(stories[currentStoryIndex]);
    };

    const handleStoryEnd = async () => {
        if (currentStoryIndex < stories.length) {
            setCurrentStoryIndex(currentStoryIndex + 1);
        }
    };

    const handlePrevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
        }
    };

    const handleNextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
        }
    };

    const handleAllStoriesEnd = () => {
        onClose();
    };

    const API_URL = "/api/posts/posts";

    const handleDelete = async () => {
        const { postId } = stories[currentStoryIndex];
        try {
            const response = await fetch(`${API_URL}/${postId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-Token": csrfToken,
                },
            });

            if (response.ok) {
                console.log(`Post with ID ${postId} deleted successfully.`);
                window.location.reload();
            } else {
                console.error(`Failed to delete post with ID ${postId}.`);
            }
        } catch (error) {
            console.error(`Error deleting post with ID ${postId}:`, error);
        }
        setShowDeletePopup(false);
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9998,
                }}
            ></div>
            <div
                style={{
                    position: "relative",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
                onClick={(e) => {
                    if (!showDeletePopup) {
                        if (e.clientX < window.innerWidth / 2) {
                            handlePrevStory();
                        } else {
                            handleNextStory();
                        }
                    }
                }}
            >
                <div
                    style={{
                        position: "relative",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        padding: "12px",
                        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
                        maxWidth: "400px",
                        maxHeight: "700px",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flex: "1",
                                marginBottom: "5px",
                            }}
                        >
                            <img
                                src={
                                    !user.src // check if src variable is empty
                                        ? `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.fullName}` // if src is empty = src equals to this path
                                        : user.src ===
                                          "/assets/dummyStaffPlaceHolder.jpg" //if user.src is not empty, check id user.src is equal to this path
                                        ? user.src // if it is equal to the path, then src = user.src
                                        : user.src.startsWith("avatar/") // if not equal, then check if user.src starts with user/
                                        ? `/storage/${user.src}` // if yes, then src = storage/{user.src}
                                        : `${user.src}` // If no then then src =
                                }
                                alt={user.alt}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    marginRight: "8px",
                                    objectFit: "cover",
                                }}
                            />
                            <div
                                className="font-bold"
                                style={{
                                    fontSize: "14px",
                                    marginTop: "5px",
                                    marginLeft: "5px",
                                }}
                            >
                                {user.fullName ? user.fullName : "Your Story"}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDeletePopup(true)}
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                            }}
                        >
                            <img
                                src={DeleteIcon}
                                alt="Delete icon"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    marginTop: "-10px",
                                }}
                            />
                        </button>
                        <button
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                            }}
                            onClick={onClose}
                        >
                            <img
                                src="/assets/cancel.svg"
                                className="w-6 h-6"
                                alt="Close icon"
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    marginTop: "-10px",
                                    marginLeft: "10px",
                                }}
                            />
                        </button>
                        {/* <button onClick={onClose} className="modal-close-button pt-3 px-2">
                            <img src="/assets/cancel.svg" alt="Close icon" className="w-6 h-6" />
                        </button> */}
                    </div>
                    <Stories
                        stories={stories.map((story) => ({
                            ...story,
                            url: `/storage/${story.url}`,
                            text: story.text,
                        }))}
                        defaultInterval={7 * 1000}
                        width={360}
                        height={596}
                        onStoryStart={handleStoryStart}
                        onStoryEnd={handleStoryEnd}
                        currentIndex={currentStoryIndex}
                        onAllStoriesEnd={handleAllStoriesEnd}
                        isPaused={isPaused}
                        storyStyles={{
                            width: "360px",
                        }}
                    />
                    {stories[currentStoryIndex]?.text && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "2%",
                                right: "3.3%",
                                width: "93.3%",
                                padding: "10px",
                                background: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                textAlign: "center",
                                zIndex: 10000,
                            }}
                        >
                            <p>{stories[currentStoryIndex].text}</p>
                        </div>
                    )}
                </div>
            </div>
            {showDeletePopup && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "20px",
                        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
                        zIndex: 10000,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "400px",
                    }}
                >
                    <div
                        style={{
                            marginBottom: "20px",
                            fontWeight: "bold",
                            fontSize: "larger",
                        }}
                    >
                        <h2>Delete Story?</h2>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <button
                            onClick={handleDelete}
                            style={{
                                backgroundColor: "white",
                                color: "#333",
                                border: "1px solid #ccc",
                                borderRadius: "25px",
                                width: "80px",
                                padding: "10px 20px",
                                cursor: "pointer",
                                marginRight: "16px",
                                transition: "background-color 0.3s, color 0.3s", // For smooth transition
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#f5f5f5";
                                e.target.style.color = "#000";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "white";
                                e.target.style.color = "#333";
                            }}
                        >
                            Yes
                        </button>

                        <button
                            onClick={handleClosePopup}
                            style={{
                                backgroundColor: "#E53935",
                                color: "white",
                                border: "none",
                                borderRadius: "25px",
                                width: "80px",
                                padding: "10px 20px",
                                cursor: "pointer",
                                marginRight: "10px",
                                transition: "background-color 0.3s, color 0.3s", // For smooth transition
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#d32f2f";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#E53935";
                            }}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryViewer;
