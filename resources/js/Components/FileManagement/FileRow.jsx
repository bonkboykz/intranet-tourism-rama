import { useEffect } from "react";
import { useRef } from "react";

import PopupContent from "../Reusable/PopupContent";

export const FileRow = ({
    item,
    onRename,
    onDelete,
    onFileSelect,
    canEdit,
    isEditing,
    onStartEditing,
    onSaveEditing,
    setEditingName,
    onKeyDown,
    index,
    editingName,
    indexOfFirstItem,
    setEditingIndex,
}) => {
    const metadata = item.metadata || {};

    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setEditingIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <tr key={item.id}>
            <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-2 text-sm text-neutral-800 sm:pl-1 text-left overflow-hidden text-ellipsis">
                {isEditing ? (
                    <div ref={inputRef} className="flex items-center">
                        <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => onRename(index, editingName)}
                            onKeyDown={(e) => onKeyDown(e, index)}
                            className="text-sm text-neutral-800 text-opacity-80 mt-1 block w-full rounded-full p-2 border-2 border-stone-300 max-md:ml-4 overflow-hidden text-ellipsis"
                        />

                        <button
                            onClick={() => onRename(index, editingName)}
                            className="ml-2 text-blue-500"
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div
                        className="text-sm font-bold mt-1 block w-full rounded-md py-2 border-2 border-transparent text-neutral-800 text-opacity-80 overflow-hidden text-ellipsis"
                        onDoubleClick={() => {
                            if (!canEdit) {
                                return;
                            }

                            onStartEditing(index, metadata.original_name);
                        }}
                    >
                        {metadata.original_name || "Unknown"}
                    </div>
                )}
            </td>
            <td className="px-3 py-4 overflow-hidden text-sm border-b border-r border-neutral-300 whitespace-nowrap text-neutral-800 text-center text-ellipsis">
                {item.uploader || "Unknown"}
            </td>
            <td className="px-3 py-4 overflow-hidden text-sm border-b border-r border-neutral-300 whitespace-nowrap text-neutral-800 text-ellipsis">
                {new Date(item.created_at).toLocaleDateString()}
            </td>
            <td className="relative mt-6 z-100 flex">
                <PopupContent
                    file={item}
                    canEdit={canEdit}
                    onRename={() =>
                        onStartEditing(
                            indexOfFirstItem + index,
                            metadata.original_name
                        )
                    }
                    onDelete={onDelete}
                    onFileSelect={onFileSelect}
                />
            </td>
        </tr>
    );
};
