import React, { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { useMemo } from "react";
import { createPortal } from "react-dom";

import StoryViewer from "./StoryViewer";
import { PersonalStory } from "./Story/PersonalStory";
import { UserStory } from "./Story/UserStory";
import Popup from "./CreateStoryPopup";
import CreateImageStory from "./CreateImageStory";

import "./styles.css";

const StoryNew = ({ userId }) => {
    const [showStoryViewer, setShowStoryViewer] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const { props } = usePage();
    const { id } = props; // Access the user ID from props
    const [userStories, setUserStories] = useState([]);

    // const userData = useUserData(id);

    const containerRef = useRef(null);

    const fileInputRef = useRef(null);

    const fetchStories = async () => {
        const response = await axios.get(`/api/posts/get_recent_stories`);

        if ([401, 403, 500].includes(response.status)) {
            throw new Error("Network response was not ok");
        }

        const storiesToAdd = response.data.data.map((story) => ({
            url:
                story.attachments.length > 0
                    ? `${story.attachments[0].path}`
                    : "",
            type:
                story.attachments.length > 0
                    ? story.attachments[0].mime_type.startsWith("image")
                        ? "image"
                        : "video"
                    : "image",
            text: story.content,
            userId: story.user_id,
            postId: story.id,
            imageName:
                story.attachments.length > 0
                    ? story.attachments[0].metadata?.original_name
                    : "",
            timestamp: new Date(story.created_at).getTime(),
            viewed: story.viewed,
        }));

        setUserStories(storiesToAdd);
    };

    useEffect(() => {
        fetchStories();
    }, [id]);

    const [avatars, setAvatars] = useState({});

    const fetchAvatars = async () => {
        const userIds = [...userStories.map((story) => story.userId), id];

        const uniqueUserIds = [...new Set(userIds)];

        const userAvatars = await Promise.all(
            uniqueUserIds.map(async (userId) => {
                const response = await axios.get(`/api/users/users/${userId}`, {
                    params: {
                        with: ["profile"],
                    },
                });

                const user = response.data.data;

                return {
                    id: user.id,
                    src: user.profile?.image,
                    alt: `Avatar of ${user.name}`,
                    name: user.username,
                    fullName: user.name,
                };
            })
        );

        // turn userAvatars into an object with the user ID as the key
        const userAvatarsObject = userAvatars.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        setAvatars(userAvatarsObject);
    };

    useEffect(() => {
        fetchAvatars();
    }, [userStories]);

    const handleAvatarClick = (avatar) => {
        const avatarStories = userStories.filter(
            (story) => story.userId === avatar.id
        );

        if (avatar.id === id && avatarStories.length === 0) {
            fileInputRef.current.click();

            return;
        }

        setSelectedStory(avatarStories);
        setSelectedUser(avatar);
        setShowStoryViewer(true);
    };

    const handlePlusButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setIsPopupOpen(true);
        }
    };

    const handleGoBack = () => {
        setSelectedFile(null);
        setIsPopupOpen(false);
        handlePlusButtonClick();
    };

    const handleCloseViewer = () => {
        setShowStoryViewer(false);
        setSelectedStory(null);
        setSelectedUser(null);
    };

    const handlePostStory = async () => {
        await fetchStories();
        setIsPopupOpen(false);
    };

    const [viewedMap, setViewedMap] = useState({});

    useEffect(() => {
        const newViewedMap = userStories.reduce((acc, cur) => {
            acc[cur.postId] = Boolean(cur.viewed);
            return acc;
        }, {});

        setViewedMap(newViewedMap);
    }, [userStories]);

    const markStoryAsViewed = async (story) => {
        setViewedMap({
            ...viewedMap,
            [story.postId]: true,
        });

        try {
            await axios.post(`/api/posts/posts/${story.postId}/markAsViewed`);
        } catch (e) {
            console.error(e);
        }
    };

    const storiesByUsers = useMemo(() => {
        return userStories.reduce((acc, cur) => {
            if (acc[cur.userId]) {
                acc[cur.userId].push(cur);
            } else {
                acc[cur.userId] = [cur];
            }

            return acc;
        }, {});
    }, [userStories]);

    const { userGroupedStories, otherUsersGroupedStories } = useMemo(() => {
        const userGroupedStories = [];
        const otherUsersGroupedStories = [];

        for (const [userId, stories] of Object.entries(storiesByUsers)) {
            if (userId.toString() === id.toString()) {
                userGroupedStories.push({
                    userId: userId,
                    stories,
                    avatar: avatars[id],
                    allViewed: stories.every((story) => {
                        return viewedMap[story.postId];
                    }),
                });
            } else {
                otherUsersGroupedStories.push({
                    userId: userId,
                    stories,
                    avatar: avatars[userId],
                    allViewed: stories.every((story) => {
                        return viewedMap[story.postId];
                    }),
                });
            }
        }

        // apply custom sorting for other users' stories
        // 1. Don't show users without stories
        // 2. Sort by timestamp
        // 3. If user watched all stories, move them to the end
        otherUsersGroupedStories.sort((a, b) => {
            if (a.stories.length === 0) {
                return 1;
            }

            if (b.stories.length === 0) {
                return -1;
            }

            if (a.allViewed && !b.allViewed) {
                return 1;
            }

            if (!a.allViewed && b.allViewed) {
                return -1;
            }

            return a.stories[0].timestamp - b.stories[0].timestamp;
        });

        return {
            userGroupedStories: userGroupedStories[0] ?? {
                userId: id,
                stories: [],
                avatar: avatars[id],
                allViewed: false,
            },
            otherUsersGroupedStories: otherUsersGroupedStories.filter(
                (group) => group.stories.length > 0 && group.avatar
            ),
        };
    }, [storiesByUsers, viewedMap, avatars]);

    const userAvatar = avatars[id] ?? {
        id: id,
        src: "",
        alt: `Avatar of ${id}`,
        name: "",
        fullName: "",
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
                marginBottom: "30px",
                marginLeft: "-20px",
                width: "full",
            }}
        >
            <PersonalStory
                stories={userGroupedStories.stories}
                avatar={userAvatar}
                handleAvatarClick={handleAvatarClick}
                handlePlusButtonClick={handlePlusButtonClick}
                handleFileChange={handleFileChange}
                fileInputRef={fileInputRef}
            />
            <div
                ref={containerRef}
                style={{ overflowX: "auto", whiteSpace: "nowrap" }}
            >
                {otherUsersGroupedStories.map((group, index) => {
                    return (
                        <UserStory
                            key={index}
                            allStoriesViewed={group.allViewed}
                            avatar={group.avatar}
                            handleAvatarClick={handleAvatarClick}
                            stories={group.stories}
                        />
                    );
                })}
            </div>
            {showStoryViewer && selectedStory && (
                <StoryViewer
                    stories={selectedStory}
                    onClose={handleCloseViewer}
                    user={selectedUser}
                    onViewed={markStoryAsViewed}
                    onDelete={() => {
                        setShowStoryViewer(false);
                        setSelectedStory(null);
                        setSelectedUser(null);

                        fetchStories();
                    }}
                />
            )}
            {isPopupOpen &&
                createPortal(
                    <Popup
                        isOpen={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                    >
                        <CreateImageStory
                            userId={userId}
                            onPostStory={handlePostStory}
                            file={selectedFile}
                            onGoBack={handleGoBack}
                        />
                    </Popup>,
                    document.body
                )}
        </div>
    );
};

export default StoryNew;
