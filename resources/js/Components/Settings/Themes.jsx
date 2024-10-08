import React, { useEffect, useState } from "react";
import axios from "axios";

import { useTheme } from "@/Utils/hooks/useTheme";
import { toastError } from "@/Utils/toast";

const ImageGrid = ({ images, altTexts, onImageClick, selectedImage }) => (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {images.map((src, index) => (
            <div
                key={index}
                className={`relative cursor-pointer ${
                    selectedImage === src ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => onImageClick(src, index + 1)}
            >
                <img
                    loading="lazy"
                    src={src}
                    alt={altTexts[index]}
                    className="w-full aspect-square"
                />
                {selectedImage === src && (
                    <img
                        src="assets/red-tick-select.svg"
                        alt="Selected"
                        className="absolute w-4 h-4 top-2 right-3"
                    />
                )}
            </div>
        ))}
    </div>
);

const images1 = [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/972033d7958552cb31c869fdebe33a7acc4a9f9919b3947a9fb97cb4d9ea8801?apiKey=285d536833cc4168a8fbec258311d77b&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/593e8551ea6875ce30fc60bae3b6965543240bc37d09dc61b61c3566d989c7b8?apiKey=285d536833cc4168a8fbec258311d77b&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/7396e07caa8a440244eef73e4ed2d99765f858ee6546d98cc5359862ac951cdd?apiKey=285d536833cc4168a8fbec258311d77b&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/35e6905b2b569c758e645cfca82d85f8f13819a6d417afe0b83ce6b7953a76bc?apiKey=285d536833cc4168a8fbec258311d77b&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/f4dcc2b582498c4d048fd2ddd1321d4caa1f0a1b57227672464e2c2c8752687a?apiKey=285d536833cc4168a8fbec258311d77b&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/fa56425df96b396350ea0b7b409c9570d081fd64e250918cd846cdaa29d15f72?apiKey=285d536833cc4168a8fbec258311d77b&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/2a16dcdce82e30a3f83f8206fb4c7ad009e759b69d7b5d5e5ac4be5fd536c026?apiKey=285d536833cc4168a8fbec258311d77b&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/6ad517ff12d1d0875c89f413cf180d327f505bca589d778be0d181d65820d229?apiKey=285d536833cc4168a8fbec258311d77b&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/33924e30099ac7022aa4882a9319b32e10b12023f437b5caddfa44747d67fb33?apiKey=285d536833cc4168a8fbec258311d77b&",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/5d038602c185600957c1312e6a175db13e29aad612c782932948c2ec4bd0d530?apiKey=285d536833cc4168a8fbec258311d77b&",
];

const altTexts = [
    "Image 1 description",
    "Image 2 description",
    "Image 3 description",
    "Image 4 description",
    "Image 5 description",
    "Image 6 description",
    "Image 7 description",
    "Image 8 description",
    "Image 9 description",
    "Image 10 description",
    "Image 11 description",
    "Image 12 description",
];

const ThemeComponent = ({ onSave }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const userTheme = useTheme();

    useEffect(() => {
        if (!userTheme) {
            return;
        }

        const [, id] = userTheme.split("-");

        const intId = parseInt(id);

        if (intId > 0 && intId <= images1.length) {
            setSelectedImage(images1[intId - 1]);
            setSelectedId(intId);
        }
    }, [userTheme]);

    const handleImageClick = (src, id) => {
        setSelectedImage((prevSelectedImage) =>
            prevSelectedImage === src ? null : src
        );
        setSelectedId((prevSelectedId) => (prevSelectedId === id ? null : id));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(
                "/api/settings/user-preferences/theme",
                {
                    theme: `theme-${selectedId}`,
                }
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to save theme.");
            }

            window.location.reload();
        } catch (e) {
            toastError("Failed to save theme.");
        }

        onSave(selectedImage);
    };

    return (
        <section className="flex flex-col px-5 py-8 bg-white rounded-2xl shadow-custom max-w-[700px]">
            <h2 className="text-2xl font-bold text-neutral-800 max-md:max-w-full">
                Customize your theme
            </h2>
            <div className="mt-8">
                <ImageGrid
                    images={images1}
                    altTexts={altTexts}
                    onImageClick={handleImageClick}
                    selectedImage={selectedImage}
                />
            </div>
            <button
                onClick={handleSave}
                className="px-4 py-2 mt-5 text-white bg-primary rounded hover:bg-primary-hover"
            >
                Save
            </button>
        </section>
    );
};

export default ThemeComponent;
