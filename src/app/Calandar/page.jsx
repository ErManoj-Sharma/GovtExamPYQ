"use client"
import React, { useState, useMemo } from 'react'
import Navbar from '../Components/NavBar'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import { INDIAN_EVENTS, EVENT_CATEGORIES } from '../Constants/Events'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Helper function to detect if content is HTML or Markdown
const isHTML = (str) => {
    return /<[a-z][\s\S]*>/i.test(str);
}

const getMonthName = (monthNumber, locale = 'en-US') => {
    const date = new Date(2024, monthNumber - 1, 1);
    return date.toLocaleString(locale, { month: 'long' });
}

// Convert to FullCalendar events
const convertToCalendarEvents = () => {
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

function renderEventContent(eventInfo) {
    return (
        <div className="fc-event-main-frame p-1">
            <div className="fc-event-title-container">
                <div className="fc-event-title fc-sticky text-xs font-medium truncate">
                    {eventInfo.event.title}
                </div>
            </div>
        </div>
    )
}

function Page() {
    const [selectedEvent, setSelectedEvent] = useState(null)

    // Memoize events so they don't recreate on every render
    const events = useMemo(() => convertToCalendarEvents(), [])

    // Handle event click
    const handleEventClick = (clickInfo) => {
        debugger
        setSelectedEvent({
            title: clickInfo.event.title,
            ...clickInfo.event.extendedProps
        })
    }

    // Close modal
    const closeModal = () => {
        setSelectedEvent(null)
    }

    // Get category details
    const getCategoryInfo = (category) => {
        return EVENT_CATEGORIES[category] || { label: category, color: '#4A90E2' }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />

            <div className="container mx-auto p-4 md:p-8 lg:p-12">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        भारतीय घटनाक्रम कैलेंडर
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Indian Events Calendar - Celebrating Every Special Day
                    </p>
                </div>

                {/* Calendar Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 border border-gray-100">
                    <FullCalendar
                        plugins={[dayGridPlugin, rrulePlugin, interactionPlugin]}
                        initialView='dayGridMonth'
                        weekends={true}
                        events={events}
                        eventContent={renderEventContent}
                        eventClick={handleEventClick}
                        height="auto"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek'
                        }}
                        eventDisplay='block'
                        displayEventTime={false}
                        eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                </div>

                {/* Legend */}
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Event Categories</h3>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: value.color }}
                                ></div>
                                <span className="text-sm text-gray-700">{value.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Modal */}
            {selectedEvent && (
                <div
                    className="fixed no-scrollbar inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header with Gradient */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-black px-6 py-5 flex justify-between items-center z-10">
                            <h2 className="text-2xl md:text-3xl font-bold pr-8">
                                {selectedEvent.day} {getMonthName(selectedEvent.month)}-{selectedEvent.title}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-black hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center text-3xl font-bold transition-all"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="no-scrollbar overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="p-6 md:p-8">
                                {/* Image with overlay gradient */}
                                {selectedEvent.image && (
                                    <div className="mb-6 relative w-full h-72 md:h-96 rounded-xl overflow-hidden group">
                                        <Image
                                            fill
                                            src={selectedEvent.image}
                                            alt={selectedEvent.title}
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    </div>
                                )}

                                {/* Category Badge with color */}
                                {selectedEvent.category && (
                                    <div className="mb-6">
                                        <span
                                            className="inline-block text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md"
                                            style={{
                                                backgroundColor: getCategoryInfo(selectedEvent.category).color
                                            }}
                                        >
                                            {getCategoryInfo(selectedEvent.category).label}
                                        </span>
                                    </div>
                                )}

                                {/* Short Description */}
                                {selectedEvent.shortDescription && (
                                    <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                                        <p className="text-gray-700 text-lg leading-relaxed italic">
                                            {selectedEvent.shortDescription}
                                        </p>
                                    </div>
                                )}

                                {/* Detailed Description - HTML or Markdown Support */}
                                {selectedEvent.detailedDescription && (
                                    <>
                                        {isHTML(selectedEvent.detailedDescription) ? (
                                            // Render HTML
                                            <div
                                                className="prose prose-lg max-w-none 
                                                prose-headings:text-gray-800 
                                                prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-6
                                                prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-5 prose-h3:text-blue-700
                                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                                prose-ul:my-4 prose-li:text-gray-700 prose-li:mb-2
                                                prose-strong:text-gray-900 prose-strong:font-semibold"
                                                dangerouslySetInnerHTML={{
                                                    __html: selectedEvent.detailedDescription
                                                }}
                                            />
                                        ) : (
                                            // Render Markdown
                                            <div

                                            >
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        table: ({ node, ...props }) => (
                                                            <table
                                                                className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                                                {...props}
                                                            />
                                                        ),
                                                        thead: ({ node, ...props }) => (
                                                            <thead
                                                                className="text-xs text-gray-900 uppercase dark:text-gray-400"
                                                                {...props}
                                                            />
                                                        ),
                                                        tbody: ({ node, ...props }) => <tbody {...props} />,
                                                        tr: ({ node, ...props }) => (
                                                            <tr
                                                                className="bg-white dark:bg-primary-dark-100 border-b border-gray-200 dark:border-gray-700"
                                                                {...props}
                                                            />
                                                        ),
                                                        th: ({ node, ...props }) => (
                                                            <th
                                                                className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap dark:text-black"
                                                                {...props}
                                                            />
                                                        ),
                                                        td: ({ node, ...props }) => (
                                                            <td
                                                                className="px-6 py-4"
                                                                {...props}
                                                            />
                                                        ),
                                                        code: ({ inline, children }) =>
                                                            inline ? (
                                                                <code className="bg-primary-200 dark:bg-primary-dark-200 px-1 py-0.5 rounded text-xs font-medium">
                                                                    {children}
                                                                </code>
                                                            ) : (
                                                                <code className="block bg-primary-200 dark:bg-primary-dark-200 p-3 rounded-md">
                                                                    {children}
                                                                </code>
                                                            ),
                                                    }}
                                                >
                                                    {selectedEvent.detailedDescription}
                                                </ReactMarkdown>

                                            </div>


                                        )}
                                    </>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            )}

            {/* Add custom styles */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }

                /* Custom FullCalendar styling */
                .fc {
                    font-family: inherit;
                }

                .fc-toolbar-title {
                    font-size: 1.5rem !important;
                    font-weight: 700 !important;
                    color: #1f2937 !important;
                }

                .fc-button {
                    background-color: #3b82f6 !important;
                    border: none !important;
                    border-radius: 0.5rem !important;
                    padding: 0.5rem 1rem !important;
                    font-weight: 600 !important;
                    transition: all 0.2s !important;
                }

                .fc-button:hover {
                    background-color: #2563eb !important;
                    transform: translateY(-1px);
                }

                .fc-button-active {
                    background-color: #1d4ed8 !important;
                }

                .fc-daygrid-day:hover {
                    background-color: #f3f4f6;
                }

                .fc-event {
                    border-radius: 0.375rem !important;
                    padding: 2px 4px !important;
                    margin: 1px 2px !important;
                }

                .fc-day-today {
                    background-color: #fef3c7 !important;
                }

                .fc-col-header-cell {
                    background-color: #f9fafb !important;
                    font-weight: 600 !important;
                    color: #374151 !important;
                }
            `}</style>
        </div>
    )
}

export default Page