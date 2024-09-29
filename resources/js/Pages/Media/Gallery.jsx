import { useCallback } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Loader2 } from "lucide-react";

import { useLazyLoading } from "@/Utils/hooks/useLazyLoading";

import { VideoGallery } from "./Video";

import "react-photo-view/dist/react-photo-view.css";

export function Gallery({ selectedTag }) {
    const {
        data: images,
        hasMore: hasMoreImages,
        nextPage: loadMoreImages,
        isLoading: isImagesLoading,
    } = useLazyLoading("/api/posts/public_media", {
        ...(selectedTag !== "" && {
            album_id: selectedTag,
        }),
        only_image: true,
    });

    const {
        data: videos,
        hasMore: hasMoreVideo,
        nextPage: loadMoreVideo,
        isLoading: isVideoLoading,
    } = useLazyLoading("/api/posts/public_media", {
        ...(selectedTag !== "" && {
            album_id: selectedTag,
        }),
        only_video: true,
    });

    const renderImages = useCallback(() => {
        return (
            <PhotoProvider maskOpacity={0.8} maskClassName="backdrop">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                    {images.map((post) =>
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
                    )}
                </div>
            </PhotoProvider>
        );
    }, [images]);

    const renderVideos = useCallback(() => {
        return (
            <VideoGallery
                videos={videos
                    .filter((post) => post.attachments)
                    .map((post) => post.attachments)
                    .flat()
                    .map((attachment) => ({
                        ...attachment,
                        path: `/storage/${attachment.path}`,
                    }))}
            />
        );
    }, [videos]);

    return (
        <>
            <div>
                <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl shadow-lg mt-4">
                    <header>
                        <h1 className="pb-2 text-2xl font-bold text-neutral-800 max-md:max-w-full">
                            Images
                        </h1>
                        <hr className="underline" />
                    </header>
                    <section className="mt-4 max-md:max-w-full">
                        {renderImages()}

                        {hasMoreImages && (
                            <button
                                disabled={isImagesLoading}
                                onClick={loadMoreImages}
                                className="w-full py-2 mt-4 bg-primary-600 text-white rounded-md bg-blue-500 hover:bg-blue-700 flex align-center justify-center"
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
            </div>
            <div>
                <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl shadow-lg mt-4">
                    <header>
                        <h1 className="pb-2 text-2xl font-bold text-neutral-800 max-md:max-w-full">
                            Videos
                        </h1>
                        <hr className="underline" />
                    </header>
                    <section className="mt-4 max-md:max-w-full">
                        {renderVideos()}

                        {hasMoreVideo && (
                            <button
                                disabled={isVideoLoading}
                                onClick={loadMoreVideo}
                                className="w-full py-2 mt-4 bg-primary-600 text-white rounded-md bg-blue-500 hover:bg-blue-700 flex align-center justify-center"
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
            </div>
        </>
    );
}
