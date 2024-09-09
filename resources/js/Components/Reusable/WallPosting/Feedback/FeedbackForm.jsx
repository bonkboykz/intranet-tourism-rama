export function FeedbackForm() {
    const [inputValue, setInputValue] = useState("");
    const textAreaRef = useRef(null);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleFeedbackClick = (event) => {
        event.preventDefault(); // Prevents the default form submission
        console.log("Sending Form...");
    };

    return (
        <form className="flex gap-3.5 mt-4 max-md:flex-wrap max-md:max-w-full">
            <textarea
                ref={textAreaRef}
                value={inputValue}
                onChange={handleChange}
                placeholder="Give Your Feedback"
                className="grow justify-center items-start px-5 py-3 text-sm leading-5 rounded-md border border-gray-100 border-solid text-neutral-800 text-opacity-50 w-fit max-md:px-5 max-md:max-w-full"
                rows="4"
                style={{ maxHeight: "30px", overflowY: "auto" }}
            />
            <button
                className="flex flex-col justify-center my-auto text-xs font-semibold leading-5 text-center text-white whitespace-nowrap px-6 py-2 bg-red-500 rounded-2xl max-md:px-5"
                onClick={handleFeedbackClick}
            >
                Send
            </button>
        </form>
    );
}
