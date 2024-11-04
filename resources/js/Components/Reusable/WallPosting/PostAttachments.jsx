import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/Utils/cn";

import DOC from "../../../../../public/assets/Docs.svg";
import Excel from "../../../../../public/assets/ExcellIcon.svg";
import PDF from "../../../../../public/assets/PDFIcon.svg";
import PowerPoint from "../../../../../public/assets/PowerPointIcon.svg";
import RAR from "../../../../../public/assets/Raricon.png";
import TXT from "../../../../../public/assets/TXTIcon.png";
import ZIP from "../../../../../public/assets/Zipicon.png";

function PostAttachments({ attachments }) {
    const [showPopup, setShowPopup] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const openPopup = (index) => {
        setCurrentMediaIndex(index);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const imagesAndVideos = attachments.filter(
        (att) =>
            att.mime_type.startsWith("image/") ||
            att.mime_type.startsWith("video/")
    );

    const handleNext = () => {
        setCurrentMediaIndex((prev) => (prev + 1) % imagesAndVideos.length);
    };

    const handlePrev = () => {
        setCurrentMediaIndex(
            (prev) =>
                (prev - 1 + imagesAndVideos.length) % imagesAndVideos.length
        );
    };

    const handleKeyDown = (event) => {
        if (event.key === "ArrowRight") {
            handleNext();
        } else if (event.key === "ArrowLeft") {
            handlePrev();
        }
    };

    React.useEffect(() => {
        if (showPopup) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showPopup]);

    const renderImageOrVideo = (attachment, index, isMore = false) => (
        <div
            key={attachment.path}
            className={`attachment ${
                attachment.height > attachment.width ? "tall" : ""
            } ${isMore ? "relative" : ""} cursor-pointer`}
            onClick={() => openPopup(index)}
        >
            {attachment.mime_type.startsWith("image/") ? (
                <img
                    src={`/storage/${attachment.path}`}
                    alt="attachment"
                    className="w-full h-auto rounded-xl object-cover cursor-pointer"
                />
            ) : (
                <video
                    autoPlay
                    muted
                    controls
                    loop
                    className="w-full h-auto rounded-lg cursor-pointer"
                >
                    <source src={`/storage/${attachment.path}`} />
                    Your browser does not support the video tag.
                </video>
            )}
            {isMore && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-50 text-white font-semibold text-lg">
                    +{attachments.length - 4} more
                </div>
            )}
        </div>
    );

    const renderDocument = (attachment, index) => {
        const handleDownload = (e, attachment) => {
            e.preventDefault();
            const fileUrl = `/storage/${attachment.path}`;
            if (attachment.extension === "svg") {
                window.open(fileUrl, "_blank");
            } else {
                const link = document.createElement("a");
                link.href = `/storage/${attachment.path}`;
                link.download = attachment.metadata.original_name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        const handleView = (e, attachment) => {
            e.stopPropagation();
            const fileUrl = `/storage/${attachment.path}`;

            if (attachment.extension === "pdf") {
                window.open(fileUrl, "_blank");
            } else {
                handleDownload(e, attachment);
            }
        };

        return (
            <article
                key={index}
                className="flex gap-3 items-center py-1.5 px-4 mb-2 bg-gray-100 rounded-xl border-2 border-gray-200 max-w-[900px]"
                onClick={(e) => handleView(e, attachment)}
                style={{ cursor: "pointer" }}
            >
                <img
                    src={
                        attachment.extension === "pdf"
                            ? PDF
                            : attachment.extension === "docx" ||
                                attachment.extension === "doc"
                              ? DOC
                              : attachment.extension === "xlsx"
                                ? Excel
                                : attachment.extension === "pptx" ||
                                    attachment.extension === "ptx"
                                  ? PowerPoint
                                  : attachment.extension === "txt"
                                    ? TXT
                                    : attachment.extension === "rar"
                                      ? RAR
                                      : attachment.extension === "zip"
                                        ? ZIP
                                        : "path/to/default-icon.png"
                    }
                    style={{
                        width: "18px",
                        height: "18px",
                        objectFit: "contain",
                    }}
                    alt={`${attachment.extension} file`}
                />
                <div className="flex flex-col items-start flex-grow">
                    <span className="flex whitespace-normal items-center text-sm">
                        Download File
                    </span>
                </div>
                <img
                    src="/assets/downloadIconNo3.svg"
                    alt="Download Icon"
                    className="w-3.5 h-3.5 opacity-70 cursor-pointer hover:opacity-40"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(e, attachment);
                    }}
                />
            </article>
        );
    };

    const getGridClass = () => {
        const count = imagesAndVideos.length;
        if (count === 1) return "one";
        if (count === 2) return "two";
        if (count === 3) return "three";
        return "four";
    };

    if (imagesAndVideos.length === 3) {
        let tallestImageIndex = 0;
        let maxHeightRatio = 0;

        imagesAndVideos.forEach((attachment, index) => {
            if (attachment.mime_type.startsWith("image/")) {
                const heightRatio = attachment.height / attachment.width;
                if (heightRatio > maxHeightRatio) {
                    maxHeightRatio = heightRatio;
                    tallestImageIndex = index;
                }
            }
        });

        const [tallestImage] = imagesAndVideos.splice(tallestImageIndex, 1);
        imagesAndVideos.unshift(tallestImage);
    }

    const attachmentsToDisplay = imagesAndVideos.slice(0, 4);

    return (
        <>
            <div className={`attachment-grid ${getGridClass()}`}>
                {attachmentsToDisplay.map((attachment, index) => {
                    if (index === 3 && imagesAndVideos.length > 4) {
                        return renderImageOrVideo(attachment, index, true);
                    }
                    return renderImageOrVideo(attachment, index);
                })}
            </div>

            <div className="document-section mt-4">
                {attachments
                    .filter(
                        (att) =>
                            !att.metadata.mime_type.startsWith("image/") &&
                            !att.metadata.mime_type.startsWith("video/")
                    )
                    .map(renderDocument)}
            </div>

            {showPopup && (
                <div
                    onClick={closePopup}
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                >
                    <div className="flex flex-row w-full justify-center items-start px-8">
                        <div
                            className="bg-white lg:p-6 p-4 rounded-2xl max-w-3xl max-h-screen relative max-md:mx-4 max-md:w-full mx-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closePopup}
                                className="absolute top-2 right-2"
                            >
                                <img
                                    src="/assets/cancel.svg"
                                    alt="Close icon"
                                    className="ml-4 w-5 h-5"
                                />
                            </button>
                            <div className="flex justify-center w-full">
                                <div className="bg-gray-200 h-full w-full flex justify-center items-center">
                                    {imagesAndVideos[
                                        currentMediaIndex
                                    ].mime_type.startsWith("image/") ? (
                                        <img
                                            key={
                                                imagesAndVideos[
                                                    currentMediaIndex
                                                ].path
                                            }
                                            src={`/storage/${
                                                imagesAndVideos[
                                                    currentMediaIndex
                                                ].path
                                            }`}
                                            alt="Current attachment"
                                            className={cn(
                                                "object-contain rounded-none cursor-pointer",
                                                imagesAndVideos.length === 1 &&
                                                    "w-full h-auto"
                                            )}
                                            style={{
                                                maxWidth: "50vw",
                                                maxHeight: "70vh",
                                                display: "block",
                                                margin: "auto",
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <video
                                            key={
                                                imagesAndVideos[
                                                    currentMediaIndex
                                                ].path
                                            }
                                            controls
                                            autoPlay
                                            muted
                                            className="rounded-lg cursor-pointer"
                                            style={{
                                                maxWidth: "50vw",
                                                maxHeight: "70vh",
                                                display: "block",
                                                margin: "auto",
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <source
                                                src={`/storage/${
                                                    imagesAndVideos[
                                                        currentMediaIndex
                                                    ].path
                                                }`}
                                            />
                                            Your browser does not support the
                                            video tag.
                                        </video>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-start mt-4 overflow-x-scroll w-full">
                                {imagesAndVideos.length === 1
                                    ? null
                                    : imagesAndVideos.map(
                                          (attachment, index) => (
                                              <div
                                                  key={index}
                                                  className={cn(
                                                      `cursor-pointer mx-1 min-w-20 max-w-20 h-20`,
                                                      currentMediaIndex ===
                                                          index &&
                                                          "border-2 border-blue-500"
                                                  )}
                                                  onClick={() =>
                                                      setCurrentMediaIndex(
                                                          index
                                                      )
                                                  }
                                              >
                                                  {attachment.mime_type.startsWith(
                                                      "image/"
                                                  ) ? (
                                                      <img
                                                          src={`/storage/${attachment.path}`}
                                                          alt="Thumbnail"
                                                          className="w-full h-full object-cover rounded-lg"
                                                      />
                                                  ) : (
                                                      <video className="w-full h-full object-cover rounded-lg">
                                                          <source
                                                              src={`/storage/${attachment.path}`}
                                                          />
                                                      </video>
                                                  )}
                                              </div>
                                          )
                                      )}
                            </div>

                            <div className="flex justify-between mt-4 w-full">
                                <button
                                    onClick={handlePrev}
                                    className="transform bg-white rounded-full p-2"
                                >
                                    <ArrowLeft />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="transform bg-white rounded-full p-2"
                                >
                                    <ArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PostAttachments;
