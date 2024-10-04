import { useEffect, useState } from "react";
import axios from "axios";

import { useUser } from "@/Layouts/useUser";

import { PollCard } from "./PollCard";

export function Polls() {
    const { user } = useUser();

    const [userPolls, setUserPolls] = useState([]);

    const fetchUserPolls = async () => {
        try {
            const response = await axios.get(
                `/api/posts/users/${user.id}/polls`
            );

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to fetch user polls");
            }

            const responseData = response.data.data;

            console.log(responseData);

            const sortedPolls = responseData.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            setUserPolls(sortedPolls);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUserPolls();
    }, []);

    return userPolls.map((post) => <PollCard key={post.id} post={post} />);
}
