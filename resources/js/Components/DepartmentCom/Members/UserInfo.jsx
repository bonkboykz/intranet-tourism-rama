export function UserInfo({ name, role, isActive }) {
    return (
        <div className="flex flex-col ml-2">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{name} </h2>
                {isActive && (
                    <span className="font-semibold text-secondary text-l">
                        (Deactivated)
                    </span>
                )}
            </div>
            <p className="text-xs font-medium">{role}</p>
        </div>
    );
}
