import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf"; // Make sure you install jspdf using npm or yarn

import { toastError } from "@/Utils/toast";

function ProfileIcons({
    icon1,
    icon2,
    onEdit,
    user_id,
    user_name,
    user_title,
}) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [qrCodeSvg, setQrCodeSvg] = useState(null);
    const [qrCodeLink, setQrCodeLink] = useState(null); // Store the QR code link

    useEffect(() => {
        if (isPopupOpen) {
            fetch(`/api/profile/user/${user_id}/profile-qr`, {
                headers: {
                    Accept: "image/svg+xml",
                },
            })
                .then((response) => {
                    setQrCodeLink(response.url); // Save the link to use later
                    return response.text();
                })
                .then((svgData) => {
                    setQrCodeSvg(svgData);
                })
                .catch((error) => {
                    console.error("Failed to fetch QR code SVG:", error);
                });
        }
    }, [isPopupOpen, user_id]);

    const handleIcon2Click = (e) => {
        e.stopPropagation();
        setIsPopupOpen(true);
    };

    const handleIcon1Click = (e) => {
        e.stopPropagation();
        onEdit();
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".popup")) {
                closePopup();
            }
        };

        if (isPopupOpen) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isPopupOpen]);

    // const handleDownload = async (e) => {
    //     e.stopPropagation();
    //     e.preventDefault();

    //     console.log("Downloading QR code...");

    //     if (!qrCodeSvg) {
    //         console.error("QR code SVG is not available.");

    //         toastError("QR code is not available for download.");
    //         return;
    //     }

    //     const pdf = new jsPDF();

    //     return new Promise((resolve, reject) => {
    //         console.log("Creating PDF...");
    //         // Load the logo image
    //         const logo = new Image();
    //         logo.src = "/assets/logo_tourism.png";

    //         const leftMargin = 40; // Left margin
    //         const rightMargin = 40; // Right margin
    //         const pageWidth = pdf.internal.pageSize.getWidth();
    //         const maxWidth = pageWidth - leftMargin - rightMargin; // Adjusted max width for text wrapping

    //         const nameLines = pdf.splitTextToSize(`${user_name}`, maxWidth);

    //         const lineHeight = 10; // Adjust line height as needed

    //         logo.onload = () => {
    //             const logoWidth = 70; // Adjust logo size as needed
    //             const logoHeight = 30;
    //             const logoXPosition = (pageWidth - logoWidth) / 2;
    //             const logoYPosition = 20;

    //             pdf.addImage(
    //                 logo,
    //                 "PNG",
    //                 logoXPosition,
    //                 logoYPosition,
    //                 logoWidth,
    //                 logoHeight
    //             );

    //             const marginTop = 40; // Adjust margin as needed
    //             let yPosition = logoYPosition + logoHeight + marginTop;

    //             pdf.setFontSize(24); // Larger font size for name
    //             pdf.setFont("helvetica", "bold"); // Bold font style

    //             // Add each line of the name text centered, with line spacing
    //             nameLines.forEach((line) => {
    //                 pdf.text(line, pageWidth / 2, yPosition, {
    //                     align: "center",
    //                 });
    //                 yPosition += lineHeight; // Move down for the next line
    //             });

    //             pdf.setFontSize(16);
    //             pdf.setFont("helvetica", "normal");
    //             pdf.text(`${user_title}`, pageWidth / 2, yPosition + 10, {
    //                 align: "center",
    //             });

    //             const imageYPosition = yPosition + 40;

    //             const canvas = document.createElement("canvas");
    //             const svgBlob = new Blob([qrCodeSvg], {
    //                 type: "image/svg+xml;charset=utf-8",
    //             });
    //             const url = URL.createObjectURL(svgBlob);

    //             const img = new Image();
    //             img.onload = () => {
    //                 canvas.width = img.width;
    //                 canvas.height = img.height;
    //                 const ctx = canvas.getContext("2d");
    //                 ctx.drawImage(img, 0, 0);

    //                 const imgData = canvas.toDataURL("image/png");

    //                 const imageWidth = img.width / 2;
    //                 const imageHeight = img.height / 2;
    //                 const imageXPosition = (pageWidth - imageWidth) / 2;

    //                 pdf.addImage(
    //                     imgData,
    //                     "PNG",
    //                     imageXPosition,
    //                     imageYPosition,
    //                     imageWidth,
    //                     imageHeight
    //                 );

    //                 pdf.save(`${user_name} QR-Code.pdf`);

    //                 URL.revokeObjectURL(url);
    //             };
    //             img.src = url;

    //             resolve();
    //         };

    //         logo.onerror = (error) => {
    //             console.error("Failed to load logo:", error);
    //             reject(error);
    //         };
    //     });
    // };

    const handleDownload = async () => {
        const element = document.getElementById("qr-code");
        const canvas = await html2canvas(element, {
            width: 256,
            height: 256,
            // windowHeight: 256,
            // windowWidth: 256,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            x: 0,
            y: 0,
            // windowWidth: document.documentElement.offsetWidth,
            // windowHeight: document.documentElement.offsetHeight,
        });

        const pdf = new jsPDF("p", "mm", "a4");

        // add info about user
        const leftMargin = 40; // Left margin
        const rightMargin = 40; // Right margin
        const pageWidth = pdf.internal.pageSize.getWidth();
        const maxWidth = pageWidth - leftMargin - rightMargin; // Adjusted max width for text wrapping

        const nameLines = pdf.splitTextToSize(`${user_name}`, maxWidth);

        const lineHeight = 10;

        const marginTop = 40; // Adjust margin as needed
        let yPosition = marginTop;

        pdf.setFontSize(24); // Larger font size for name
        pdf.setFont("helvetica", "bold"); // Bold font style

        // Add each line of the name text centered, with line spacing
        nameLines.forEach((line) => {
            pdf.text(line, pageWidth / 2, yPosition, {
                align: "center",
            });
            yPosition += lineHeight; // Move down for the next line
        });

        pdf.setFontSize(16);
        pdf.setFont("helvetica", "normal");
        pdf.text(`${user_title}`, pageWidth / 2, yPosition + 10, {
            align: "center",
        });

        const imageYPosition = yPosition + 40;

        const imgData = canvas.toDataURL("image/png");

        const imageWidth = 256 / 2;
        const imageHeight = 256 / 2;
        const imageXPosition = (pageWidth - imageWidth) / 2;

        pdf.addImage(
            imgData,
            "PNG",
            imageXPosition,
            imageYPosition,
            imageWidth,
            imageHeight
        );

        // add qr code
        // pdf.addImage(imgData, "PNG", 50, 40, 110, 110);

        pdf.save(`${user_name} QR-Code.pdf`);

        // const image = canvas.toDataURL("image/png"); // Convert canvas to image format
        // const link = document.createElement("a"); // Create a link element
        // link.href = image; // Set the image as the link's href
        // link.download = "qr-code.png"; // Set the download attribute with filename
        // link.click(); // Programmatically trigger the link click
    };

    const handleCopyLink = () => {
        if (!qrCodeLink) {
            console.error("QR code link is not available.");
            return;
        }

        navigator.clipboard
            .writeText(qrCodeLink)
            .then(() => {
                console.log("QR code link copied to clipboard:", qrCodeLink);
                toast.success("QR code link copied to clipboard.");
            })
            .catch((error) => {
                console.error("Failed to copy QR code link:", error);
            });
    };

    return (
        <div className="flex flex-row gap-2 items-center">
            {icon1 && (
                <button onClick={handleIcon1Click}>
                    <img
                        src={icon1}
                        alt="Edit Icon"
                        className="aspect-square w-[30px]"
                    />
                </button>
            )}
            {icon2 && (
                <img
                    src={icon2}
                    alt="QR Code Icon"
                    className="aspect-square w-[30px] h-[30px] cursor-pointer"
                    onClick={handleIcon2Click}
                />
            )}
            {isPopupOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={closePopup}
                >
                    <div
                        className=" p-6 rounded-3xl shadow-custom max-w-md popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-lg font-bold text-gray-900">
                                <span className="font-bold text-center w-full flex justify-center">
                                    {user_name}
                                </span>
                            </p>
                            <p className="text-lg font-bold text-gray-900 mt-2">
                                <span className="font-normal">
                                    {user_title}
                                </span>
                            </p>

                            <div
                                className="relative"
                                id="qr-code"
                                style={{
                                    position: "relative",
                                    width: "256px",
                                    height: "256px",
                                }}
                            >
                                {qrCodeSvg ? (
                                    <img
                                        src={qrCodeSvg}
                                        alt="QR Code"
                                        style={{
                                            width: 256,
                                            height: 256,
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                        }}
                                    />
                                ) : (
                                    <p>Loading QR code...</p>
                                )}
                                <img
                                    src="/assets/logo_tourism.png"
                                    alt="Tourism Logo"
                                    style={{
                                        position: "absolute",
                                        width: "80px",
                                        height: "32px",
                                        left: "50%",
                                        top: "50%",
                                        transform: "translate(-50%, -50%)",
                                        zIndex: 1,
                                    }}
                                />
                            </div>
                        </div>

                        <hr className="mb-4 mt-4 w-full border-gray-300" />
                        <div className="flex w-full -mt-1 relative space-x-4">
                            <button
                                onClick={handleDownload}
                                className="bg-white hover:bg-blue-100 rounded-lg py-2 px-auto whitespace-nowrap flex w-full justify-center items-center"
                            >
                                <img
                                    src="/assets/downloadiconblue.svg"
                                    alt="Download Icon"
                                    className="w-6 h-6 shrink-0"
                                />
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className="bg-white hover:bg-blue-100 rounded-lg py-2 px-auto whitespace-nowrap flex w-full justify-center items-center"
                            >
                                <img
                                    src="/assets/copylinkiconblue.svg"
                                    alt="Copy Link Icon"
                                    className="w-6 h-6 shrink-0"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileIcons;
