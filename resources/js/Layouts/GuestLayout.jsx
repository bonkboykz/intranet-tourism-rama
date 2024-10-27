import { useSetupSettings } from "./useSettings";

export default function Guest({ children }) {
    const { settings } = useSetupSettings();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full p-4 sm:p -6 sm:py-8">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
                    <div className="hidden md:block">
                        <img
                            src={settings.login_image || "/assets/Login.svg"}
                            alt="Side Image"
                            className="object-cover w-full h-full rounded-l-lg"
                        />
                    </div>
                    <div className="flex flex-col justify-center w-full p-6">
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="w-48 h-16 mx-auto my-3"
                        />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
