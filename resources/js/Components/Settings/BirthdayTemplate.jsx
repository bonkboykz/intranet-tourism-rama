import { BirthdayTemplateTable } from "./BirthdayTemplate/Table";

export const BirthdayTemplate = () => {
    return (
        <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[844px]">
            <h2 className="text-2xl font-bold text-blue-500 mb-8">
                Enable/Disable Birthday Templates
            </h2>

            <BirthdayTemplateTable />
        </section>
    );
};
