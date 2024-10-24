import { useRef } from "react";
import { useState } from "react";
import { useCallback } from "react";

export function useCursorPointer({ initialInputValue = "" }) {
    const [inputValue, setInputValue] = useState(initialInputValue);
    const [isMentioning, setIsMentioning] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [cursorPosition, setCursorPosition] = useState(0);

    const handleChange = useCallback((event) => {
        const value = event.target.value;
        const cursorPosition = event.target.selectionStart;
        const beforeCursor = value.slice(0, cursorPosition);

        // Check if the last character typed is a space
        const isSpaceTyped = beforeCursor.endsWith(" ");

        const mentionMatch = beforeCursor.match(/@(\w*)$/);

        if (mentionMatch && !isSpaceTyped) {
            setIsMentioning(true);
            setMentionQuery(mentionMatch[1]);
        } else {
            setIsMentioning(false);
            setMentionQuery("");
        }

        setInputValue(value);
        setCursorPosition(cursorPosition);

        recalculatePosition();
    }, []);

    const recalculatePosition = useCallback(() => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        const { selectionStart } = textarea; // Cursor position index

        // Get the position of the selected text within the textarea
        const textBeforeCursor = textarea.value.substring(0, selectionStart);
        const lines = textBeforeCursor.split("\n");
        const lineCount = lines.length;
        const charCountInLastLine = lines[lineCount - 1].length;

        // Get the textarea's bounding rectangle
        // const rect = textarea.getBoundingClientRect();

        // Calculate position of the cursor relative to the textarea's top-left corner
        const top = 20 + lineCount * 20; // Approximate line height
        const left = charCountInLastLine * 8; // Approximate character width

        // Set the popover's position
        setPopoverPosition({ top, left });
    }, []);

    const textareaRef = useRef(null); // Ref to capture the textarea
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

    const resetMentioning = useCallback(() => {
        setIsMentioning(false);
        setMentionQuery("");
    }, []);

    return {
        popoverPosition,
        textareaRef,
        handleChange,
        inputValue,
        cursorPosition,
        isMentioning,
        mentionQuery,
        resetMentioning,
        setCursorPosition,
        setInputValue,
    };
}
