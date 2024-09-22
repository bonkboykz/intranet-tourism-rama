import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

import { toastError } from "../toast";

export const useLoading = (url, params = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get(url, {
                params: {
                    ...params,
                },
            });
            const data = response.data.data;
            setData(data);
        } catch (error) {
            setError(error);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        isLoading,
        data,
        error,
    };
};

export const useLazyLoading = (url, params = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            console.log("PARAMS", params);
            const response = await axios.get(url, {
                params: {
                    page: currentPage,
                    ...params,
                },
            });

            if (![200, 201, 204].includes(response.status)) {
                throw new Error("Failed to fetch data");
            }

            const fetchedData = response.data.data;
            const { last_page } = fetchedData;
            const items = fetchedData.data;

            const deduplicatedItems = items.filter((item) => {
                return !data.some((d) => d.id === item.id);
            });

            setData((prevData) => [...prevData, ...deduplicatedItems]);
            setTotalPages(last_page);
        } catch (error) {
            console.error(error);
            setError(error);

            toastError("Failed to fetch data");
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return {
        isLoading,
        data,
        error,
        currentPage,
        totalPages,
        hasMore: currentPage < totalPages,
        nextPage: handleNextPage,
        prevPage: handlePrevPage,
    };
};
