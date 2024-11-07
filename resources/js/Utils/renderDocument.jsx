import DOC from "../../../public/assets/Docs.svg";
import Excel from "../../../public/assets/ExcellIcon.svg";
import PDF from "../../../public/assets/PDFIcon.svg";
import PowerPoint from "../../../public/assets/PowerPointIcon.svg";
import RAR from "../../../public/assets/Raricon.png";
import TXT from "../../../public/assets/TXTIcon.png";
import ZIP from "../../../public/assets/Zipicon.png";

export const renderDocument = (attachment, index, showName = false) => {
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
                    Download File{" "}
                    {showName && `(${attachment.metadata.original_name})`}
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
