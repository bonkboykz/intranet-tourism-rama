import { useCallback } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Loader2 } from "lucide-react";

import { useLazyLoading } from "@/Utils/hooks/useLazyLoading";

import { VideoGallery } from "./Video";

import "react-photo-view/dist/react-photo-view.css";

export function Gallery({ images, videos }) {
    const imagesAttachments = images
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((post) =>
            post.attachments
                .filter((attachment) =>
                    attachment.mime_type.startsWith("image/")
                )
                .map((imageAttachment) => {
                    return (
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
                    );
                })
        );

    const videosAttachments = videos
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .flatMap((post) =>
            post.attachments
                .filter((attachment) =>
                    attachment.mime_type.startsWith("video/")
                )
                .map((videoAttachment) => ({
                    ...videoAttachment,
                    path: `/storage/${videoAttachment.path}?cache-bust=${Date.now()}`,
                    post,
                }))
        );

    return (
        <>
            {imagesAttachments.length > 0 && (
                <div>
                    <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl mt-4">
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
                            >
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                                    {imagesAttachments}
                                </div>
                            </PhotoProvider>
                        </section>
                    </section>
                </div>
            )}
            {videosAttachments.length > 0 && (
                <div>
                    <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl mt-4">
                        <header>
                            <h1 className="pb-2 text-2xl font-bold text-neutral-800 max-md:max-w-full">
                                Videos
                            </h1>
                            <hr className="underline" />
                        </header>
                        <section className="mt-4 max-md:max-w-full">
                            <VideoGallery
                                posts={videos}
                                className="w-full h-auto"
                            />
                        </section>
                    </section>
                </div>
            )}
        </>
    );
}
