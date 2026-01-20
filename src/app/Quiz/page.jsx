"use client"
import React, { useState } from 'react'
import Navbar from '../Components/NavBar'
import Footer from '../Components/Footer'
import WindowText from '../Components/WindowText'
import SearchInput from '../Components/SearchInput'
import QuizContainer from '../Components/QuizContainer'
import QuizList from '../Components/QuizList'
import ScrollToTop from '../Components/ScrollToTop'
import { questions } from '../Constants/Questions'

function Quiz() {
    const [filteredQuestions, setFilteredQuestions] = useState(questions)

    const handleSearch = (query) => {
        const searchTerms = query.split(',').map(term => term.trim()).filter(term => term);

        if (searchTerms.length === 0) {
            setFilteredQuestions(questions);
            return;
        }

        const filtered = questions.filter(q => {
            return searchTerms.some(term => {
                const lowerCaseTerm = term.toLowerCase();

                return (
                    q.question_text.toLowerCase().includes(lowerCaseTerm) ||
                    q.exam_name.toLowerCase().includes(lowerCaseTerm) ||
                    q.question_topic.toLowerCase().includes(lowerCaseTerm) ||
                    String(q.question_number).includes(term)
                );
            });
        });

        setFilteredQuestions(filtered);
    };

    return (
        <div>
            <Navbar active="Home" />

            <WindowText
                title="Rajasthan State Exams PYQs"
                description={`Attempt real exam-level questions and strengthen your preparation. ${questions.length}+ PYQ available.`}
            />

            <SearchInput
                onSearch={handleSearch}
                placeHolder="Search Category, Exam, Topic...  "
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

            {/* Scroll to Top Button */}
            <ScrollToTop />
        </div>
    )
}

export default Quiz