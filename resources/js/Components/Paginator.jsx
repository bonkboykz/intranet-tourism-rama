const Pagination = ({
    totalItems,
    itemsPerPage,
    paginate,
    currentPage,
    hasNextButton,
}) => (
    <div className="py-3 flex w-full justify-center">
        {hasNextButton && (
            <button
                disabled={!hasNextButton.prev_page_url}
                onClick={() => paginate((pv) => pv - 1)}
                className={`px-4 py-2 mx-1 rounded-lg ${hasNextButton.prev_page_url ? "text-primary" : "text-black-500"}`}
            >
                PREV
            </button>
        )}

        {Array.from(
            { length: Math.ceil(totalItems / itemsPerPage) },
            (_, i) => (
                <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`px-4 py-2 mx-1 rounded-lg ${currentPage === i + 1 ? "bg-blue-200 text-primary" : "bg-white text-primary"}`}
                >
                    {i + 1}
                </button>
            )
        )}
        {hasNextButton && (
            <button
                disabled={!hasNextButton.next_page_url}
                onClick={() => paginate((pv) => pv + 1)}
                className={`px-4 py-2 mx-1 rounded-lg ${hasNextButton.next_page_url ? "text-primary" : "text-black-500"}`}
            >
                NEXT
            </button>
        )}
    </div>
);

export default Pagination;
