"use client";
import React, { useState } from "react";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";
import WindowText from "../Components/WindowText";
import SearchInput from "../Components/SearchInput";
import QuizContainer from "../Components/QuizContainer";
import QuizList from "../Components/QuizList";
import ScrollToTop from "../Components/ScrollToTop";
import { questions } from "../Constants/Questions";
import Chip from "../Components/Chip";

// Extract unique exam types
const examTypes = ["All Exams", ...new Set(questions.map(q => q.exam_type))];

function Quiz() {
    const [selectedExamTypes, setSelectedExamTypes] = useState(["All Exams"]);
    const [searchQuery, setSearchQuery] = useState("");

    // Handle chip selection
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

    // Handle search input
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // ✅ Final filtered questions (derived state)
    const filteredQuestions = questions.filter(q => {
        // Exam type filter
        const examMatch =
            selectedExamTypes.includes("All Exams") ||
            selectedExamTypes.includes(q.exam_type);

        if (!examMatch) return false;

        // Search filter
        if (!searchQuery.trim()) return true;

        const searchTerms = searchQuery
            .split(",")
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);

        return searchTerms.some(term =>
            q.question_text.toLowerCase().includes(term) ||
            q.exam_name.toLowerCase().includes(term) ||
            q.question_topic.toLowerCase().includes(term) ||
            String(q.question_number).includes(term)
        );
    });

    return (
        <div>
            <Navbar active="Home" />

            <WindowText
                title="Rajasthan State Exams PYQs"
                description={`Attempt real exam-level questions and strengthen your preparation. ${questions.length}+ PYQ available.`}
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



            {/* Search */}
            <SearchInput
                onSearch={handleSearch}
                placeHolder="Search Category, Exam, Topic..."
            />

            {/* Quiz Cards */}
            <QuizContainer>
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question, index) => (
                        <QuizList
                            key={index}
                            question={question}
                        />
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
