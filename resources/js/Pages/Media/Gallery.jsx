import { PhotoProvider, PhotoView } from "react-photo-view";
import { Loader2 } from "lucide-react";

import { GalleryOverlay } from "@/Components/Reusable/GalleryOverlay";
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
                        <PhotoProvider
                            maskOpacity={0.8}
                            maskClassName="backdrop"
                            overlayRender={({
                                images: sliderAttachments,
                                index,
                            }) => {
                                const currentImage = sliderAttachments[index];

                                if (!currentImage) {
                                    return null;
                                }

                                return (
                                    <GalleryOverlay
                                        currentImage={currentImage}
                                        index={index}
                                        images={images}
                                    />
                                );
                            }}
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                                {images
                                    .sort(
                                        (a, b) =>
                                            new Date(b.created_at) -
                                            new Date(a.created_at)
                                    )
                                    .map((post) =>
                                        post.attachments
                                            .filter((attachment) =>
                                                attachment.mime_type.startsWith(
                                                    "image/"
                                                )
                                            )
                                            .map((imageAttachment) => (
                                                <div key={imageAttachment.id}>
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
                                                </div>
                                            ))
                                    )}
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
                        <VideoGallery
                            videos={videos
                                .sort(
                                    (a, b) =>
                                        new Date(b.created_at) -
                                        new Date(a.created_at)
                                )
                                .flatMap((post) =>
                                    post.attachments
                                        .filter((attachment) =>
                                            attachment.mime_type.startsWith(
                                                "video/"
                                            )
                                        )
                                        .map((videoAttachment) => ({
                                            ...videoAttachment,
                                            path: `/storage/${videoAttachment.path}?cache-bust=${Date.now()}`,
                                            posterPath: `/path/to/poster-images/${videoAttachment.id}-preview.jpg`,
                                            post,
                                        }))
                                )}
                            className="w-full h-auto"
                        />

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
            </div>
        </>
    );
}
