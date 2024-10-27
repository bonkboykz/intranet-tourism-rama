import AvatarTemplate from "@/Pages/AvatarTemplate.jsx";

import AddTitles from "./AddTitles";
import AddUnits from "./AddUnits";
import {
    CoreFeatures,
    CoverPhotos,
    MailSettings,
    Media,
    SizeLimit,
} from "./AdvanceSettings";
import { AuditTrail } from "./AuditTrail";
import LogoUploader from "./BasicSettings";
import { BirthdayTemplate } from "./BirthdayTemplate";
import Departments from "./Departments";
import { LoginImageUploader } from "./LoginImageUploader";
import Permissions from "./Permissions";
import { Polls } from "./Polls/Polls";
import Requests from "./Requests";
import Roles from "./Roles";
import ThemeComponent from "./Themes";

const SettingsPage = ({ currentPage }) => {
    const handleSave = (selectedImage) => {
        console.log("Selected image:", selectedImage);
    };

    return (
        <div>
            <h1 className="hidden">{currentPage}</h1>
            {currentPage === "Basic Settings" && (
                <div className="flex flex-col gap-4">
                    <LogoUploader onSave={handleSave} />
                    <LoginImageUploader />
                </div>
            )}
            {currentPage === "Themes" && <ThemeComponent onSave={handleSave} />}
            {currentPage === "Advanced Settings" && (
                <>
                    <CoreFeatures onSave={handleSave} />
                    <SizeLimit onSave={handleSave} />
                    {/* <Media onSave={handleSave} /> */}
                    <CoverPhotos onSave={handleSave} />
                    {/* <MailSettings onSave={handleSave} /> */}
                </>
            )}
            {currentPage === "Requests" && <Requests />}
            {currentPage === "Audit Trail" && <AuditTrail />}
            {currentPage === "Feedback" && <Polls />}
            {currentPage === "Birthday Template" && <BirthdayTemplate />}
            {currentPage === "Business Titles" && <AddTitles />}
            {currentPage === "Business Units" && <AddUnits />}
            {currentPage === "Roles" && <Roles />}
            {currentPage === "Permissions" && <Permissions />}
            {currentPage === "Avatar Template" && <AvatarTemplate />}
        </div>
    );
};

export {
    CoreFeatures,
    CoverPhotos,
    Departments,
    LogoUploader,
    MailSettings,
    Media,
    Permissions,
    Requests,
    Roles,
    SettingsPage,
    SizeLimit,
    ThemeComponent,
};
