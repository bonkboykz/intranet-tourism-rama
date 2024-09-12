import { usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";

export function useUserData() {
    const {
        props: {
            auth: { user },
        },
    } = usePage();
    const [userData, setUserData] = useState({});

    const fetchUserData = async (id) => {
        try {
            const response = await axios.get(`/api/users/users/${id}`, {
                params: {
                    // ?with[]=profile&with[]=employmentPost.department&with[]=employmentPost.businessPost
                    with: [
                        "profile",
                        "employmentPost.department",
                        "employmentPost.businessPost",
                    ],
                },
            });

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Network response was not ok");
            }

            const { data } = response.data;
            setUserData({
                ...data,
                profileImage: data.profile?.image,
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData(user?.id);
    }, [user?.id]);

    return userData;
}

export default useUserData;
