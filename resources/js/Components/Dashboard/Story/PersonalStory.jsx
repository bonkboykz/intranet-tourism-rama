export function PersonalStory({
    avatar,
    handleAvatarClick,
    stories,
    handlePlusButtonClick,
    handleFileChange,
    fileInputRef,
}) {
    return (
        <div
            style={{
                display: "inline-block",
                marginLeft: "10px",
                // marginRight: "10px",
                marginBottom: "10px",
                position: "relative",
                marginRight: "30px",
                flexShrink: 0,
            }}
        >
            <button
                style={{
                    border: "none",
                    background: "none",
                    padding: "0",
                    position: "relative",
                }}
                onClick={() => handleAvatarClick(avatar)}
            >
                <div
                    style={{
                        borderRadius: "50%",
                        width: "84px",
                        height: "84pxpx",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            stories.length > 0
                                ? "linear-gradient(45deg, #FCAF45, #FF3559, #FF9C33, #FF3559)"
                                : "transparent",
                        padding: "2px",
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
                        }}
                    />
                </div>
            </button>
            <button
                className="border-none bg-none p-0 relative"
                onClick={handlePlusButtonClick}
            >
                <span
                    style={{
                        borderRadius: "50%",
                    }}
                    className="absolute bottom-0 right-[5px] w-[22px] h-[22px] bg-primary text-white  flex items-center justify-center font-size-[12px] border-2 border-white"
                >
                    +
                </span>
            </button>
            <input
                type="file"
                accept="image/*, video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
            />
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
            <div style={{ textAlign: "center", marginTop: "-5px" }}>
                Your Story
            </div>
        </div>
    );
}
