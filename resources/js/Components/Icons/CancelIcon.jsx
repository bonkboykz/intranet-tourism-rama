export const CancelIcon = ({
    alt = "Cancel icon",
    onClick,
    className,
    style,
    variant = "1",
    props,
}) => {
    if (variant == "2") {
        return (
            <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M1 1L11 11M1 11L11 1"
                    stroke="#4780FF"
                    strokeLinecap="round"
                />
            </svg>
        );
    } else {
        return (
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={onClick}
                className={className}
                style={{ cursor: "pointer", ...style }}
                {...props}
            >
                <circle cx="10" cy="10" r="10" fill="#CCCBCB" />
                <path
                    d="M5 5L15 15M5 15L15 5"
                    stroke="white"
                    strokeLinecap="round"
                />
            </svg>
        );
    }
};
