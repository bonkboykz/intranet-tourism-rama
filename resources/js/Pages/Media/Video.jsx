import { useState } from "react";
import { useMemo } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";

import "yet-another-react-lightbox/styles.css";

export function VideoGallery({ videos }) {
    const [index, setIndex] = useState(-1);

    const size = useWindowSize();

    const slides = useMemo(() => {
        if (!size.width) {
            return [];
        }

        const videoWidth = size.width - 200;
        // aspect ratio 1.19
        const videoHeight = videoWidth / 1.19;

        return videos.map((video) => ({
            id: video.id,
            asset: video.path,
            width: videoWidth,
            height: videoHeight,
            type: "video",
            controls: true,
            sources: [{ src: video.path, type: "video/mp4" }],
            autoPlay: true,
        }));
    }, [videos, size]);

    return (
        <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                {videos.map((video, index) => (
                    <video
                        key={video.id}
                        className="grow shrink-0 max-w-full aspect-[1.19] w-full object-cover cursor-pointer"
                        src={video.path}
                        onClick={() => setIndex(index)}
                    ></video>
                ))}
            </div>

            <Lightbox
                plugins={[Video]}
                index={index}
                slides={slides}
                open={index >= 0}
                close={() => setIndex(-1)}
            />
        </>
    );
}
