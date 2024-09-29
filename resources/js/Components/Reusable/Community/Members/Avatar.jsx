export function Avatar({ src, alt, className, status }) {
    let source = null;

    if (src.startsWith("staff_image/")) {
        source = `/storage/${src}`;
    } else if (src.startsWith("https") || src.startsWith("/")) {
        source = src;
    } else {
        source =
            src === "/assets/dummyStaffPlaceHolder.jpg"
                ? src
                : `/avatar/${src}`;
    }

    // const imageUrl = src === '/assets/dummyStaffPlaceHolder.jpg' ? src : `/avatar/full/${src}`;
    return (
        <div className="relative items-center justify-end h-16">
            <img loading="lazy" src={source} alt={alt} className={className} />
            {status === 1 && (
                <div className="absolute bottom-0 right-0 border-2 border-white bg-red-500 rounded-full w-[12px] h-[12px] mb-1"></div>
            )}
            {status === 2 && (
                <div className="absolute bottom-0 right-0 border-2 border-white bg-green-500 rounded-full w-[12px] h-[12px] mb-1"></div>
            )}
        </div>
    );
}
