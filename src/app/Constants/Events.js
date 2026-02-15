// constants/Events.js
// Optional: Categories for filtering/color coding
import { IndianNewsPaperDay } from "./EventDays/29_jan_indian_news_paper_day"
import { worldWetlandDays } from "./EventDays/2_feb_world_wetland_days"
import { worldRadioDay } from "./EventDays/13_feb_world_radio_day"
export const INDIAN_EVENTS = [
    IndianNewsPaperDay,
    worldWetlandDays,
    worldRadioDay,
]

export const EVENT_CATEGORIES = {
    national: {
        label: "National",
        color: "#FF9933", // India saffron
    },

    international: {
        label: "International",
        color: "#3caef4", // Blue
    },

    health: {
        label: "Health",
        color: "#FF6B9D", // Pink
    },

    environment: {
        label: "Environment",
        color: "#228B22", // Forest green
    },

    religious: {
        label: "Religious",
        color: "#9C27B0", // Purple
    },

    education: {
        label: "Education",
        color: "#2F81F7", // VS Code / GitHub blue
    },

    sports: {
        label: "Sports",
        color: "#22C55E", // Tailwind green
    },

    culture: {
        label: "Culture",
        color: "#F97316", // Orange
    },

    defence: {
        label: "Defence",
        color: "#6B7280", // Slate gray
    },

    governance: {
        label: "Governance",
        color: "#6366F1", // Indigo
    },

    history: {
        label: "History",
        color: "#92400E", // Brown
    },

    awareness: {
        label: "Awareness Day",
        color: "#ceec48", // Rose
    },

    misc: {
        label: "Miscellaneous",
        color: "#64748B", // Neutral gray
    },
};
