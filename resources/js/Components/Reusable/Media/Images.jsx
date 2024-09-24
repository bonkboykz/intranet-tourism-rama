import React, { useEffect, useState } from "react";

// Image component that accepts an onClick handler
const ImageComponent = ({ src, alt, className, onClick }) => (
    <img
        loading="lazy"
        src={src}
        alt={alt}
        className={className}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
        onClick={onClick}
    />
);

// Modal component that displays an image and closes on clicking outside of the image
const Modal = ({ imgSrc, alt, onClose }) => {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            onClick={onClose}
        >
            <div className="relative">
                <img
                    src={imgSrc}
                    alt={alt}
                    className="max-w-full max-h-full"
                    onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking on the image
                />
                <button
                    className="absolute top-0 right-0 mt-2 mr-2 text-white text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

// Main Image component that handles image fetching and modal logic
function Image({ selectedItem }) {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        // Fetch images from the API
        fetch("/api/crud/resources")
            .then((response) => response.json())
            .then((data) => {
                const imagePaths = data.data.data
                    .filter((item) => {
                        const fileExtension = item.path
                            .split(".")
                            .pop()
                            .toLowerCase();
                        return [
                            "jpg",
                            "jpeg",
                            "png",
                            "gif",
                            "bmp",
                            "webp",
                        ].includes(fileExtension);
                    })
                    .map((item) => ({
                        src: `/storage/${item.path}`,
                        alt: `Description ${item.id}`,
                        category: item.attachable_type,
                    }));
                setImages(imagePaths);
            })
            .catch((error) => console.error("Error fetching images:", error));
    }, []);

    // Filter images based on the selected item (category)
    const filteredImages =
        selectedItem === "All"
            ? images
            : images.filter((image) => image.category === selectedItem);

    return (
        <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-2xl shadow-lg mt-4">
            <header>
                <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-2">
                    Images
                </h1>
                <hr className="underline" />
            </header>
            <section className="mt-8 max-md:max-w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredImages.length > 0 ? (
                        filteredImages.map((img, index) => (
                            <figure key={index} className="flex flex-col">
                                <ImageComponent
                                    src={img.src}
                                    alt={img.alt}
                                    className="grow shrink-0 w-full h-full cursor-pointer"
                                    onClick={() => {
                                        console.log("Image clicked:", img); // Verify click event
                                        setSelectedImage(img); // Set selected image for modal
                                    }}
                                />
                            </figure>
                        ))
                    ) : (
                        <p>No Images available...</p>
                    )}
                </div>
            </section>

            {/* Modal for enlarged image */}
            {selectedImage && (
                <Modal
                    imgSrc={selectedImage.src}
                    alt={selectedImage.alt}
                    onClose={() => setSelectedImage(null)} // Close modal on outside click
                />
            )}
        </section>
    );
}

export default Image;
