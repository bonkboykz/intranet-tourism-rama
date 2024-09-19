import { useState } from "react";
import { useMemo } from "react";
import { useLayoutEffect } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import { useWindowSize } from "@uidotdev/usehooks";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";

import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";

// export function VideoComponent({
//     videoAttachment,
//     screenWidth,
//     index,
//     isVisible,
// }) {
//     const [transformPosition, setTransformPosition] = useState({ x: 0, y: 0 });

//     const calc = () => {
//         const videoElements = document.querySelectorAll(
//             ".PhotoView-Portal video"
//         );

//         const videoElement = videoElements[index];

//         if (!videoElement) {
//             return;
//         }

//         const videoWidth = videoElement.clientWidth;
//         const videoHeight = videoElement.clientHeight;
//         const windowWidth = window.innerWidth;
//         const windowHeight = window.innerHeight;

//         const x = (windowWidth - videoWidth) / 2;
//         const y = (windowHeight - videoHeight) / 2;

//         setTransformPosition({ x, y });
//     };

//     useLayoutEffect(() => {
//         if (!isVisible) {
//             return;
//         }

//         const timer1 = setTimeout(() => {
//             calc();
//         }, 0);

//         const timer2 = setTimeout(() => {
//             calc();
//         }, 100);

//         return () => {
//             clearTimeout(timer1);
//             clearTimeout(timer2);
//         };
//     }, [isVisible, index]);

//     let elementWidth = screenWidth < 600 ? screenWidth : 600;

//     return (
//         <PhotoView
//             height="auto"
//             width={elementWidth}
//             className="relative"
//             render={({ attrs }) => {
//                 return (
//                     <div {...attrs}>
//                         <video
//                             className="w-full h-full"
//                             controls={true}
//                             style={{
//                                 width: elementWidth,
//                                 transform: `translate(${transformPosition.x}px, ${transformPosition.y}px)`,
//                             }}
//                         >
//                             <source
//                                 src={`${videoAttachment.path}`}
//                                 type="video/mp4"
//                             />
//                             {videoAttachment.alt}
//                         </video>
//                     </div>
//                 );
//             }}
//         >
//             <video
//                 key={videoAttachment.id}
//                 controls={false}
//                 src={videoAttachment.path}
//                 className="grow shrink-0 max-w-full aspect-[1.19] w-full cursor-pointer"
//             />
//         </PhotoView>
//     );
// }

export function VideoGallery({ videos }) {
    const [index, setIndex] = useState(-1);

    const slides = useMemo(
        () =>
            videos.map((video) => ({
                id: video.id,
                asset: video.path,
                width: 640,
                height: 480,
                type: "video",
                controls: true,
                sources: [{ src: video.path, type: "video/mp4" }],
                autoPlay: true,
            })),
        [videos]
    );

    return (
        <>
            <RowsPhotoAlbum
                photos={slides}
                render={{
                    photo: (props, { photo: video, width, height }) => {
                        return (
                            <video
                                {...props}
                                key={video.id}
                                className="w-full h-full cursor-pointer"
                                style={{
                                    width,
                                    height,
                                }}
                                src={video.asset}
                            ></video>
                        );
                    },
                }}
                targetRowHeight={150}
                onClick={({ index: current }) => setIndex(current)}
            />

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
