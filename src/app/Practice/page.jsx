"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../Components/SideBar";
import Breadcrumb from "../Components/Breadcrumb";
import WelcomeScreen from "../Components/Welcomescreen";
import TopicCards from "../Components/Practice/TopicCards";
import QuestionRenderer from "../Components/Practice/QuestionRenderer";
import QuestionNav from "../Components/Practice/QuestionNav";
import ScoreBar from "../Components/Practice/ScoreBar";

async function fetchPracticeData(params = {}) {
  let url = '/api/practice';
  const queryParams = [];

  if (params.sidebar) {
    queryParams.push(`sidebar=true`);
  }
  if (params.subject) {
    queryParams.push(`subject=${encodeURIComponent(params.subject)}`);
  }
  if (params.topic) {
    queryParams.push(`topic=${encodeURIComponent(params.topic)}`);
  }

  if (queryParams.length > 0) {
    url += '?' + queryParams.join('&');
  }

  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectParam = searchParams.get("subject");
  const topicParam = searchParams.get("topic");

  const [sidebarData, setSidebarData] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openSubjects, setOpenSubjects] = useState(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadSidebarData = async () => {
      setLoading(true);
      try {
        const data = await fetchPracticeData({ sidebar: true });
        setSidebarData(data.subjects || []);
      } catch (e) {
        console.error("Error loading sidebar data:", e);
      }
      setLoading(false);
    };
    loadSidebarData();
  }, []);

  useEffect(() => {
    const loadTopics = async () => {
      if (subjectParam) {
        try {
          const data = await fetchPracticeData({ subject: subjectParam });
          setTopics(data.topics || []);
        } catch (e) {
          console.error("Error loading topics:", e);
        }
      } else {
        setTopics([]);
      }
    };
    loadTopics();
  }, [subjectParam]);

  useEffect(() => {
    const loadQuestions = async () => {
      if (subjectParam && topicParam) {
        try {
          const data = await fetchPracticeData({ subject: subjectParam, topic: topicParam });
          setQuestions(data.questions || []);
          setAnswers({});
          setCurrentIndex(0);
          setShowResults(false);
        } catch (e) {
          console.error("Error loading questions:", e);
        }
      } else {
        setQuestions([]);
      }
    };
    loadQuestions();
  }, [subjectParam, topicParam]);

  const handleNavigate = useCallback((subjectId, topicId) => {
    if (subjectId && topicId) {
      router.push(`/Practice?subject=${encodeURIComponent(subjectId)}&topic=${encodeURIComponent(topicId)}`);
    } else if (subjectId) {
      router.push(`/Practice?subject=${encodeURIComponent(subjectId)}`);
    } else {
      router.push("/Practice");
    }
    setMobileOpen(false);
  }, [router]);

  const toggleSubject = useCallback((id) => {
    setOpenSubjects((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const handleTopicSelect = useCallback((topicId) => {
    router.push(`/Practice?subject=${encodeURIComponent(subjectParam)}&topic=${encodeURIComponent(topicId)}`);
  }, [router, subjectParam]);

  const handleBackToSubjects = useCallback(() => {
    router.push("/Practice");
  }, [router]);

  const handleSelectAnswer = useCallback((answer) => {
    if (showResults) return;

    const question = questions[currentIndex];
    if (!question) return;

    setAnswers(prev => ({
      ...prev,
      [question.question_number]: answer
    }));
  }, [currentIndex, questions, showResults]);

  const handleJumpToQuestion = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const handleSubmit = useCallback(() => {
    setShowResults(true);
  }, []);

  const handleReset = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  }, []);

  const getAnsweredCount = useCallback(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const getSkippedCount = useCallback(() => {
    return questions.filter(q => answers[q.question_number] === "E").length;
  }, [answers, questions]);

  const correctCount = questions.filter(q => {
    const userAnswer = answers[q.question_number];
    return userAnswer === q.correct_answer;
  }).length;

  const currentSubject = sidebarData.find(s => s.id === subjectParam);
  const currentTopic = currentSubject?.topics.find(t => t.id === topicParam) || null;

  if (loading) {
    return (
      <>
        <style></style>
        <div className="layout">
          <div className="main">
            <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
              <p style={{ color: 'var(--muted)' }}>Loading...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const hasSubject = !!subjectParam;
  const hasTopic = !!topicParam;

  return (
    <>
      <style></style>
      <div className="layout">
        <Sidebar
          subjects={sidebarData}
          selectedSubject={subjectParam}
          selectedTopic={topicParam}
          openSubjects={openSubjects}
          onToggleSubject={toggleSubject}
          onNavigate={handleNavigate}
          onHomeClick={() => router.push('/')}
        />

        {mobileOpen && (
          <>
            <div
              className="mobile-overlay"
              onClick={() => setMobileOpen(false)}
            />
            <Sidebar
              subjects={sidebarData}
              selectedSubject={subjectParam}
              selectedTopic={topicParam}
              openSubjects={openSubjects}
              onToggleSubject={toggleSubject}
              onNavigate={handleNavigate}
              extraClass="mobile-open"
              onHomeClick={() => router.push('/')}
            />
          </>
        )}

        <div className="main">
          <Breadcrumb
            currentSubject={currentSubject}
            currentTopic={currentTopic}
            onNavigate={handleNavigate}
          />

          <div className="content" style={{ paddingBottom: '100px' }}>
            {hasSubject && !hasTopic && (
              <TopicCards
                subject={currentSubject}
                topics={topics}
                onSelect={handleTopicSelect}
                onBack={handleBackToSubjects}
              />
            )}

            {hasTopic && questions.length > 0 && (
              <>
                <QuestionRenderer
                  question={questions[currentIndex]}
                  questionNumber={currentIndex + 1}
                  totalQuestions={questions.length}
                  selectedAnswer={answers[questions[currentIndex].question_number] || null}
                  onSelectAnswer={handleSelectAnswer}
                  showResult={showResults}
                />

                <QuestionNav
                  questions={questions}
                  answers={answers}
                  showResults={showResults}
                  currentIndex={currentIndex}
                  onJump={handleJumpToQuestion}
                />

                <ScoreBar
                  total={questions.length}
                  answeredCount={getAnsweredCount()}
                  skippedCount={getSkippedCount()}
                  correctCount={correctCount}
                  showResults={showResults}
                  onSubmit={handleSubmit}
                  onReset={handleReset}
                />
              </>
            )}

            {hasTopic && questions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                <p> this topic.No questions found for</p>
                <button className="btn-secondary" onClick={() => router.push(`/Practice?subject=${subjectParam}`)} style={{ marginTop: '16px' }}>
                  Go Back
                </button>
              </div>
            )}

            {!hasSubject && (
              <WelcomeScreen subjects={sidebarData} onNavigate={handleNavigate} />
            )}
          </div>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
    </>
  );
}
