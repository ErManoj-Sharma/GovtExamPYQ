"use client"
import React, { useState, useEffect } from 'react'

function SearchInput({ onSearch, placeHolder }) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm, onSearch]);

    return (
        <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-1 lg:px-6'>
            <form className="max-w mx-auto" onSubmit={e => e.preventDefault()}>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 ps-10 text-sm text-primary dark:text-primary-dark border border-primary-300 dark:border-primary-dark-300 rounded-lg bg-primary-50 dark:bg-primary-dark-50 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-dark-500 dark:focus:border-primary-dark-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={placeHolder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="text-white absolute end-2.5 bottom-2.5 bg-primary dark:bg-primary-dark hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Search
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SearchInput;
