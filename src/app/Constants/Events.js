// constants/Events.js
// Optional: Categories for filtering/color coding
import { IndianNewsPaperDay } from "./EventDays/29_jan_indian_news_paper_day"
import { worldWetlandDays } from "./EventDays/2_feb_world_wetland_days"
export const INDIAN_EVENTS = [
    IndianNewsPaperDay,
    worldWetlandDays,
]

export const EVENT_CATEGORIES = {
    national: { label: 'National', color: '#FF9933' },
    international: { label: 'International', color: '#4A90E2' },
    health: { label: 'Health', color: '#FF6B9D' },
    environment: { label: 'Environment', color: '#228B22' },
    celebration: { label: 'Celebration', color: '#E91E63' },
    religious: { label: 'Religious', color: '#9C27B0' },
}
