import { getDate, getMonth } from "date-fns";

export const isBirthdayDay = (date, today) => {
    return (
        getMonth(today) === getMonth(date) && getDate(today) === getDate(date)
    );
};
