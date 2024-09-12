import { useState, useEffect } from "react";

const useUserData = () => {

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user");
                const data = await response.json();

                setUserData({
                    id: data.id,
                    isAdmin: data.isAdmin,
                });
            } catch (error) {
                console.error("Ошибка при получении данных пользователя:", error);
                setUserData({
                    id: null,
                    isAdmin: false,
                });
            }
        };

        fetchUserData();
    }, []);

    return userData;
};

export default useUserData;
