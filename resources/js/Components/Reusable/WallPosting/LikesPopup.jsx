import React from "react";

const LikesPopup = ({ likedUsers, onClose, commentId, show }) => {
    if (!show) {
        return null;
    }

    const users = likedUsers[commentId] || {};

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-[300px] mx-2 overflow-auto max-h-[90vh]">
                <div className="px-4 py-2 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Likes</h2>
                    <img
                        src="/assets/cancel.svg"
                        alt="Close"
                        className="w-6 h-6 cursor-pointer"
                        onClick={onClose}
                    />
                </div>
                <div className="p-4 space-y-4">
                    {Object.values(users).map((user, index) => (
                        <div key={index} className="flex items-center">
                            <img
                                src={
                                    user.image
                                        ? user.image.startsWith("avatar/")
                                            ? `/storage/${user.image}`
                                            : `/avatar/${user.image}`
                                        : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
                                              user.name
                                          )}&rounded=true`
                                }
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="ml-3 font-medium">
                                {user.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LikesPopup;
