import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "react-toastify";
import { useWindowSize } from "@uidotdev/usehooks";
import { CircleXIcon } from "lucide-react";

import { VideoGallery } from "@/Pages/Media/Video";

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

    const fetchData = async () => {
        try {
            let currentPage = 1;
            let totalPage = 1;

            const allImages = [];

            while (currentPage <= totalPage) {
                let apiUrl = `/api/resources/resources?page=${currentPage}`;

                if (filterBy === "user") {
                    apiUrl = apiUrl;
                } else if (filterBy === "department") {
                    apiUrl += `scopes[0][accessfor]=posts&scopes[0][accessableBy][]=${accessableType}&scopes[0][accessableBy][]=${accessableId}&with[]=attachable.accessibilities`;
                } else if (filterBy === "community") {
                    apiUrl += `scopes[0][accessfor]=posts&scopes[0][accessableBy][]=${accessableType}&scopes[0][accessableBy][]=${accessableId}&with[]=attachable.accessibilities`;
                }

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();

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

                totalPage = data.data.last_page;
                currentPage++;

                allImages.push(...imagePaths);
            }

            setImages(allImages);
        } catch (e) {
            console.error("Error fetching images:", e);
            toast.error("Error fetching images:", {
                theme: "colored",
                icon: <CircleXIcon className="w-6 h-6 text-white" />,
            });
        }
    };

    useEffect(() => {
        fetchData();
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

const VideoProfile = ({
    selectedItem,
    userId,
    accessableType,
    accessableId,
    filterBy,
}) => {
    const [videos, setVideos] = useState([]);

    const fetchData = async () => {
        try {
            let currentPage = 1;
            let totalPage = 1;

            const allVideos = [];

            while (currentPage <= totalPage) {
                let apiUrl = `/api/resources/resources?page=${currentPage}`;

                if (filterBy === "user") {
                    apiUrl = apiUrl;
                } else if (filterBy === "department") {
                    apiUrl += `scopes[0][accessfor]=posts&scopes[0][accessableBy][]=${accessableType}&scopes[0][accessableBy][]=${accessableId}&with[]=attachable.accessibilities`;
                } else if (filterBy === "community") {
                    apiUrl += `scopes[0][accessfor]=posts&scopes[0][accessableBy][]=${accessableType}&scopes[0][accessableBy][]=${accessableId}&with[]=attachable.accessibilities`;
                }

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();

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
                        id: item.id,
                        src: `/storage/${item.path}`,
                        alt: `Description ${item.id}`,
                        category: item.attachable_type,
                    }));

                totalPage = data.data.last_page;
                currentPage++;

                allVideos.push(...videoPaths);
            }

            setVideos(allVideos);
        } catch (e) {
            console.error("Error fetching images:", e);
            toast.error("Error fetching images:", {
                theme: "colored",
                icon: <CircleXIcon className="w-6 h-6 text-white" />,
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId, accessableType, accessableId, filterBy]);

    // Filter videos based on selectedItem
    const filteredVideos =
        selectedItem === "All"
            ? videos
            : videos.filter((video) => video.category === selectedItem);

    return (
        <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-lg shadow-custom mt-4">
            <header>
                <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-0">
                    Videos
                </h1>
                <hr className="underline" />
            </header>
            <section className="mt-8 max-md:max-w-full">
                <VideoGallery
                    videos={filteredVideos.map((video) => ({
                        id: video.id,
                        path: video.src,
                        alt: video.alt,
                    }))}
                />
            </section>
        </section>
    );
};

export { ImageProfile, VideoProfile };
