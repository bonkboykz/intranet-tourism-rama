// import React, { useState, useEffect } from 'react';

// function ProfileIcons({ icon1, icon2, onEdit, user_id, onFormDataChange, onPhotoChange, onSave, onCancel }) {
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     // const [qrCodeSvg, setQrCodeSvg] = useState(null);

//     // useEffect(() => {
//     //     if (isPopupOpen) {
//     //         fetch(`/user/${user_id}/profile-qr`, {
//     //             headers: {
//     //                 'Accept': 'image/svg+xml',
//     //             }
//     //         })
//     //         .then(response => response.text())
//     //         .then(svgData => {
//     //             setQrCodeSvg(svgData);
//     //         })
//     //         .catch(error => {
//     //             console.error("Failed to fetch QR code SVG:", error);
//     //         });
//     //     }
//     // }, [isPopupOpen, user_id]);

//     const handleIcon2Click = (e) => {
//         e.stopPropagation();
//         setIsPopupOpen(true);
//     };

//     const handleIcon1Click = (e) => {
//       e.stopPropagation();
//       onEdit();
//   };

//     const closePopup = () => {
//         setIsPopupOpen(false);
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (!event.target.closest(".popup")) {
//                 closePopup();
//             }
//         };

//         if (isPopupOpen) {
//             document.addEventListener("click", handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener("click", handleClickOutside);
//         };
//     }, [isPopupOpen]);

//     const handleDownload = (e) => {
//         e.stopPropagation();
//         e.preventDefault();
//         const qrImage = 'assets/hehe.png';
//         const link = document.createElement('a');
//         link.href = qrImage;
//         link.download = 'qr-image.png';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const handleCopyLink = () => {
//         const qrCodeLink = "https://shattereddisk.github.io/rickroll/rickroll.mp4";
//         navigator.clipboard.writeText(qrCodeLink)
//             .then(() => {
//                 console.log("QR code link copied to clipboard:", qrCodeLink);
//                 window.alert("QR code link copied to clipboard!");
//             })
//             .catch((error) => {
//                 console.error("Failed to copy QR code link:", error);
//             });
//     };

//     return (
//         <div className="flex flex-row gap-2 items-center">
//             <button onClick={handleIcon1Click}>
//                 <img src={icon1} alt="Edit Icon" className="aspect-square w-[30px]" />
//             </button>
//             {icon2 && (
//                 <img
//                     src={icon2}
//                     alt="QR Code Icon"
//                     className="aspect-square w-[30px] h-[30px] cursor-pointer"
//                     onClick={handleIcon2Click}
//                 />
//             )}
//             {isPopupOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closePopup}>
//                     <div className="bg-white p-2 rounded-3xl shadow-custom max-w-md popup" onClick={(e) => e.stopPropagation()}>
//                         <img
//                             src="/assets/qrAcap.jpg"
//                             // src={`/user/17/profile-qr.svg`}
//                             alt="QR Code"
//                             className="mx-auto mx-4"
//                         />
//                         {/* {qrCodeSvg ? (
//                             <div
//                                 className="qr-code-svg"
//                                 dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
//                             />
//                         ) : (
//                             <p>Loading QR code...</p>
//                         )} */}
//                         <hr className="mb-4 w-full border-gray-300" />
//                         <div className="flex justify-between -mt-1 mx-20 max-md:mx-12 relative">
//                             <button onClick={handleDownload} className="text-white py-2">
//                                 <img src="/assets/DownloadIcon.png" alt="Download Icon" className="w-6 h-6 shrink-0" />
//                             </button>
//                             {/* <hr className="absolute top-0 right-52 h-full border-l border-red-300" /> */}
//                             <button onClick={handleCopyLink} className="text-white py-2">
//                                 <img src="/assets/CopyLinkIcon.png" alt="Copy Link Icon" className="w-6 h-6 shrink-0" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ProfileIcons;

// import React, { useState, useEffect } from 'react';
// import { jsPDF } from 'jspdf'; // Make sure you install jspdf using npm or yarn

// function ProfileIcons({ icon1, icon2, onEdit, user_id, user_name }) {
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [qrCodeSvg, setQrCodeSvg] = useState(null);

//     useEffect(() => {
//         if (isPopupOpen) {
//             fetch(`/user/${user_id}/profile-qr`, {
//                 headers: {
//                     'Accept': 'image/svg+xml',
//                 }
//             })
//             .then(response => response.text())
//             .then(svgData => {
//                 setQrCodeSvg(svgData);
//             })
//             .catch(error => {
//                 console.error("Failed to fetch QR code SVG:", error);
//             });
//         }
//     }, [isPopupOpen, user_id]);

//     const handleIcon2Click = (e) => {
//         e.stopPropagation();
//         setIsPopupOpen(true);
//     };

//     const handleIcon1Click = (e) => {
//       e.stopPropagation();
//       onEdit();
//   };

//     const closePopup = () => {
//         setIsPopupOpen(false);
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (!event.target.closest(".popup")) {
//                 closePopup();
//             }
//         };

//         if (isPopupOpen) {
//             document.addEventListener("click", handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener("click", handleClickOutside);
//         };
//     }, [isPopupOpen]);

//     const handleDownload = async (e) => {
//         e.stopPropagation();
//         e.preventDefault();

//         if (!qrCodeSvg) {
//             console.error("QR code SVG is not available.");
//             return;
//         }

//         // Create a jsPDF instance
//         const pdf = new jsPDF();

//         // Set the font size and add the user name
//         pdf.setFontSize(16);
//         pdf.text(`Name: ${user_name}`, 10, 20);

//         // Convert the SVG into an image
//         const canvas = document.createElement('canvas');
//         const svgBlob = new Blob([qrCodeSvg], { type: 'image/svg+xml;charset=utf-8' });
//         const url = URL.createObjectURL(svgBlob);

//         const img = new Image();
//         img.onload = () => {
//             canvas.width = img.width;
//             canvas.height = img.height;
//             const ctx = canvas.getContext('2d');
//             ctx.drawImage(img, 0, 0);

//             // Convert the canvas to a data URL
//             const imgData = canvas.toDataURL('image/png');

//             // Add the image to the PDF
//             pdf.addImage(imgData, 'PNG', 10, 30, img.width / 4, img.height / 4);

//             // Download the PDF
//             pdf.save(`${user_name} QR-Code.pdf`);

//             // Clean up
//             URL.revokeObjectURL(url);
//         };
//         img.src = url;
//     };

//     const handleCopyLink = () => {
//         const qrCodeLink = "https://shattereddisk.github.io/rickroll/rickroll.mp4";
//         navigator.clipboard.writeText(qrCodeLink)
//             .then(() => {
//                 console.log("QR code link copied to clipboard:", qrCodeLink);
//                 window.alert("QR code link copied to clipboard!");
//             })
//             .catch((error) => {
//                 console.error("Failed to copy QR code link:", error);
//             });
//     };

//     return (
//         <div className="flex flex-row gap-2 items-center">
//             <button onClick={handleIcon1Click}>
//                 <img src={icon1} alt="Edit Icon" className="aspect-square w-[30px]" />
//             </button>
//             {icon2 && (
//                 <img
//                     src={icon2}
//                     alt="QR Code Icon"
//                     className="aspect-square w-[30px] h-[30px] cursor-pointer"
//                     onClick={handleIcon2Click}
//                 />
//             )}
//             {isPopupOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closePopup}>
//                     <div className="bg-white p-2 rounded-3xl shadow-custom max-w-md popup" onClick={(e) => e.stopPropagation()}>
//                     {user_name}
//                         {qrCodeSvg ? (
//                             <div
//                                 className="qr-code-svg"
//                                 dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
//                             />
//                         ) : (
//                             <p>Loading QR code...</p>
//                         )}
//                         <hr className="mb-4 w-full border-gray-300" />
//                         <div className="flex justify-between -mt-1 mx-20 max-md:mx-12 relative">
//                             <button onClick={handleDownload} className="text-white py-2">
//                                 <img src="/assets/DownloadIcon.png" alt="Download Icon" className="w-6 h-6 shrink-0" />
//                             </button>
//                             <button onClick={handleCopyLink} className="text-white py-2">
//                                 <img src="/assets/CopyLinkIcon.png" alt="Copy Link Icon" className="w-6 h-6 shrink-0" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ProfileIcons;

import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf"; // Make sure you install jspdf using npm or yarn

function ProfileIcons({
    icon1,
    icon2,
    onEdit,
    user_id,
    user_name,
    user_title,
}) {
    console.log("TITLEEEDIANI APE", user_title);

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

    const handleDownload = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!qrCodeSvg) {
            console.error("QR code SVG is not available.");
            return;
        }

        const pdf = new jsPDF();

        // Load the logo image
        const logo = new Image();
        logo.src = "/assets/logo_tourism.png";

        const leftMargin = 40; // Left margin
        const rightMargin = 40; // Right margin
        const pageWidth = pdf.internal.pageSize.getWidth();
        const maxWidth = pageWidth - leftMargin - rightMargin; // Adjusted max width for text wrapping

        const nameLines = pdf.splitTextToSize(`${user_name}`, maxWidth);

        const lineHeight = 10; // Adjust line height as needed

        logo.onload = () => {
            const logoWidth = 70; // Adjust logo size as needed
            const logoHeight = 30;
            const logoXPosition = (pageWidth - logoWidth) / 2;
            const logoYPosition = 20;

            pdf.addImage(
                logo,
                "PNG",
                logoXPosition,
                logoYPosition,
                logoWidth,
                logoHeight
            );

            const marginTop = 40; // Adjust margin as needed
            let yPosition = logoYPosition + logoHeight + marginTop;

            pdf.setFontSize(24); // Larger font size for name
            pdf.setFont("helvetica", "bold"); // Bold font style

            // Add each line of the name text centered, with line spacing
            nameLines.forEach((line) => {
                pdf.text(line, pageWidth / 2, yPosition, { align: "center" });
                yPosition += lineHeight; // Move down for the next line
            });

            pdf.setFontSize(16);
            pdf.setFont("helvetica", "normal");
            pdf.text(`${user_title}`, pageWidth / 2, yPosition + 10, {
                align: "center",
            });

            const imageYPosition = yPosition + 40;

            const canvas = document.createElement("canvas");
            const svgBlob = new Blob([qrCodeSvg], {
                type: "image/svg+xml;charset=utf-8",
            });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                const imgData = canvas.toDataURL("image/png");

                const imageWidth = img.width / 2;
                const imageHeight = img.height / 2;
                const imageXPosition = (pageWidth - imageWidth) / 2;

                pdf.addImage(
                    imgData,
                    "PNG",
                    imageXPosition,
                    imageYPosition,
                    imageWidth,
                    imageHeight
                );

                pdf.save(`${user_name} QR-Code.pdf`);

                URL.revokeObjectURL(url);
            };
            img.src = url;
        };
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
                window.alert("QR code link copied to clipboard!");
            })
            .catch((error) => {
                console.error("Failed to copy QR code link:", error);
            });
    };

    return (
        <div className="flex flex-row gap-2 items-center">
            <button onClick={handleIcon1Click}>
                <img
                    src={icon1}
                    alt="Edit Icon"
                    className="aspect-square w-[30px]"
                />
            </button>
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

                            <div className="relative">
                                <img
                                    src="/assets/logo_tourism.png"
                                    alt="Tourism Logo"
                                    className="w-[80px] mt-[4px] h-auto align-middle absolute"
                                    style={{
                                        left: "50%",
                                        top: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />

                                {qrCodeSvg ? (
                                    <img
                                        src={qrCodeSvg}
                                        className="h-auto w-[256px]"
                                    />
                                ) : (
                                    <p>Loading QR code...</p>
                                )}
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
                                onClick={handleDownload}
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
