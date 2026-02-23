"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";
import WindowText from "../Components/WindowText";
import SearchInput from "../Components/SearchInput";
import QuizContainer from "../Components/QuizContainer";
import QuizList from "../Components/QuizList";
import ScrollToTop from "../Components/ScrollToTop";
import Chip from "../Components/Chip";

/* -------------------- helpers -------------------- */

function extractYear(examName) {
    const match = examName.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
}

/* -------------------- component -------------------- */

function Quiz() {
    const [allQuestions, setAllQuestions] = useState([]);
    const [examTypes, setExamTypes] = useState(["All Exams"]);
    const [selectedExamTypes, setSelectedExamTypes] = useState(["All Exams"]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/questions')
            .then(res => res.json())
            .then(data => {
                setAllQuestions(data.questions || []);
                setExamTypes(["All Exams", ...(data.examTypes || [])]);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching questions:', err);
                setLoading(false);
            });
    }, []);

    /* -------- exam chip toggle -------- */
    const handleExamTypeToggle = (type) => {
        if (type === "All Exams") {
            setSelectedExamTypes(["All Exams"]);
            return;
        }

        let updated;

        if (selectedExamTypes.includes(type)) {
            updated = selectedExamTypes.filter(t => t !== type);
        } else {
            updated = selectedExamTypes.filter(t => t !== "All Exams");
            updated.push(type);
        }

        if (updated.length === 0) {
            updated = ["All Exams"];
        }

        setSelectedExamTypes(updated);
    };

    /* -------- search handler -------- */
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const normalizeText = value => {
        if (Array.isArray(value)) {
            return value.join(" ").toLowerCase();
        }
        return String(value ?? "").toLowerCase();
    };


    /* -------- AVAILABLE YEARS (BASED ON SELECTED CHIPS) -------- */
    const availableYears = Array.from(
        new Set(
            allQuestions
                .filter(q =>
                    selectedExamTypes.includes("All Exams") ||
                    selectedExamTypes.includes(q.examType)
                )
                .map(q => extractYear(q.examName))
                .filter(Boolean)
        )
    ).sort((a, b) => b - a);

    /* -------- auto-reset invalid year -------- */
    useEffect(() => {
        if (
            selectedYear !== "all" &&
            !availableYears.includes(selectedYear)
        ) {
            setSelectedYear("all");
        }
    }, [availableYears, selectedYear]);

    /* -------- FINAL FILTERED QUESTIONS -------- */
    const filteredQuestions = allQuestions.filter(q => {
        const examMatch =
            selectedExamTypes.includes("All Exams") ||
            selectedExamTypes.includes(q.examType);

        if (!examMatch) return false;

        if (selectedYear !== "all") {
            const year = extractYear(q.examName);
            if (year !== selectedYear) return false;
        }

        if (!searchQuery.trim()) return true;

        const searchTerms = searchQuery
            .split(",")
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);

        return searchTerms.some(term =>
            normalizeText(q.questionText).includes(term) ||
            normalizeText(q.examName).includes(term) ||
            normalizeText(q.questionTopic).includes(term) ||
            String(q.questionNumber).includes(term)
        );
    });


    /* -------------------- render -------------------- */

    if (loading) {
        return (
            <div>
                <Navbar active="Home" />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading questions...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar active="Home" />

            <WindowText
                title="Rajasthan State Exams PYQs"
                description={`Attempt real exam-level questions and strengthen your preparation. ${allQuestions.length}+ PYQ available.`}
            />

            {/* Exam Type Chips */}
            <div className="flex flex-wrap gap-2 px-4 max-w-screen-xl mx-auto mb-4 justify-center items-center">
                {examTypes.map(type => (
                    <Chip
                        key={type}
                        name={type}
                        selected={selectedExamTypes.includes(type)}
                        onClick={() => handleExamTypeToggle(type)}
                    />
                ))}
            </div>

            {/* Search + Year */}
            <SearchInput
                onSearch={handleSearch}
                placeHolder="Search Category, Exam, Topic..."
                years={availableYears}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                resultCount={filteredQuestions.length}
            />

            {/* Quiz Cards */}
            <QuizContainer>
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question, index) => (
                        <QuizList key={index} question={question} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-2">
                        No quizzes found.
                    </p>
                )}
            </QuizContainer>

            <Footer />
            <ScrollToTop />
        </div>
    );
}

export default Quiz;
