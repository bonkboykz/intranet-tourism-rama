import React from 'react';
import { cn } from "@/Utils/cn";


export function BirthdayPostCard({ post, togglePopup, isPopupOpen, index, addPopupRef, handleEdit, confirmDelete, handleAnnouncement, openCommentPopup, likesCount, handleLike, handleUnlike, isPostLikedByUser }) {
    return (
        <article
            className={cn(
                post.type === "announcement" ? "mt-10" : "mt-10",
                "p-4 rounded-2xl bg-white border-2 shadow-xl w-full lg:w-[610px] md:w-[610px] sm:w-[610px] relative"
            )}
        >
            <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full ">
                <div className="flex gap-1 mt-2"></div>
                <div className="flex-col justify-between items-start px-1 w-full mb-4 p-2 -ml-2 -mt-3">
                    <span className="text-sm font-semibold text-neutral-800 bg-gray-200 rounded-md px-2 py-1 -mt-5">
                        {post.accessibilities?.map(
                            (accessibility, index) => (
                                <span key={index}>
                                    {accessibility.accessable_type}
                                    {": "}
                                </span>
                            )
                        )}
                        {post.departmentNames
                            ? post.departmentNames
                            : post.type}
                    </span>
                    <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full mt-4">
                        <div className="flex gap-1.5 -mt-1">
                            <img
                                loading="lazy"
                                src={
                                    post.userProfile.profile?.image
                                        ? post.userProfile.profile
                                            .image ===
                                        "/assets/dummyStaffPlaceHolder.jpg"
                                            ? post.userProfile.profile.image
                                            : post.userProfile.profile.image.startsWith(
                                                "avatar/"
                                            )
                                                ? `/storage/${post.userProfile.profile.image}`
                                                : `/avatar/${post.userProfile.profile.image}`
                                        : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
                                            post.user.name
                                        )}&rounded=true`
                                }
                                alt={post.user.name}
                                className="shrink-0 aspect-square w-[53px] rounded-image"
                            />
                            <div className="flex flex-col my-auto">
                                <div className="text-base font-semibold text-neutral-800">
                                    {post.user.name}
                                </div>
                                <time className="mt-1 text-xs text-neutral-800 text-opacity-50">
                                    {formatTimeAgo(post.created_at)}
                                </time>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <img
                                loading="lazy"
                                src="/assets/wallpost-dotbutton.svg"
                                alt="Options"
                                className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer mt-1"
                                onClick={() => togglePopup(index)}
                            />
                        </div>
                    </div>
                </div>
                {isPopupOpen[index] && (
                    <div
                        ref={(el) => addPopupRef(el, index)}
                        className="absolute bg-white border-2 rounded-xl p-1 shadow-custom mt-16 right-0 w-[180px] h-auto z-10"
                    >
                        <p
                            className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                            onClick={() => handleEdit(post)}
                        >
                            <img
                                className="w-6 h-6 mr-2"
                                src="/assets/EditIcon.svg"
                                alt="Edit"
                            />
                            Edit
                        </p>
                        <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
                        <p
                            className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                            onClick={() => confirmDelete(post.id)}
                        >
                            <img
                                className="w-6 h-6 mr-2"
                                src="/assets/DeleteIcon.svg"
                                alt="Delete"
                            />
                            Delete
                        </p>
                        <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
                        <p
                            className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2"
                            onClick={() => handleAnnouncement(post)}
                        >
                            <img
                                className="w-6 h-6 mr-2"
                                src="/assets/AnnounceIcon.svg"
                                alt="Announcement"
                            />
                            Announcement
                        </p>
                    </div>
                )}
            </header>

            {/* Content and Attachments */}
            {!post.attachments || post.attachments.length === 0 ? (
                <>
                    <div>{post.content}</div>
                    <p className="mt-0 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                        {post.mentions
                            ? JSON.parse(post.mentions)
                                .map((mention) => mention.name)
                                .join(", ")
                            : ""}
                    </p>
                </>
            ) : (
                <>
                    <p className="mt-0 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                        {post.mentions
                            ? JSON.parse(post.mentions)
                                .map((mention) => mention.name)
                                .join(", ")
                            : ""}
                    </p>
                    <div className="relative flex flex-wrap gap-2 mt-4">
                        {post.attachments.map((attachment, idx) => (
                            <div key={idx} className="relative w-full">
                                <img
                                    src={`/storage/${attachment.path}`}
                                    alt={`Attachment ${idx + 1}`}
                                    className="rounded-xl w-full h-auto object-cover"
                                    style={{ maxHeight: "300px" }}
                                />
                                {idx === Math.floor(post.attachments.length / 2) && (
                                    <div className="absolute inset-0 flex justify-center items-center p-4">
                                        <span
                                            className="text-5xl font-black text-center text-white text-opacity-90 bg-black bg-opacity-50 rounded-lg"
                                            style={{
                                                maxWidth: "90%",
                                                overflowWrap: "break-word",
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            {post.content}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Likes and Comments */}
            <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                    {isPostLikedByUser(post) ? (
                        <img
                            src="/assets/Like.svg"
                            alt="Unlike"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => handleUnlike(post.id)}
                        />
                    ) : (
                        <img
                            src="/assets/likeforposting.svg"
                            alt="Like"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => handleLike(post.id)}
                        />
                    )}
                    {likesCount > 0 && (
                        <span className="text-sm font-medium">{likesCount}</span>
                    )}
                </div>
                <img
                    src="/assets/commentforposting.svg"
                    alt="Comment"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => openCommentPopup(post)}
                />
            </div>
        </article>
    );
}
