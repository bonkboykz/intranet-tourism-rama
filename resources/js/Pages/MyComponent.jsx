import * as React from "react";

function FeaturedEvent({ date, month, title, time }) {
    return (
        <div className="flex gap-3 mt-5">
            <div className="flex flex-col pb-2.5 font-bold text-center whitespace-nowrap bg-secondary rounded-md shadow-sm h-[54px] w-[54px]">
                <div className="justify-center px-5 py-3 text-xs bg-white rounded-md text-neutral-800">
                    {date}
                </div>
                <div className="self-center mt-1.5 text-xs text-white uppercase">
                    {month}
                </div>
            </div>
            <div className="flex flex-col self-start text-sm font-semibold">
                <div className="font-bold text-neutral-800">{title}</div>
                <div className="mt-2.5 text-neutral-400">{time}</div>
                <div className="mt-2.5 text-xs text-sky-500 underline">
                    More
                </div>
            </div>
        </div>
    );
}

export default function MyComponent() {
    const featuredEvents = [
        {
            date: "19",
            month: "Jan",
            title: "Conference",
            time: "January 19, 2024, 12:30 PM",
        },
        {
            date: "21",
            month: "Jan",
            title: "Corporate event",
            time: "January 21, 2024, 08:00 AM",
        },
        {
            date: "12",
            month: "FRB",
            title: "Exhibition",
            time: "February 12, 2024, 07:00 PM",
        },
    ];

    const onlineUsers = [
        {
            name: "Aisha",
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/4b4ed9ba869d00a18a26f8a9dc5da9055196b1fcac8727d85b2ea5e30ab2b1b6?apiKey=285d536833cc4168a8fbec258311d77b&",
        },
        {
            name: "Thomas",
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/55acaa688ceb32438e2fd64330d346634aabce7542decf498c640c0a98528313?apiKey=285d536833cc4168a8fbec258311d77b&",
        },
        {
            name: "Ben",
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/08e4ee1196c494b86985dcf08142f28aa8e0d676f061b472ca80fadce18ae8a9?apiKey=285d536833cc4168a8fbec258311d77b&",
        },
        {
            name: "Sarah",
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/703ed66f657f29789d0fc1ca84f07aac610d11426e71037cf2ae395564110303?apiKey=285d536833cc4168a8fbec258311d77b&",
        },
        {
            name: "Nik",
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/710b307500c73f0cff73a432dbf4465a2b71f35e6c26d98857a688e45692354f?apiKey=285d536833cc4168a8fbec258311d77b&",
        },
    ];

    //   window.Echo.join("online")
    //     .here((users) => {
    //         onlineUsers = users
    //         console.log("Online users:", onlineUsers);
    //     })
    //     .joining((user) => {
    //         onlineUsers.push(user);
    //         console.log(user.name + " is online");
    //         console.log("Online users:", onlineUsers);
    //         // Add user to the online users list
    //     })
    //     .leaving((user) => {
    //         onlineUsers = onlineUsers.filter((onlineUser) => onlineUser.id != user.id);
    //         console.log(user.name + " is offline");
    //         console.log("Online users:", onlineUsers);
    //         // Remove user from the online users list
    //     });

    return (
        <div className="flex flex-col max-w-[291px]">
            <section className="flex flex-col px-4 py-5 w-full bg-white rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold text-neutral-800">
                    Featured Events
                </h2>
                {featuredEvents.map((event) => (
                    <FeaturedEvent key={event.title} {...event} />
                ))}
                <div className="flex gap-2 mt-4 text-xs font-semibold uppercase text-neutral-800">
                    <div className="my-auto">view all</div>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/94038c67d19dccbc5e7edb68bf4b9e991042ccf0a6c1a73a67760cbeb4b2d1e9?apiKey=285d536833cc4168a8fbec258311d77b&"
                        alt="Arrow icon"
                        className="shrink-0 aspect-[1.25] w-[15px]"
                    />
                </div>
            </section>
            <section className="flex flex-col px-3 py-4 mt-14 w-full bg-white rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold text-neutral-800">
                    Who&apos;s Online
                </h2>
                <div className="flex gap-2.5 px-0.5 mt-2.5">
                    {onlineUsers.map((user) => (
                        <img
                            key={user.name}
                            loading="lazy"
                            //   src={user.image}
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4b4ed9ba869d00a18a26f8a9dc5da9055196b1fcac8727d85b2ea5e30ab2b1b6?apiKey=285d536833cc4168a8fbec258311d77b&"
                            alt={`${user.name}'s avatar`}
                            className="shrink-0 w-11 aspect-[0.95]"
                        />
                    ))}
                </div>
                <div className="flex gap-4 self-center text-xs font-semibold text-center whitespace-nowrap text-neutral-800">
                    {onlineUsers.map((user) => (
                        <div key={user.name} className="grow">
                            {user.name}
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-3 text-xs font-semibold uppercase text-neutral-800">
                    <div className="my-auto">view all</div>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/94038c67d19dccbc5e7edb68bf4b9e991042ccf0a6c1a73a67760cbeb4b2d1e9?apiKey=285d536833cc4168a8fbec258311d77b&"
                        alt="Arrow icon"
                        className="shrink-0 aspect-[1.25] w-[15px]"
                    />
                </div>
            </section>
        </div>
    );
}
