import React, { useState } from "react";
import { useEffect } from "react";
// import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";

import { CancelIcon } from "@/Components/Icons/CancelIcon";

import ActionButtons from "./ActionButtons";
import SearchBar from "./SearchBar";
import TaggedItem from "./TaggedItem";

import "../css/InputBox.css";

const TagInput = ({ tag, setTag, onClose, onSave }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showWarning, setShowWarning] = useState(false); // State for showing the warning text
    const [albums, setAlbums] = useState([]);

    const fetchAlbums = async () => {
        try {
            const response = await axios.get("/api/album", {
                params: {
                    search: searchTerm,
                },
            });

            setAlbums(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // useDebounce(fetchAlbums, 200, [searchTerm]);

    useEffect(() => {
        fetchAlbums();
    }, [searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddTag = (selectedTag) => {
        if (tag.length > 0) {
            // If a tag is already selected, show the warning text
            setShowWarning(true);
        } else if (selectedTag && selectedTag.id !== tag.id) {
            setTag([selectedTag]);
            setShowWarning(false); // Hide warning if a new tag is selected
        }
    };

    const handleRemoveTag = () => {
        setTag([]);
        setShowWarning(false); // Hide warning when the tag is removed
    };

    // const filteredTags = predefinedTags.filter((tag) =>
    //     tag.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="flex flex-col font-semibold rounded-none w-screen mx-4 max-w-[442px] md:min-w-[400px] smd:w-full">
                <section className="flex flex-col pt-1.5 w-full bg-white rounded-2xl shadow-custom">
                    <div className="flex flex-row w-full items-center justify-between px-6 mt-4 mb-2">
                        <div className="text-2xl font-bold w-full">
                            Tag Album
                        </div>
                        <div className="w-full flex justify-end">
                            <img
                                src="assets/cancel.svg"
                                alt="Close icon"
                                className="w-6 h-6 sm:w-4 sm:h-4 md:w-6 md:h-6 cursor-pointer"
                                onClick={onClose}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col px-5 mt-0">
                        <SearchBar
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search tags"
                        />
                        <div className="mt-2" style={{ minHeight: "20px" }}>
                            {showWarning && (
                                <div className="text-red-600 text-sm">
                                    Oops! You can only select one tag per post.
                                </div>
                            )}
                        </div>
                        <div className="tags-container">
                            {albums.map((album, index) => (
                                <div key={album.id} className="tag">
                                    {album.name}
                                    <button onClick={() => handleAddTag(album)}>
                                        +
                                    </button>
                                </div>
                            ))}
                        </div>
                        <h2 className="self-start text-sm font-bold leading-none text-neutral-500 mb-0 mt-5">
                            Tagged
                        </h2>
                        <div
                            className="tagged-items-container"
                            style={{ minHeight: "30px" }}
                        >
                            {tag.length > 0 ? (
                                <TaggedItem
                                    tag={tag[0]}
                                    onRemove={handleRemoveTag}
                                />
                            ) : (
                                <div className="text-neutral-400 text-sm">
                                    No tag selected.
                                </div>
                            )}
                        </div>
                    </div>
                    <ActionButtons onSave={onSave} onCancel={onClose} />
                </section>
            </div>
        </div>
    );
};

export default TagInput;
