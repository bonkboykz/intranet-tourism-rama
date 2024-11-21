import { useMemo, useState } from "react";
import { format } from "date-fns";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Video from "yet-another-react-lightbox/plugins/video";

import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/styles.css";
import "../../../css/app.css";

export function VideoGallery({ posts }) {
    const [index, setIndex] = useState(-1);

    const videos = posts
        .filter((post) => post.attachments)
        .map((post) => post.attachments)
        .flat()
        .filter((attachment) => {
            return attachment.mime_type.startsWith("video/");
        })
        .map((attachment) => ({
            ...attachment,
            path: `/storage/${attachment.path}`,
            postId: attachment.post_id,
        }));

    const renderVideoDescription = (video) => {
        const post = posts.find((p) => {
            console.log("p.id: ", p.id);
            console.log("video: ", video.attachable_id);

            return p.id === video.attachable_id;
        });

        if (!post) return null;

        const author = post?.user?.name;
        const { department, community } = post;

        let locationText = "";
        if (department) {
            locationText = `from Department: ${department.name}`;
        } else if (community) {
            locationText = `from Community: ${community.name}`;
        } else {
            locationText = "from Wall Posting";
        }

        return (
            <div className="ext-sm text-slate-300">
                <div>
                    <span className="font-bold">Uploaded by </span>
                    {author}
                </div>
                <div>On {format(new Date(post.created_at), "PPpp")}</div>
                <div>{locationText}</div>
            </div>
        );
    };

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
            description: renderVideoDescription(video),
        }));
    }, [videos]);

    const handleClickVideo = (index) => {
        setIndex(index);
    };

    // const selectedSlide = index >= 0 ? slides[index] : null;

    return (
        <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2">
                {videos.map((video, index) => (
                    <video
                        key={video.id}
                        className="grow shrink-0 max-w-full aspect-[1.19] w-full object-cover cursor-pointer"
                        src={`${video.path}#t=0.001`}
                        onClick={() => handleClickVideo(index)}
                        preload="metadata"
                        muted
                        width="100%"
                        height="auto"
                    />
                ))}
            </div>

            <Lightbox
                plugins={[Video, Captions]}
                index={index}
                slides={slides}
                open={index >= 0}
                close={() => setIndex(-1)}
                captions={{
                    // showToggle: true,
                    descriptionTextAlign: "start",
                    renderCaptions: (captions) => (
                        <div style={{ color: "white" }}>
                            {captions.description}
                        </div>
                    ),
                }}
            />
        </>
    );
}
