export const convertToCalendarEvents = (INDIAN_EVENTS) => {
    return INDIAN_EVENTS.map(event => {
        const [month, day] = event.date.split('-')

        return {
            id: event.id,
            title: event.title,
            rrule: {
                freq: 'yearly',
                bymonth: parseInt(month),
                bymonthday: parseInt(day),
                dtstart: `2024-${event.date}`,
            },
            backgroundColor: event.color,
            borderColor: event.color,
            extendedProps: {
                image: event.image,
                shortDescription: event.shortDescription,
                detailedDescription: event.detailedDescription,
                category: event.category,
                month: parseInt(month),
                day: parseInt(day),
            }
        }
    })
}
