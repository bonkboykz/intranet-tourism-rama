import * as React from "react";

function AdminItem({ name, src, imgSrc }) {
    return (
        <div className="flex gap-5 justify-between mt-4 w-full text-base font-semibold whitespace-nowrap text-neutral-800">
            <div className="flex gap-5">
                <img
                    loading="lazy"
                    src={src}
                    alt={`${name}'s avatar`}
                    className="shrink-0 w-11 aspect-square"
                />
                <span className="my-auto">{name}</span>
            </div>
            <img
                loading="lazy"
                src={imgSrc}
                alt=""
                className="shrink-0 my-auto aspect-square w-[26px]"
            />
        </div>
    );
}

function ViewAdminPopup({ onClose }) {
    const admins = [
        {
            name: "Thomas",
            src: "https://cdn.builder.io/api/v1/image/assets/TEMP/1fdbe0bd9a26f66e926782a2da69fb8cd9a4d52300c29e396a860b8837d19618?apiKey=285d536833cc4168a8fbec258311d77b&",
            imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9f7f14d52016d0fc4191b1e1a156d5637e02082b2f444ede045b25ff987d9bd3?apiKey=285d536833cc4168a8fbec258311d77b&",
        },
        {
            name: "Sarah",
            src: "https://cdn.builder.io/api/v1/image/assets/TEMP/eddc519961147aa3768569e2be87753c24a49d71f48a08df534f6c9d813c3db3?apiKey=285d536833cc4168a8fbec258311d77b&",
            imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9f7f14d52016d0fc4191b1e1a156d5637e02082b2f444ede045b25ff987d9bd3?apiKey=285d536833cc4168a8fbec258311d77b&",
        },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white rounded-xl shadow-custom w-[245px] h-[267px]">
                <div className="flex flex-col pt-3.5 pb-6 bg-white rounded-xl shadow-custom px-5">
                    <h1 className="text-left text-xl font-bold text-neutral-800">
                        View Admin
                    </h1>
                    {admins.map((admin, index) => (
                        <AdminItem
                            key={index}
                            name={admin.name}
                            src={admin.src}
                            imgSrc={admin.imgSrc}
                        />
                    ))}
                    <div className="flex mt-5">
                        <div
                            tabIndex="0"
                            role="button"
                            className="justify-center items-center px-2 text-sm font-bold text-center text-white whitespace-nowrap bg-primary rounded-3xl h-[23px] w-[23px]"
                        >
                            +
                        </div>
                        <span className="flex-auto my-auto text-base text-left px-2 font-semibold text-neutral-800">
                            Add Admin
                        </span>
                    </div>
                    <div className="flex gap-5 self-end mt-5 text-sm text-center whitespace-nowrap">
                        <span
                            className="my-auto px-4 py-1 font-semibold text-neutral-800 w-[65px] h-[28px]"
                            tabIndex="0"
                            role="button"
                            onClick={onClose}
                        >
                            Cancel
                        </span>
                        <button className="flex flex-col justify-center font-bold text-white">
                            <span className="justify-center px-4 py-1 bg-primary rounded-3xl w-[65px] h-[28px]">
                                Save
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewAdminPopup;
