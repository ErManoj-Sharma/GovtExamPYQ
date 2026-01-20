import React from 'react'

function WindowText({title, description}) {
    return (
        <div>
            <section className="bg-white dark:bg-black">
                <div className="py-2 px-4 mx-auto max-w-screen-xl lg:py-6 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center lg:mb-10 mb-8">
                        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{title}</h2>
                        <p className="font-light text-gray-500 sm:text-xl  dark:text-white">{description}</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default WindowText
