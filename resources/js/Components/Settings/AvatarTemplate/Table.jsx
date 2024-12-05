import React, { Fragment } from "react";
import { Switch } from "@headlessui/react";

import { cn } from "@/Utils/cn";

export const AvatarTemplateTable = ({
    avatarTemplates,
    handleSwitchChange,
    isDeletePopupOpen,
}) => {
    return (
        <div
            className="grid grid-cols-4 gap-4"
            style={{
                gridTemplateColumns: "3fr 2fr 1fr 1fr",
            }}
        >
            {avatarTemplates.map((avatar) => (
                <Fragment key={avatar.id}>
                    <div className="items-center flex font-bold">
                        {avatar.name}
                    </div>
                    <div>
                        <img
                            src={avatar.background}
                            className="w-[45px] h-[45px] rounded-lg mb-1.5"
                            alt={`image ${avatar.id}`}
                        />
                    </div>

                    <div>
                        <Switch
                            checked={avatar.is_enabled}
                            onChange={() => handleSwitchChange(avatar)}
                            className={cn(
                                avatar.is_enabled
                                    ? "bg-primary"
                                    : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    avatar.is_enabled
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                                )}
                            />
                        </Switch>
                    </div>
                    <div className="flex w-full justify-center items-start">
                        <button onClick={() => isDeletePopupOpen(avatar.id)}>
                            <img
                                className="w-6 h-6 mr-2"
                                src="/assets/deleteicon.svg"
                                alt="Delete"
                            />
                        </button>
                    </div>
                </Fragment>
            ))}
        </div>
    );
};
