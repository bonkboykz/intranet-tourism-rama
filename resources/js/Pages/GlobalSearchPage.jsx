import { usePage } from "@inertiajs/react";

import { GlobalSearch } from "@/Components/GlobalSearch/GlobalSearch";
import FeaturedEvents from "@/Components/Reusable/FeaturedEventsWidget/FeaturedEvents";
import PageTitle from "@/Components/Reusable/PageTitle";
import { WallContext } from "@/Components/Reusable/WallPosting/WallContext";
import WhosOnline from "@/Components/Reusable/WhosOnlineWidget/WhosOnline";
import Example from "@/Layouts/DashboardLayoutNew";

export default function GlobalSearchPage() {
    const { id } = usePage().props;

    return (
        <WallContext.Provider
            value={{
                loggedInUserId: id,
            }}
        >
            <Example>
                <main className="z-0 min-h-screen w-full bg-gray-100 flex-row flex justify-center items-start gap-20 md:gap-12">
                    {/* left widgets */}
                    <div className="z-0 pl-10 pt-10 pb-20 overflow-y-auto h-auto w-full max-w-[330px] max-h-[100vh] sticky top-0 hidden md:hidden lg:block no-scrollbar">
                        <div className="file-directory-header">
                            <PageTitle title="Global Search" />
                        </div>
                        <hr className="file-directory-underline" />
                        <div>
                            <FeaturedEvents />
                            <WhosOnline />
                        </div>
                    </div>

                    {/* main content */}
                    <div className="flex flex-col justify-center w-full max-w-[1200px] pt-10 max-md:px-6 mr-10 max-md:ml-10 lg:ml-0 md:ml-10">
                        <GlobalSearch />
                    </div>
                </main>
            </Example>
        </WallContext.Provider>
    );
}
