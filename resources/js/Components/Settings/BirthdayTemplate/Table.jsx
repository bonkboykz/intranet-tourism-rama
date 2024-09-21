import { useEffect } from "react";
import { useState } from "react";
import { Fragment } from "react";
import { Switch } from "@headlessui/react";
import axios from "axios";

import { cn } from "@/Utils/cn";

export const BirthdayTemplateTable = () => {
    const [birthdayTemplates, setBirthdayTemplates] = useState([]);

    const fetchBirthdayTemplates = () => {
        axios.get("/api/birthday-templates").then((response) => {
            const data = response.data.data.map((template) => ({
                ...template,
                background: template.background.incldues("/assets")
                    ? template.background
                    : `/storage/${template.background}`,
            }));

            setBirthdayTemplates(data);
        });
    };

    const handleSwitchChange = (template) => {
        axios
            .put(`/api/birthday-templates/${template.id}/toggle-enabled`)
            .then(() => {
                fetchBirthdayTemplates();
            });
    };

    useEffect(() => {
        fetchBirthdayTemplates();
    }, []);

    return (
        <div
            className="grid grid-cols-4 gap-4"
            style={{
                gridTemplateColumns: "3fr 2fr 1fr 1fr",
            }}
        >
            {birthdayTemplates.map((template) => (
                <Fragment key={template.id}>
                    <div>{template.name}</div>
                    <div>
                        <img
                            src={`/storage/${template.background}`}
                            className="w-12 h-9 rounded-lg mb-1.5"
                            alt={`image ${template.id}`}
                        />
                    </div>
                    <div>
                        <Switch
                            checked={template.is_enabled}
                            onChange={() => handleSwitchChange(template)}
                            className={cn(
                                template.is_enabled
                                    ? "bg-blue-500"
                                    : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    template.is_enabled
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                                )}
                            />
                        </Switch>
                    </div>
                    <div>
                        {/* <button>
                            <img
                                className="w-6 h-6 mr-2"
                                src="/assets/deleteicon.svg"
                                alt="Delete"
                            />
                        </button> */}
                    </div>
                </Fragment>
            ))}
        </div>
    );
};
