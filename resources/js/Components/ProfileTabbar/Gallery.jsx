import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Loader2 } from "lucide-react";

import { VideoGallery } from "@/Pages/Media/Video";
import { useLazyLoading } from "@/Utils/hooks/useLazyLoading";

import "react-photo-view/dist/react-photo-view.css";

const ImageProfile = ({ userId, communityId, departmentId }) => {
    const {
        data: posts,
        hasMore: hasMoreImages,
        isLoading: isImagesLoading,
        nextPage: loadMoreImages,
    } = useLazyLoading("/api/posts/get_media", {
        only_image: true,
        user_id: userId,
        community_id: communityId,
        department_id: departmentId,
    });

    const renderImages = () => {
        return posts.map((post) =>
            post.attachments.map((imageAttachment) => (
                <PhotoView
                    key={imageAttachment.id}
                    src={`/storage/${imageAttachment.path}`}
                >
                    <img
                        src={`/storage/${imageAttachment.path}`}
                        alt="Image Attachment"
                        className="grow shrink-0 max-w-full aspect-[1.19] w-full object-cover cursor-pointer"
                    />
                </PhotoView>
            ))
        );
    };

    return (
        <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-lg shadow-custom mt-4">
            <header>
                <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-0">
                    Images
                </h1>
                <hr className="underline" />
            </header>
            <section className="mt-8 max-md:max-w-full sm::max-s-full">
                <PhotoProvider maskOpacity={0.8} maskClassName="backdrop">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {renderImages()}
                    </div>
                </PhotoProvider>

                {hasMoreImages && (
                    <button
                        disabled={isImagesLoading}
                        onClick={loadMoreImages}
                        className="w-full py-2 mt-4 bg-primary-600 text-white rounded-md bg-primary hover:bg-primary-hover flex align-center justify-center"
                    >
                        {isImagesLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            "Load More"
                        )}
                    </button>
                )}
            </section>
        </section>
    );
};

const VideoProfile = ({ userId, communityId, departmentId }) => {
    const {
        data: posts,
        hasMore: hasMoreVideo,
        isLoading: isVideoLoading,
        nextPage: loadMoreVideo,
    } = useLazyLoading("/api/posts/get_media", {
        only_video: true,
        user_id: userId,
        community_id: communityId,
        department_id: departmentId,
    });

    const videos = posts
        .filter((post) => post.attachments)
        .map((post) => post.attachments)
        .flat()
        .map((attachment) => ({
            ...attachment,
            path: `/storage/${attachment.path}`,
        }));

    return (
        <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-lg shadow-custom mt-4">
            <header>
                <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-0">
                    Videos
                </h1>
                <hr className="underline" />
            </header>
            <section className="mt-8 max-md:max-w-full">
                <VideoGallery videos={videos} />

                {hasMoreVideo && (
                    <button
                        disabled={isVideoLoading}
                        onClick={loadMoreVideo}
                        className="w-full py-2 mt-4 bg-primary-600 text-white rounded-md bg-primary hover:bg-primary-hover flex align-center justify-center"
                    >
                        {isVideoLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            "Load More"
                        )}
                    </button>
                )}
            </section>
        </section>
    );
};

export { ImageProfile, VideoProfile };
