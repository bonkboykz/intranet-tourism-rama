export function Polls({ polls = [] }) {
    function calculatePercentage(pollId, optionIndex) {
        const poll = polls.find((p) => p.id === pollId);
        if (!poll) return 0;

        const totalVotes = poll.options.reduce(
            (acc, option) => acc + option.votes,
            0
        );
        const optionVotes = poll.options[optionIndex].votes;

        return totalVotes === 0
            ? 0
            : ((optionVotes / totalVotes) * 100).toFixed(2);
    }

    const handleVote = (pollId, optionIndex) => {
        setPollos((prevPolls) =>
            prevPolls.map((poll) => {
                if (poll.id === pollId) {
                    const updatedOptions = poll.options.map((option, i) =>
                        i === optionIndex
                            ? { ...option, votes: option.votes + 1 }
                            : option
                    );
                    return { ...poll, options: updatedOptions };
                }
                return poll;
            })
        );
    };

    return polls?.map(
        (poll) => (
            console.log("POLL", poll),
            (
                <div
                    className="input-box-container"
                    style={{ height: "auto", marginTop: "-10px" }}
                    key={poll.id}
                >
                    <article className="flex flex-col px-5 py-4 bg-white rounded-xl shadow-sm max-w-[610px] max-md:pl-5">
                        <div className="flex items-center">
                            <ProfileHeader
                                name="Fareez Hishamuddin"
                                timeAgo="1 day ago"
                                profileImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/726408370b648407cc55fec1ee24245aad060d459ac0f498438d167758c3a165?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                                profileImageAlt="Profile image of Thomas"
                            />
                            <img
                                loading="lazy"
                                src="/assets/wallpost-dotbutton.svg"
                                alt="Options"
                                className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer mt-1"
                                onClick={() => togglePopup(index)}
                            />
                        </div>
                        <div className="poll">
                            <h3>{poll.content}</h3>
                            <ul>
                                {poll.options.map((option, i) => (
                                    <li key={i}>
                                        <FeedbackOption
                                            optionText={`${option} (${calculatePercentage(
                                                poll.id,
                                                i
                                            )}%)`}
                                            onVote={() =>
                                                handleVote(poll.id, i)
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <FeedbackForm />
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d36c4e55abf5012ece1a90ed95737b46c9b6970a05e3182fdd6248adca09028e?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                            alt=""
                            className="mt-6 aspect-[4.55] w-[76px]"
                        />
                    </article>
                </div>
            )
            //profile
        )
    );
}
