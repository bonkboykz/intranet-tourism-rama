import { useEffect, useState } from "react";

export function useUserData(id) {
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
        fetchUserData(id);
    }, [id]);

    return userData;
}
