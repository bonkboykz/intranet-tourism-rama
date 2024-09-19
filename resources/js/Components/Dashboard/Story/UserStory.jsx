export function UserStory({
    avatar,
    handleAvatarClick,
    allStoriesViewed,
    stories,
}) {
    return (
        <div
            style={{
                display: "inline-block",
                margin: "10px",
                position: "relative",
                marginRight: "10px",
            }}
        >
            <button
                style={{
                    border: "none",
                    background: "none",
                    padding: "0",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        borderRadius: "50%",
                        background:
                            stories.length > 0
                                ? "linear-gradient(45deg, #FCAF45, #FF3559, #FF9C33, #FF3559)"
                                : "transparent",
                        padding: "2px",
                        filter: allStoriesViewed ? "grayscale(100%)" : "none", // Apply grayscale filter if the stories have been viewed
                    }}
                >
                    <img
                        src={
                            !avatar.src // check if src variable is empty
                                ? `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${avatar.fullName}&rounded=true` // if src is empty = src equals to this path
                                : avatar.src ===
                                  "/assets/dummyStaffPlaceHolder.jpg" //if avatar.src is not empty, check id avatar.src is equal to this path
                                ? avatar.src // if it is equal to the path, then src = avatar.src
                                : avatar.src.startsWith("avatar/") // if not equal, then check if avatar.src starts with avatar/
                                ? `/storage/${avatar.src}` // if yes, then src = storage/{avatar.src}
                                : `/storage/avatar/${avatar.src}` // If no then then src =
                        }
                        alt={avatar.alt}
                        style={{
                            borderRadius: "50%",
                            width: "80px",
                            height: "80px",
                            border: "3px solid white",
                            objectFit: "cover",
                        }}
                        onClick={() => handleAvatarClick(avatar)}
                    />
                </div>
            </button>
            <div
                style={{
                    textAlign: "center",
                    marginTop: "-5px",
                    fontSize: "12px",
                    color: "#888",
                }}
            >
                {stories.length} {stories.length === 1 ? "story" : "stories"}
            </div>
            <div
                style={{
                    textAlign: "center",
                    marginTop: "-5px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "85px", // Adjust the width as needed
                }}
            >
                {avatar.fullName}
            </div>
        </div>
    );
}
