export const truncate = (string, maxLength = 100, end = "...") => {
    if (!string) {
        return null;
    }

    return string.length < maxLength
        ? string
        : string.substring(0, maxLength) + end;
};
