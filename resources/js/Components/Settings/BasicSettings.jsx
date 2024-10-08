import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import { useSettings } from "@/Layouts/useSettings";
import { toastError } from "@/Utils/toast";

function FileInputSection({ onFileSelect, imageSrc }) {
    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleFileChange = async (event) => {
        console.log(event);
        if (event.target.files.length <= 0) {
            // onFileSelect(URL.createObjectURL(event.target.files[0]));
            return;
        }

        const imageBase64 = await blobToBase64(event.target.files[0]);
        onFileSelect(imageBase64);
    };

    return (
        <section className="flex gap-2.5 mt-5 text-center">
            <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
            />
            <button
                onClick={() => document.getElementById("fileInput").click()}
                className="justify-center px-2 py-1.5 text-xs font-bold text-white bg-primary rounded-3xl"
            >
                Choose file
            </button>
            {!imageSrc && (
                <span className="flex-auto my-auto text-xs font-medium text-opacity-50 text-neutral-800">
                    No file Chosen
                </span>
            )}
        </section>
    );
}

function ImageSection({ imageSrc, onDelete }) {
    return (
        <section className="flex gap-5 justify-between mt-3.5">
            <figure className="flex justify-center items-center w-[190px] h-[50px] rounded-xl border border-solid border-neutral-200 overflow-hidden">
                {imageSrc ? (
                    <img
                        loading="lazy"
                        src={imageSrc}
                        alt="Uploaded"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span className="text-xs text-neutral-800">No image</span>
                )}
            </figure>
            <div className="flex items-end">
                <img
                    onClick={onDelete}
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/afe3477ad4cf3bf53704463467275bf23818a2768045ef6be28ddcea6fc246d6?apiKey=285d536833cc4168a8fbec258311d77b&"
                    alt="Delete icon"
                    className={`aspect-square w-[26px] cursor-pointer ${imageSrc ? "block" : "hidden"}`}
                />
            </div>
        </section>
    );
}

function LogoUploader() {
    const { settings, fetchSettings } = useSettings();

    const defaultImage =
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d910594555d57a5759d52dbe5805129dbfe12b92da0f4c976f19b7b63e76b9f8?apiKey=285d536833cc4168a8fbec258311d77b&";
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        setImageSrc(settings.logo || defaultImage);
    }, [settings.logo]);

    const handleFileSelect = (fileSrc) => {
        setImageSrc(fileSrc);
    };

    const handleDelete = () => {
        setImageSrc(null);
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(
                `/api/settings/settings/update_by_key/logo`,
                {
                    value: imageSrc,
                }
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Network response was not ok");
            }

            fetchSettings();
        } catch (e) {
            console.error(e);

            toastError("Error saving logo");
        }
    };

    if (!imageSrc) {
        return;
    }

    return (
        <article className="flex flex-col px-5 py-4 bg-white rounded-xl shadow-custom max-w-[296px]">
            <header>
                <h1 className="text-2xl font-bold text-neutral-800">
                    Jomla! Intranet Logo
                </h1>
            </header>
            <FileInputSection
                imageSrc={imageSrc}
                onFileSelect={handleFileSelect}
            />
            <ImageSection imageSrc={imageSrc} onDelete={handleDelete} />
            <button
                disabled={imageSrc === settings.logo}
                onClick={handleSave}
                className="self-center px-4 py-2 mt-5 text-white bg-primary rounded-full"
            >
                Save
            </button>
            {/* {savedImage && (
                <div className="mt-5">
                    <p className="text-sm text-neutral-800">Saved Image:</p>
                    <figure className="flex justify-center items-center w-[190px] h-[50px] rounded-2xl border border-solid border-neutral-200 overflow-hidden mt-2">
                        <img
                            src={savedImage}
                            alt="Saved"
                            className="object-cover w-full h-full"
                        />
                    </figure>
                </div>
            )} */}
        </article>
    );
}

export default LogoUploader;
