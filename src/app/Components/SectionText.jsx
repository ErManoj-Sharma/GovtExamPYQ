import React from 'react'

function SectionText({ text, subtext, bgtext }) {
    return (
        <div id='main-title' className='text-center '>
            <h2 className='relative uppercase  text-5xl font-bold dark:text-white'>{text}{" "}
                <span className='text-primary dark:text-primary-dark'>{subtext}</span>
                <span className='font-extrabold text-6xl absolute uppercase top-1/2 left-1/2 text-[#d7d7d7] dark:text-grey-lightb transition-all duration-400 ease-in-out z-[-1] transform -translate-x-1/2 -translate-y-1/2  '>{bgtext}</span>
            </h2>
        </div>
    )
}

export default SectionText