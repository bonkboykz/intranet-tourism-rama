import { getDate, getMonth } from "date-fns";

export const isBirthdayDay = (dob, comparisonDate) => {
    const dobMonth = getMonth(dob);
    const dobDay = getDate(dob);

    const comparisonMonth = getMonth(comparisonDate);
    const comparisonDay = getDate(comparisonDate);

    return dobMonth === comparisonMonth && dobDay === comparisonDay;
};
