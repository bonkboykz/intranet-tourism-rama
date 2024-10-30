import { toast } from "react-toastify";

export const PopupMenuAdmin = ({ onAssign, onRemove, isOnlyAdmin }) => {
    return (
        <div className="relative">
            <div className="absolute right-0 z-50 bg-white border shadow-lg w-[190px] rounded-xl -mt-3">
                <button
                    onClick={() => {
                        if (isOnlyAdmin) {
                            toast.error(
                                "A community group needs at least 1 admin.",
                                {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                }
                            );
                            return;
                        }
                        onAssign();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-t-xl"
                >
                    <img
                        src="/assets/personIcon.svg"
                        alt="Assign"
                        className="w-6 h-6 mr-2"
                    />
                    Demote to Member
                </button>
                <button
                    onClick={() => {
                        if (isOnlyAdmin) {
                            toast.error(
                                "A community group needs at least 1 admin.",
                                {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                }
                            );
                            return;
                        }
                        onRemove();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-b-xl"
                >
                    <img
                        src="/assets/🦆 icon _image_.svg"
                        alt="Remove"
                        className="w-6 h-6 mr-2"
                    />
                    Remove
                </button>
            </div>
        </div>
    );
};
