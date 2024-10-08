export function UserInfo({ name, titles, isActive }) {
    const titleArray = titles.split(",").map((title) => title.trim());

    return (
        <div className="flex flex-col ml-2">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{name}</h2>
                {isActive && (
                    <span className="font-semibold text-secondary text-l">
                        (Deactivated)
                    </span>
                )}
            </div>
            <div className="text-xs font-medium">
                {titleArray.map((title, index) => (
                    <p key={index}>{title}</p>
                ))}
            </div>
        </div>
    );
}
