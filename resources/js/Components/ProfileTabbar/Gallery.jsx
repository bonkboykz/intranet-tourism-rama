import { useWindowSize } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

import "react-photo-view/dist/react-photo-view.css";

const ImageComponent = ({ src, alt, className }) => (
    <img
        loading="lazy"
        src={src}
        alt={alt}
        className={className}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
    />
);

const ImageProfile = ({
    selectedItem,
    userId,
    accessableType,
    accessableId,
    filterBy,
}) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        let apiUrl = "/api/resources/resources?";

        if (filterBy === "user") {
            console.log("userrrr");
            apiUrl += `with[]=attachable.accessibilities`;
        } else if (filterBy === "department") {
            apiUrl += `scopes[0][accessfor]=posts&scopes[0][accessableBy][]=${accessableType}&scopes[0][accessableBy][]=${accessableId}&with[]=attachable.accessibilities`;
        }

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const imagePaths = data.data.data
                    .filter((item) => {
                        const fileExtension = item.path
                            .split(".")
                            .pop()
                            .toLowerCase();

                        // console.log("ITEM", item);
                        return (
                            [
                                "jpg",
                                "jpeg",
                                "png",
                                "gif",
                                "bmp",
                                "webp",
                            ].includes(fileExtension) &&
                            item.attachable?.type !== "story"
                        );
                    })
                    .map((item) => ({
                        src: `/storage/${item.path}`,
                        alt: `Description ${item.id}`,
                        category: item.attachable_type, // Adjust as per your condition
                        type: item.attachable?.type,
                    }));
                setImages(imagePaths);
            })
            .catch((error) => console.error("Error fetching images:", error));
    }, [userId, accessableType, accessableId, filterBy]);

    const filteredImages =
        selectedItem === "All"
            ? images
            : images.filter((image) => image.category === selectedItem);

    // console.log("FI", filteredImages);

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
                        {filteredImages.length > 0 ? (
                            filteredImages.map((img, index) => (
                                <PhotoView key={index} src={img.src}>
                                    <figure
                                        key={index}
                                        className="flex flex-col"
                                    >
                                        <ImageComponent
                                            src={img.src}
                                            alt={img.alt}
                                            className="grow shrink-0 w-full h-full cursor-pointer"
                                        />
                                    </figure>
                                </PhotoView>
                            ))
                        ) : (
                            <p>No Images available...</p>
                        )}
                    </div>
                </PhotoProvider>
            </section>
        </section>
    );
};

const VideoComponent = ({ src, alt, className, controls }) => (
    <video className={className} controls={controls}>
        <source src={src} type="video/mp4" />
        {alt}
    </video>
);

const VideoProfile = ({
    selectedItem,
    userId,
    accessableType,
    accessableId,
    filterBy,
}) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        let apiUrl = "/api/resources/resources?";

        if (filterBy === "user") {
            apiUrl = apiUrl;
        } else if (filterBy === "department") {
            apiUrl += `scopes[0][accessfor]=posts&scopes[0][accessableBy][]=${accessableType}&scopes[0][accessableBy][]=${accessableId}&with[]=attachable.accessibilities`;
        }

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const videoPaths = data.data.data
                    .filter((item) => {
                        const fileExtension = item.path
                            .split(".")
                            .pop()
                            .toLowerCase();

                        return [
                            "mp4",
                            "mov",
                            "avi",
                            "wmv",
                            "flv",
                            "mkv",
                            "webm",
                        ].includes(fileExtension);
                    })
                    .map((item) => ({
                        src: `/storage/${item.path}`,
                        alt: `Description ${item.id}`,
                        category: item.attachable_type, // Adjust as per your condition
                    }));
                setVideos(videoPaths);
            })
            .catch((error) => console.error("Error fetching images:", error));
    }, [userId, accessableType, accessableId, filterBy]);

    // Filter videos based on selectedItem
    const filteredVideos =
        selectedItem === "All"
            ? videos
            : videos.filter((video) => video.category === selectedItem);

    const size = useWindowSize();

    return (
        <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-lg shadow-custom mt-4">
            <header>
                <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-0">
                    Videos
                </h1>
                <hr className="underline" />
            </header>
            <section className="mt-8 max-md:max-w-full">
                <PhotoProvider maskOpacity={0.8} maskClassName="backdrop">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filteredVideos.length > 0 ? (
                            filteredVideos.map((video, index) => {
                                let elementSize = 600;

                                if (elementSize > size.width) {
                                    elementSize = size.width;
                                }

                                return (
                                    <PhotoView
                                        height={elementSize}
                                        width={elementSize}
                                        className="relative"
                                        render={({ scale, attrs }) => {
                                            return (
                                                <div {...attrs}>
                                                    <VideoComponent
                                                        src={video.src}
                                                        alt={video.alt}
                                                        className="w-full h-full"
                                                        controls={true}
                                                    />
                                                </div>
                                            );
                                        }}
                                    >
                                        <figure
                                            key={index}
                                            className="flex flex-col"
                                        >
                                            <VideoComponent
                                                src={video.src}
                                                alt={video.alt}
                                                className="grow shrink-0 max-w-full aspect-[1.19] w-full cursor-pointer"
                                                controls={false}
                                            />
                                        </figure>
                                    </PhotoView>
                                );
                            })
                        ) : (
                            <p>No Videos available...</p>
                        )}
                    </div>
                </PhotoProvider>
            </section>
        </section>
    );
};

export { ImageProfile, VideoProfile };
