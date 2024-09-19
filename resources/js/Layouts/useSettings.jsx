import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";

import { toastError } from "@/Utils/toast";

export const SettingsContext = createContext({
    settings: {},
    fetchSettings: () => {},
});

export const useSetupSettings = () => {
    const [settings, setSettings] = useState({});

    const fetchSettings = async () => {
        try {
            const response = await axios.get("/api/settings/settings");

            if ([200, 201, 204].includes(response.status)) {
                setSettings(response.data.data);
            }
        } catch (e) {
            console.error(e);

            toastError("Error fetching settings");
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return {
        settings,
        fetchSettings,
    };
};

export const useSettings = () => {
    return useContext(SettingsContext);
};
