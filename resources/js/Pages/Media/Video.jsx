import { useState } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { format } from "date-fns";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Video from "yet-another-react-lightbox/plugins/video";

import { renderUploadLocationString } from "@/Utils/renderUploadLocation";

import "yet-another-react-lightbox/styles.css";
import "./Video.css";

export function VideoGallery({ videos }) {
    const [index, setIndex] = useState(-1);

    const size = useWindowSize();

    // console.log(videos);

    const slides = useMemo(() => {
        if (!size.width) {
            return [];
        }

        const videoWidth = size.width - 200;
        // aspect ratio 1.19
        const videoHeight = videoWidth / 1.19;

        return videos.map((video) => ({
            id: video.id,
            key: video.id,
            asset: video.path,
            width: videoWidth,
            height: videoHeight,
            type: "video",
            controls: true,
            sources: [{ src: video.path, type: "video/mp4" }],
            autoPlay: true,
            description: `Uploaded by ${video.post.user.name}\nOn ${format(new Date(video.post.created_at), "PPpp")}\n${renderUploadLocationString(video.post)}`,
        }));
    }, [videos, size]);

    const captionsRef = useRef(null);

    const onClick = useCallback(() => {
        (captionsRef.current?.visible
            ? captionsRef.current?.hide
            : captionsRef.current?.show)?.();

        // const yarlSlideWrapper = document.querySelector(".yarl__slide_wrapper");
        // change height to calc(100% - 80px) to make the video fit the screen
        // yarlSlideWrapper.style.height = "calc(100% - 80px)";
    }, []);

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
                plugins={[Video, Captions]}
                index={index}
                slides={slides}
                open={index >= 0}
                close={() => setIndex(-1)}
                captions={{ ref: captionsRef }}
                on={{
                    click: () => {
                        onClick();
                    },
                }}
            />
        </>
    );
}
