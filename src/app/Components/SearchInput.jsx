"use client";
import React, { useState, useEffect } from "react";

function SearchInput({
    onSearch,
    placeHolder,
    years = [],
    selectedYear = "all",
    onYearChange = () => { },
    resultCount = null
}) {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm, onSearch]);

    return (
        <div className="py-4 px-4 mx-auto max-w-screen-xl lg:px-6">
            <div className="rounded-2xl bg-primary-50 dark:bg-primary-dark-50 border border-primary-100 dark:border-primary-dark-100 backdrop-blur">
                <div className="p-4 sm:p-5">

                    {/* Search + Year */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">

                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>

                                <input
                                    type="search"
                                    className="
                                        block w-full p-4 ps-10 text-sm
                                        text-primary dark:text-primary-dark
                                        border border-primary-300 dark:border-primary-dark-300
                                        rounded-lg
                                        bg-primary-50 dark:bg-primary-dark-50
                                        outline-none
                                        focus:ring-primary-500 focus:border-primary-500
                                        dark:focus:ring-primary-dark-500 dark:focus:border-primary-dark-500
                                    "
                                    placeholder={placeHolder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Year Dropdown */}
                        {years.length > 0 && (
                            <div>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => onYearChange(e.target.value)}
                                    className="
                                        w-full rounded-lg border
                                        border-primary-300 dark:border-primary-dark-300
                                        bg-primary-50 dark:bg-primary-dark-50
                                        px-4 py-3 text-sm
                                        outline-none
                                        focus:ring-primary-500 focus:border-primary-500
                                    "
                                >
                                    <option value="all">All Years</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Results line */}
                    {resultCount !== null && (
                        <div className="mt-3 flex items-center justify-between text-sm">
                            <p className="text-slate-600 dark:text-slate-400">
                                Showing{" "}
                                <span className="font-semibold text-slate-900 dark:text-black">
                                    {resultCount}
                                </span>{" "}
                                results
                            </p>

                            {searchTerm.trim() && (
                                <span className="
                                    inline-flex items-center rounded-full
                                    bg-primary-100 dark:bg-primary-dark-100
                                    px-3 py-1 text-xs font-medium
                                    text-primary-800 dark:text-primary-dark-800
                                ">
                                    Search: “{searchTerm}”
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchInput;
