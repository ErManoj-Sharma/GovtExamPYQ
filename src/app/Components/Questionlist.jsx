"use client";

import { useState } from "react";
import QuestionCard from "./Questioncard";
import ScoreBar from "./scorebar";
import WelcomeScreen from "./Welcomescreen";
import { examData } from "./../Constants/Practice/examdata";

/**
 * QuestionList
 *
 * Props:
 *  - topic       {object|null}  current topic object (or null for welcome screen)
 *  - onNavigate  (subjectId: string, topicId: string) => void
 */

const TOPIC_HEADER_STYLES = `
  .topic-header {
    background: linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.08));
    border: 1px solid rgba(108,99,255,0.25);
    border-radius: 16px;
    padding: 28px 32px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .topic-header-icon { font-size: 48px; }
  .topic-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 900;
    margin-bottom: 4px;
  }
  .topic-header p { color: var(--muted); font-size: 14px; }
`;

export default function QuestionList({ topic, onNavigate }) {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [lastTopicId, setLastTopicId] = useState(null);

    // Reset state whenever the topic changes
    if (topic && topic.id !== lastTopicId) {
        setSelectedAnswers({});
        setShowResults(false);
        setLastTopicId(topic.id);
    }

    if (!topic) {
        return <WelcomeScreen subjects={examData} onNavigate={onNavigate} />;
    }

    const handleAnswer = (qid, idx) => {
        if (!showResults) setSelectedAnswers((p) => ({ ...p, [qid]: idx }));
    };

    const correctCount = topic.questions.filter(
        (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;

    return (
        <>
            <style>{TOPIC_HEADER_STYLES}</style>

            {/* Topic header */}
            <div className="topic-header">
                <div className="topic-header-icon">{topic.icon}</div>
                <div>
                    <h1>{topic.name}</h1>
                    <p>{topic.questions.length} questions • Test your knowledge</p>
                </div>
            </div>

            {/* Questions */}
            {topic.questions.map((q, i) => (
                <QuestionCard
                    key={q.id}
                    question={q}
                    index={i + 1}
                    selectedAnswer={selectedAnswers[q.id]}
                    onSelectAnswer={(idx) => handleAnswer(q.id, idx)}
                    showResult={showResults}
                />
            ))}

            {/* Footer score / submit bar */}
            <ScoreBar
                total={topic.questions.length}
                answeredCount={Object.keys(selectedAnswers).length}
                correctCount={correctCount}
                showResults={showResults}
                onSubmit={() => setShowResults(true)}
                onReset={() => { setSelectedAnswers({}); setShowResults(false); }}
            />
        </>
    );
}