import thomasImage from "../../../../../public/assets/thomasImage.png";
import aishaImage from "../../../../../public/assets/aishaImage.png";
import community1 from "../../../../../public/assets/community1.png";
import { formatTime } from "@/Utils/format";

const communityCreationData = [
    {
        name: "Thomas",
        department: "Department",
        time: "2024-06-20T02:00:00Z",
        group: "Malaysia's spots",
        followers: "12,543 followers",
        profileImage: thomasImage,
        groupImage: community1,
    },
    {
        name: "Aisha Binti",
        department: "Department",
        time: "2024-06-19T04:00:00Z",
        group: "Where to Go",
        followers: "14,567 followers",
        profileImage: aishaImage,
        groupImage: community1,
    },
];

const CommunityCreationRow = ({
    name,
    department,
    time,
    group,
    followers,
    profileImage,
    groupImage,
}) => (
    <div className="flex items-center justify-between py-4 border-t border-gray-200">
        <div className="flex items-center w-1/4">
            <img
                className="w-10 h-10 rounded-full"
                src={profileImage}
                alt="User profile"
            />
            <div className="ml-3">
                <p className="text-sm font-bold text-black">
                    {name} ({department})
                </p>
                <p className="text-xs font-semibold text-black">
                    {formatTime(time)}
                </p>
            </div>
        </div>
        <p className="w-1/4 text-xs font-semibold text-center text-black">
            wants to create
        </p>
        <div className="flex items-center w-1/4">
            <img
                className="w-10 h-10 rounded-full"
                src={groupImage}
                alt="Group"
            />
            <div className="ml-3">
                <p className="text-sm font-bold text-black">{group}</p>
                <p className="text-xs text-gray-400">{followers}</p>
            </div>
        </div>
        <div className="flex justify-end w-1/4">
            <button className="px-4 py-1 text-sm font-bold text-white bg-blue-500 rounded-full">
                Approve
            </button>
            <button className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full">
                Reject
            </button>
        </div>
    </div>
);

export const CommunityCreationRequests = () => {
    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-5">
            <h2 className="mb-4 text-2xl font-bold text-blue-500">
                Community Creation
            </h2>
            {communityCreationData.map((data, index) => (
                <CommunityCreationRow key={index} {...data} />
            ))}
        </section>
    );
};
