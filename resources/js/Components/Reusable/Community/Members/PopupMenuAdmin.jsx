export const PopupMenuAdmin = ({
    onAssign,
    onRemove,
    canAssignAdmin,
    canRemoveMember,
}) => {
    return (
        <div className="relative">
            <div className="absolute right-0 z-50 bg-white border shadow-lg w-[190px] rounded-xl -mt-3">
                {canAssignAdmin && (
                    <button
                        onClick={onAssign}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-t-xl"
                    >
                        <img
                            src="/assets/personIcon.svg"
                            alt="Assign"
                            className="w-6 h-6 mr-2"
                        />
                        Demote to Member
                    </button>
                )}
                {canRemoveMember && (
                    <button
                        onClick={onRemove}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-b-xl"
                    >
                        <img
                            src="/assets/🦆 icon _image_.svg"
                            alt="Remove"
                            className="w-6 h-6 mr-2"
                        />
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
};
