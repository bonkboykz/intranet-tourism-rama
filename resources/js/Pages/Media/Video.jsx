import { useCallback,useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Video from "yet-another-react-lightbox/plugins/video";

import "yet-another-react-lightbox/styles.css";
import "../../../css/app.css";

export function VideoGallery({ videos }) {
    const [index, setIndex] = useState(-1);
    const captionsRef = useRef(null);

    const slides = useMemo(() => {
        return videos.map((video) => ({
            id: video.id,
            key: video.id,
            asset: video.path,
            poster: video.posterPath,
            type: "video",
            controls: true,
            sources: [{ src: video.path, type: "video/mp4" }],
            autoPlay: true,
        }));
    }, [videos]);

    const onClick = useCallback(() => {
        (captionsRef.current?.visible
            ? captionsRef.current?.hide
            : captionsRef.current?.show)?.();
    }, []);

    return (
        <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                {videos.map((video, index) => (
                    <video
                        key={video.id}
                        className="grow shrink-0 max-w-full aspect-[1.19] w-full object-cover cursor-pointer"
                        src={video.path}
                        poster={video.posterPath}
                        onClick={() => setIndex(index)}
                        preload="metadata"
                        muted
                        width="100%"
                        height="auto"
                        controls
                    />
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
