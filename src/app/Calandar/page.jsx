"use client"
import React, { useState, useMemo } from 'react'
import Navbar from '../Components/NavBar'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { INDIAN_EVENTS, EVENT_CATEGORIES } from '../Constants/Events'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { isHTML } from '@/Utils/isHtml'
import { getMonthName } from '@/Utils/getMonthName'
import { convertToCalendarEvents } from '@/Utils/convertToCalandar'

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
    const events = useMemo(() => convertToCalendarEvents(INDIAN_EVENTS), [])

    // Handle event click
    const handleEventClick = (clickInfo) => {
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
                    <h1 className="text-primary-600 dark:text-primary-dark-600 text-3xl md:text-4xl font-bold mb-2">
                        Indian Events Calendar - Celebrating Every Special Day
                    </h1>
                </div>

                {/* Calendar Card */}
                <div className="

">
                    <FullCalendar
                        plugins={[dayGridPlugin, rrulePlugin, interactionPlugin, listPlugin]}
                        initialView="listYear"
                        weekends
                        events={events}
                        eventContent={renderEventContent}
                        eventClick={handleEventClick}
                        height="auto"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,listYear"
                        }}
                        eventDisplay="block"
                        dayMaxEvents
                        displayEventTime={false}
                        eventClassNames=" cursor-pointer rounded-md px-2 py-1 text-black transition dark:text-white"
                    />
                </div>


                {/* Legend */}
                <div className="mt-6 bg-white dark:bg-light-black rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Event Categories</h3>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: value.color }}
                                ></div>
                                <span className="text-sm text-gray-700 dark:text-white">{value.label}</span>
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
                        className="bg-white dark:bg-light-black rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header with Gradient */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-black dark:text-white px-6 py-5 flex justify-between items-center z-10">
                            <h2 className="text-2xl md:text-3xl font-bold pr-8">
                                {selectedEvent.day} {getMonthName(selectedEvent.month)}-{selectedEvent.title}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-black dark:text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center text-3xl font-bold transition-all"
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
                                    <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 dark:border-primary-dark-500 rounded-r-lg">
                                        <p className="text-gray-700 dark:text-white text-lg leading-relaxed italic">
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
                                            <div className='text-black dark:text-white'

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
                                                                className="bg-white dark:text-white dark:bg-black border-b border-gray-200 dark:border-gray-700"
                                                                {...props}
                                                            />
                                                        ),
                                                        th: ({ node, ...props }) => (
                                                            <th
                                                                className="px-6 dark:text-white dark:bg-black py-4 font-bold text-gray-900 whitespace-nowrap dark:text-black"
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
        </div>
    )
}

export default Page