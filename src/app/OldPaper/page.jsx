'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Eye, ChevronDown, ChevronRight, FileText, Calendar, Loader2 } from 'lucide-react';
import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';
const OldPaperPage = () => {
    const [examPapersData, setExamPapersData] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('all');
    const [expandedCategories, setExpandedCategories] = useState({});

    // Fetch papers data from API
    useEffect(() => {
        fetch('/api/papers')
            .then(res => res.json())
            .then(data => {
                setExamPapersData(data);
                // Expand all categories by default
                const expanded = Object.keys(data).reduce((acc, cat) => ({ ...acc, [cat]: true }), {});
                setExpandedCategories(expanded);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading papers:', error);
                setLoading(false);
            });
    }, []);

    // Flatten the data structure for easier filtering
    const allPapers = useMemo(() => {
        const papers = [];
        Object.entries(examPapersData).forEach(([category, years]) => {
            Object.entries(years).forEach(([year, files]) => {
                files.forEach(file => {
                    let actualYear = year;

                    // If it's a direct file, try to extract year from filename
                    if (year === 'direct') {
                        // Try to match patterns like "Name-YEAR-Code.pdf" or "Name-YEAR.pdf"
                        const match = file.match(/[-_](\d{4})[-_.]|^(\d{4})-/);
                        actualYear = match ? (match[1] || match[2]) : 'Unknown';
                    }

                    papers.push({
                        category,
                        year: actualYear,
                        filename: file,
                        path: year === 'direct'
                            ? `/papers/${encodeURIComponent(category)}/${encodeURIComponent(file)}`
                            : `/papers/${encodeURIComponent(category)}/${year}/${encodeURIComponent(file)}`,
                        displayName: file.replace('.pdf', '').replace(/-/g, ' ').replace(/_/g, ' ')
                    });
                });
            });
        });
        return papers;
    }, [examPapersData]);

    const years = useMemo(() =>
        [...new Set(allPapers.map(p => p.year).filter(y => y !== 'Unknown'))].sort().reverse(),
        [allPapers]
    );

    // Group papers by category after filtering
    const groupedPapers = useMemo(() => {
        const filtered = allPapers.filter(paper => {
            const matchesSearch = paper.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                paper.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesYear = selectedYear === 'all' || paper.year === selectedYear;
            return matchesSearch && matchesYear;
        });

        // Group by category
        const grouped = {};
        filtered.forEach(paper => {
            if (!grouped[paper.category]) {
                grouped[paper.category] = [];
            }
            grouped[paper.category].push(paper);
        });

        // Sort papers within each category by year (descending) and then by name
        Object.keys(grouped).forEach(category => {
            grouped[category].sort((a, b) => {
                const yearCompare = b.year.localeCompare(a.year);
                if (yearCompare !== 0) return yearCompare;
                return a.displayName.localeCompare(b.displayName);
            });
        });

        return grouped;
    }, [allPapers, searchQuery, selectedYear]);

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleView = (path) => {
        window.open(path, '_blank');
    };

    const handleDownload = (path, filename) => {
        const link = document.createElement('a');
        link.href = path;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalPapers = Object.values(groupedPapers).reduce((sum, papers) => sum + papers.length, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading exam papers...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar active="Old Paper" />

            {/* Title Section */}
            <div>
                <section className="bg-white dark:bg-black">
                    <div className="py-2 px-4 mx-auto max-w-screen-xl lg:py-6 lg:px-6">
                        <div className="mx-auto max-w-screen-sm text-center ">
                            <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                Old Exam Papers
                            </h2>
                            <p className="font-light text-gray-500 sm:text-xl  dark:text-white">
                                Browse, search, and download previous year exam papers.
                            </p>

                            <span className="inline-flex items-center gap-2 rounded-full dark:text-white bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                <span className="h-2 w-2 rounded-full bg-blue-600 " />
                                {totalPapers} papers
                            </span>

                            {Object.keys(groupedPapers).length > 0 && (
                                <span className="inline-flex items-center gap-2 dark:text-white rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                    <span className="h-2 w-2 rounded-full bg-slate-500 " />
                                    {Object.keys(groupedPapers).length} categories
                                </span>
                            )}

                        </div>
                    </div>
                </section>
            </div>
            {/*  Title Section */}

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Search + Filters (Sticky) */}
                    <div className=" rounded-2xl  bg-primary-50 dark:bg-primary-dark-50 border border-primary-100 dark:border-primary-dark-100 backdrop-blur">
                        <div className=" sm:p-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center">
                                {/* Search */}
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search by subject, term, code..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="block w-full p-4 ps-10 text-sm text-primary dark:text-primary-dark border border-primary-300 dark:border-primary-dark-300 rounded-lg bg-primary-50 dark:bg-primary-dark-50 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-dark-500 dark:focus:border-primary-dark-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Year Filter */}
                                <div>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="w-full rounded-xl    border border-primary dark:border-primary-dark bg-primary-50 dark:bg-primary-dark-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition
                         focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                                    >
                                        <option value="all" className=''>All Years</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Results line */}
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                                <p className="text-slate-600">
                                    Showing{" "}
                                    <span className="font-semibold text-slate-900">{totalPapers}</span>{" "}
                                    results
                                </p>

                                {searchQuery?.trim()?.length > 0 && (
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                        Search: “{searchQuery}”
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>





                    {/* Grouped Papers */}
                    <div className="space-y-4">
                        {Object.entries(groupedPapers).map(([category, papers]) => (
                            <div
                                key={category}
                                className="overflow-hidden rounded-2xl  border-slate-200  shadow-lg dark:bg-light-black bg-primary-50"
                            >
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 ">
                                            {expandedCategories[category] ? (
                                                <ChevronDown className="w-5 h-5 text-primary-700 dark:text-primary-dark" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-primary-700 dark:text-primary-dark" />
                                            )}
                                        </span>

                                        <div className="min-w-0 text-left">
                                            <h2 className="text-base sm:text-lg font-semibold text-primary dark:text-primary-dark truncate">
                                                {category}
                                            </h2>
                                            <p className="text-xs sm:text-sm text-primary dark:text-primary-dark">
                                                {papers.length} {papers.length === 1 ? "paper" : "papers"}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary dark:text-primary-dark">
                                        Click to {expandedCategories[category] ? "collapse" : "expand"}
                                    </span>
                                </button>

                                {/* Papers Grid */}
                                {expandedCategories[category] && (
                                    <div className=" px-5 sm:px-6 pb-6">
                                        <div className="p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 dark:bg-black bg-primary-50">
                                            {papers.map((paper, index) => (
                                                <div
                                                    key={index}
                                                    className=" group relative rounded-2xl border p-4 transition-all duration-300 bg-primary-50 dark:bg-black border-primary dark:border-primary-dark shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_20px_50px_rgba(0,0,0,0.9)]
"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-dark-50 flex items-center justify-center border border-primary-100 dark:border-primary-dark-200">
                                                            <FileText className="w-6 h-6 text-red-600 dark:text-primary-dark-600" />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-semibold text-primary dark:text-primary-dark line-clamp-2">
                                                                {paper.displayName}
                                                            </h3>

                                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-primary dark:text-primary-dark">
                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                    {paper.year}
                                                                </span>

                                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-primary dark:text-primary-dark">
                                                                    PDF
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => handleView(paper.path)}
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold dark:text-primary-dark text-primary 
                                   transition hover:bg-slate-800 "
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View
                                                        </button>

                                                        <button
                                                            onClick={() => handleDownload(paper.path, paper.filename)}
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold dark:text-primary-dark text-primary 
                                   transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download
                                                        </button>
                                                    </div>

                                                    {/* subtle hover line */}
                                                    <div className="mt-4 h-1 w-0 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 group-hover:w-full" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {totalPapers === 0 && !loading && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 sm:p-14 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                <FileText className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="mt-4 text-lg sm:text-xl font-bold text-slate-900">
                                No papers found
                            </h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Try adjusting your search keywords or year filter.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OldPaperPage;