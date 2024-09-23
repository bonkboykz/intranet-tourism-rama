import { useSettings } from "@/Layouts/useSettings";
import { cn } from "@/Utils/cn";

const backgroundImage = "/assets/Birthday-Template-1.png";

export function SystemBirthdayCard() {
    const { settings } = useSettings();

    return (
        <article
            className={cn(
                "w-full max-w-[700px]",
                "mt-10 p-4 rounded-2xl bg-white border-2 shadow-xl w-full max-w-[700px] z-5 relative",
                "relative pt-4"
            )}
        >
            <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full">
                <div className="flex gap-1 mt-2"></div>
                <div className="flex flex-col justify-between items-start px-1 w-full  p-2">
                    <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
                        <div className="flex gap-1.5 -mt-1">
                            <img
                                loading="lazy"
                                src={settings.logo}
                                alt="Company logo"
                                className="shrink-0 aspect-square w-[50px] h-[50px] rounded-full"
                            />
                            <div className="flex flex-col my-auto ml-1">
                                <div className="text-base font-semibold text-neutral-800">
                                    Jomla!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="relative flex flex-wrap gap-2">
                <div className="relative w-full">
                    <img
                        alt="Birthday background"
                        src={backgroundImage}
                        className="rounded-xl w-full h-auto object-cover"
                        style={{ maxHeight: "300px" }}
                    />
                    <div className="absolute inset-0 flex justify-center items-center p-4">
                        <span
                            className="text-5xl px-4 py-2 font-black text-center text-white text-opacity-90 bg-black bg-opacity-50 rounded-lg"
                            style={{
                                maxWidth: "90%",
                                overflowWrap: "break-word",
                                wordWrap: "break-word",
                            }}
                        >
                            Happy Birthday!
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}
