import React from "react";

const TaggedItem = ({ tag, onRemove }) => {
    return (
        <div className="flex flex-wrap">
            <div className="flex items-center px-3 py-1 bg-[#EBF5FF] rounded-lg">
                <span className="mr-2 text-[#4780FF]">{tag.name}</span>
                <button
                    className="text-[#4780FF]"
                    onClick={() => onRemove(tag)}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default TaggedItem;
