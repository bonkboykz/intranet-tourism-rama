import { PhotoProvider, PhotoView } from "react-photo-view";
import { useWindowSize } from "@uidotdev/usehooks";

import { VideoComponent, VideoGallery } from "./Video";

import "react-photo-view/dist/react-photo-view.css";

export function Gallery({ filteredPosts }) {
    const renderImages = () => {
        return filteredPosts.map((post) =>
            post.attachments
                ?.filter((attachment) =>
                    attachment.mime_type.startsWith("image/")
                )
                .map((imageAttachment) => (
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
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                                {/* <h1 className="pb-2 text-2xl font-bold text-neutral-800 max-md:max-w-full">Images</h1> */}
                                {renderImages()}
                            </div>
                        </PhotoProvider>
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
                            videos={filteredPosts
                                .filter((post) => post.attachments)
                                .map((post) => post.attachments)
                                .flat()
                                .filter((attachment) => {
                                    return attachment.mime_type.startsWith(
                                        "video/"
                                    );
                                })
                                .map((attachment) => ({
                                    ...attachment,
                                    path: `/storage/${attachment.path}`,
                                }))}
                        />
                    </section>
                </section>
            </div>
        </>
    );
}
