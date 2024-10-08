import React from "react";

const AdminDetail = ({ name, role, imgSrc }) => (
    <div className="flex gap-4 self-stretch mt-11 text-neutral-800">
        <img
            loading="lazy"
            src={imgSrc}
            alt={`${name}'s profile`}
            className="shrink-0 aspect-square w-[42px]"
        />
        <div className="flex flex-col grow shrink-0 self-start mt-1.5 basis-0 w-fit">
            <div className="text-lg font-bold">{name}</div>
            <div className="mt-2.5 text-sm">{role}</div>
        </div>
    </div>
);

const InputSection = ({ label }) => (
    <div className="justify-center items-start px-3.5 py-7 mt-4 max-w-full text-base font-semibold whitespace-nowrap rounded-md border border-solid border-neutral-300 text-neutral-500 w-[383px]">
        {label}
    </div>
);

function MyComponent({ closeModal }) {
    return (
        <div className="flex flex-col py-2.5 bg-white rounded-xl shadow-sm max-w-[442px]">
            <div className="flex gap-5 items-start self-center px-5 w-full text-2xl font-bold text-center max-w-[358px] text-neutral-800">
                <h1 className="flex-auto mt-3">Create Community</h1>
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7b77c09253656a3ffc8bb24077e80b9ca09c898cab83d812d65377e8cd246b40?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&"
                    alt="create community icon"
                    className="shrink-0 w-6 aspect-square"
                />
            </div>
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/308f3a82d2e18ae711ce0c48dc92a9a6f97bd094bbd1b13a31afe7a1f3c3e42d?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&"
                alt=""
                className="mt-4 w-full border-2 border-solid border-neutral-200 stroke-[2px] stroke-neutral-200"
            />
            <section className="flex flex-col items-center px-6 mt-3 w-full">
                <div className="flex justify-center items-center px-16 py-12 bg-gray-200 rounded-xl">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/695c2762dafef1663f0af2b10d005988ba39b614230b2d0c86f61d54a699fb09?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&"
                        alt=""
                        className="aspect-square w-[58px]"
                    />
                </div>
                <h2 className="self-stretch mt-7 text-3xl font-bold text-stone-300">
                    Community Name
                </h2>
                <AdminDetail
                    name="Aisyah binte Musa"
                    role="Admin"
                    imgSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/9e3426aab2a5b601563e283b1896b22b6810f369eae3b34c34541ad48c77f74a?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&"
                />
                <div className="flex gap-5 justify-between items-start px-4 py-7 mt-5 text-base font-semibold whitespace-nowrap rounded-md border border-solid border-neutral-300 text-neutral-500">
                    <div>Type</div>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd1597f46df2a788aade9269dc18dedcae01d964986bf9099e8878478770c76d?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&"
                        alt=""
                        className="shrink-0 aspect-[1.89] fill-neutral-800 w-[15px]"
                    />
                </div>
                <InputSection label="Description" />
                <InputSection label="Add Admin" />
                <InputSection label="Invite People" />
                <div className="flex gap-5 justify-between self-end mt-5 text-sm text-center whitespace-nowrap">
                    <button
                        className="my-auto font-semibold text-neutral-800"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button className="justify-center px-7 py-4 font-bold text-white bg-secondary rounded-3xl">
                        Create
                    </button>
                </div>
            </section>
        </div>
    );
}

export default MyComponent;
