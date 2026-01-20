import React from 'react'

function QuizContainer({ children }) {
    return (
        <section className="bg-white dark:bg-black">
            <div className="py-2 px-4 mx-auto max-w-screen-xl lg:py-6 lg:px-6">
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {children}
                </div>
            </div>
        </section>
    )
}

export default QuizContainer;
