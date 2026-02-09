export const getMonthName = (monthNumber, locale = 'en-US') => {
    const date = new Date(2024, monthNumber - 1, 1);
    return date.toLocaleString(locale, { month: 'long' });
}