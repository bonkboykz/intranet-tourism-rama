import { useState } from "react";
import { useMemo } from "react";
import { useLayoutEffect } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useWindowSize } from "@uidotdev/usehooks";

import "react-photo-view/dist/react-photo-view.css";

export function VideoComponent({
    videoAttachment,
    screenWidth,
    index,
    isVisible,
}) {
    const [transformPosition, setTransformPosition] = useState({ x: 0, y: 0 });

    const calc = () => {
        const videoElements = document.querySelectorAll(
            ".PhotoView-Portal video"
        );

        const videoElement = videoElements[index];

        if (!videoElement) {
            return;
        }

        const videoWidth = videoElement.clientWidth;
        const videoHeight = videoElement.clientHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const x = (windowWidth - videoWidth) / 2;
        const y = (windowHeight - videoHeight) / 2;

        setTransformPosition({ x, y });
    };

    useLayoutEffect(() => {
        if (!isVisible) {
            return;
        }

        const timer = setTimeout(() => {
            calc();
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [isVisible, index]);

    let elementWidth = screenWidth < 600 ? screenWidth : 600;

    return (
        <PhotoView
            height="auto"
            width={elementWidth}
            className="relative"
            render={({ attrs }) => {
                return (
                    <div {...attrs}>
                        <video
                            className="w-full h-full"
                            controls={true}
                            style={{
                                width: elementWidth,
                                transform: `translate(${transformPosition.x}px, ${transformPosition.y}px)`,
                            }}
                        >
                            <source
                                src={`${videoAttachment.path}`}
                                type="video/mp4"
                            />
                            {videoAttachment.alt}
                        </video>
                    </div>
                );
            }}
        >
            <video
                key={videoAttachment.id}
                controls={false}
                src={videoAttachment.path}
                className="grow shrink-0 max-w-full aspect-[1.19] w-full cursor-pointer"
            />
        </PhotoView>
    );
}

export function VideoGallery({ videos }) {
    const size = useWindowSize();

    const [visibleMap, setVisibleMap] = useState({});

    const someOfVideosVisible = useMemo(() => {
        return Object.values(visibleMap).some((visible) => visible);
    }, [visibleMap]);

    useLayoutEffect(() => {
        if (!someOfVideosVisible) {
            return;
        }

        // when .PhotoView__PhotoBox is visible, it means that the video is visible
        // when transform style we need to change it to none
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                console.log("triggered", mutation);
                if (mutation.type === "attributes") {
                    const boxElement = mutation.target;

                    console.log("boxElement", boxElement);
                    boxElement.style.transform = "none";
                }
            });
        }, {});

        const config = {
            attributes: true,
            attributeFilter: ["style"],
        };

        const boxElements = document.querySelectorAll(
            ".PhotoView-Portal .PhotoView__PhotoBox"
        );

        boxElements.forEach((boxElement) => {
            mutationObserver.observe(boxElement, config);
        });

        return () => {
            mutationObserver.disconnect();
        };
    }, [someOfVideosVisible]);

    if (!size.width) {
        return null;
    }

    return (
        <PhotoProvider
            maskOpacity={0.8}
            maskClassName="backdrop"
            onVisibleChange={(visible, index) => {
                console.log(visible, index);
                setVisibleMap((prev) => ({ ...prev, [index]: visible }));
            }}
            onIndexChange={(index) => {
                console.log("index", index);

                setVisibleMap((prev) => {
                    const newMap = { ...prev };
                    for (let key in newMap) {
                        newMap[key] = false;
                    }

                    newMap[index] = true;

                    return newMap;
                });
            }}
        >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                {videos.length > 0 ? (
                    videos.map((videoAttachment, index) => (
                        <VideoComponent
                            key={videoAttachment.id}
                            videoAttachment={videoAttachment}
                            screenWidth={size.width}
                            isVisible={Boolean(visibleMap[index])}
                            index={index}
                        />
                    ))
                ) : (
                    <p>No Videos available...</p>
                )}
            </div>
        </PhotoProvider>
    );
}
