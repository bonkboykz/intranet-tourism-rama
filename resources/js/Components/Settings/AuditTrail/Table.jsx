import { useState } from "react";
import { useEffect } from "react";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 25;

export function AuditTrailTable({ search = "", startDate = "", endDate = "" }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [items, setItems] = useState([]);

    const debouncedSearch = useDebounce(search, 500);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`/api/audits`, {
                params: {
                    page: currentPage,
                    perpage: ITEMS_PER_PAGE,
                    sort: [
                        {
                            created_at: "desc",
                        },
                    ],
                    ...(debouncedSearch && { search: debouncedSearch }),
                    ...(startDate && { start_date: startDate }),
                    ...(endDate && { end_date: endDate }),
                },
            });
            const data = response.data.data;

            setTotalPages(data.last_page);
            setItems(
                data.data.map((item) => {
                    return {
                        ...item,
                        auditable_type: item.auditable_type.replace(
                            /Modules\\.*\\Models\\/,
                            ""
                        ),
                    };
                })
            );
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [currentPage, debouncedSearch, startDate, endDate]);

    const handlePageChange = (newPage) => {
        if (newPage > totalPages) {
            return;
        }

        if (newPage < 1) {
            return;
        }

        setCurrentPage(newPage);
    };

    return (
        <div className="flex flex-col w-full px-5 py-4 mt-5 bg-white rounded-2xl shadow-custom">
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 divide-y divide-gray-200 table-fixed">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="w-1/12 px-2 py-3 font-medium text-left border border-gray-300 text-md text-neutral-900"
                            >
                                #
                            </th>
                            <th
                                scope="col"
                                className="w-2/12 px-2 py-3 font-medium text-left border border-gray-300 text-md text-neutral-900"
                            >
                                Date/Time
                            </th>
                            <th
                                scope="col"
                                className="w-2/12 px-2 py-3 font-medium text-left border border-gray-300 text-md text-neutral-900"
                            >
                                Username
                            </th>
                            <th
                                scope="col"
                                className="w-7/12 px-2 py-3 font-medium text-left border border-gray-300 text-md text-neutral-900"
                            >
                                Action made
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-2 py-4 text-sm border border-gray-300 whitespace-nowrap text-neutral-900">
                                    {item.id}
                                </td>
                                <td className="px-2 py-4 text-sm border border-gray-300 whitespace-nowrap text-neutral-900">
                                    {format(new Date(item.created_at), "PPpp")}
                                </td>
                                <td className="px-2 py-4 text-sm border border-gray-300 whitespace-nowrap text-neutral-900">
                                    {item.user?.name}
                                </td>
                                <td className="px-2 py-4 text-sm border border-gray-300 whitespace-nowrap text-neutral-900">
                                    {item.user?.name} {item.event}{" "}
                                    {item.auditable_type}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <nav className="flex items-center justify-between px-4 mt-4 border-t border-gray-200 sm:px-0">
                <div className="flex flex-1 w-0 -mt-px">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="inline-flex items-center pt-4 pr-1 text-sm font-medium border-t-2 border-transparent text-neutral-900 hover:border-gray-300 hover:text-gray-700"
                    >
                        <ArrowLongLeftIcon
                            className="w-5 h-5 mr-3 text-gray-400"
                            aria-hidden="true"
                        />
                        Previous
                    </button>
                </div>
                <div className="hidden md:-mt-px md:flex">
                    <span className="inline-flex items-center pt-4 pr-4 text-sm font-medium text-neutral-900">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
                <div className="flex justify-end flex-1 w-0 -mt-px">
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="inline-flex items-center pt-4 pl-1 text-sm font-medium border-t-2 border-transparent text-neutral-900 hover:border-gray-300 hover:text-gray-700"
                    >
                        Next
                        <ArrowLongRightIcon
                            className="w-5 h-5 ml-3 text-gray-400"
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </nav>
        </div>
    );
}
