import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export function useUserData() {
    const {
        props: {
            auth: { user },
        },
    } = usePage();
    const [userData, setUserData] = useState({});

    const fetchUserData = (id) => {
        fetch(
            `/api/users/users/${id}?with[]=profile&with[]=employmentPost.department&with[]=employmentPost.businessPost`,
            {
                method: "GET",
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(({ data }) => {
                setUserData({
                    ...data,
                    profileImage: data.profile?.image,
                });
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    };

    useEffect(() => {
        fetchUserData(user?.id);
    }, [user?.id]);

    return userData;
}

export default useUserData;
