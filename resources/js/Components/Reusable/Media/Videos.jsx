import React, { useEffect, useRef, useState } from "react";

const VideoComponent = ({ src, alt, className, onClick }) => (
    <video
        className={className}
        onClick={onClick}
        controls
        style={{ cursor: "pointer" }}
    >
        <source src={src} type="video/mp4" />
        {alt}
    </video>
);

const VideoModal = ({ videoSrc, alt, onClose }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play(); // Autoplay video when modal opens
        }
    }, [videoSrc]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            onClick={onClose}
        >
            <div className="relative">
                <video
                    ref={videoRef}
                    className="max-w-full max-h-full"
                    controls
                    onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on the video
                >
                    <source src={videoSrc} type="video/mp4" />
                    {alt}
                </video>
                <button
                    className="absolute top-0 right-0 mt-2 mr-2 text-white text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

function Video({ selectedItem }) {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        fetch("/api/crud/resources")
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
                        category: item.attachable_type,
                    }));
                setVideos(videoPaths);
            })
            .catch((error) => console.error("Error fetching videos:", error));
    }, []);

    const filteredVideos =
        selectedItem === "All"
            ? videos
            : videos.filter((video) => video.category === selectedItem);

    return (
        <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl shadow-lg mt-4">
            <header>
                <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-2">
                    Videos
                </h1>
                <hr className="underline" />
            </header>
            <section className="mt-8 max-md:max-w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredVideos.length > 0 ? (
                        filteredVideos.map((video, index) => (
                            <figure key={index} className="flex flex-col">
                                <VideoComponent
                                    src={video.src}
                                    alt={video.alt}
                                    className="grow shrink-0 max-w-full aspect-[1.19] w-full cursor-pointer"
                                    onClick={() => setSelectedVideo(video)}
                                />
                            </figure>
                        ))
                    ) : (
                        <p>No Videos available...</p>
                    )}
                </div>
            </section>

            {/* Modal for enlarged video */}
            {selectedVideo && (
                <VideoModal
                    videoSrc={selectedVideo.src}
                    alt={selectedVideo.alt}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </section>
    );
}

export default Video;
