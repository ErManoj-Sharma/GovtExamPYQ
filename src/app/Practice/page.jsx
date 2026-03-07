"use client";

import { useState } from "react";
import Sidebar from "../Components/SideBar";
import Breadcrumb from "../Components/Breadcrumb";
import QuestionList from "../Components/Questionlist";
import { examData } from "../Constants/Practice/examdata";
import { GLOBAL_STYLES } from "../../lib/styles";

export default function Page() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [openSubjects, setOpenSubjects] = useState(new Set());
    const [mobileOpen, setMobileOpen] = useState(false);

    // ── Helpers ────────────────────────────────────────────────────────────────

    const currentSubject = examData.find((s) => s.id === selectedSubject);
    const currentTopic = currentSubject?.topics.find((t) => t.id === selectedTopic) || null;

    const navigate = (subjectId, topicId) => {
        setSelectedSubject(subjectId || null);
        setSelectedTopic(topicId || null);
        // Auto-expand the subject in the sidebar when navigating to it
        if (subjectId) setOpenSubjects((p) => new Set([...p, subjectId]));
        setMobileOpen(false);
    };

    const toggleSubject = (id) => {
        setSelectedSubject(id);
        setOpenSubjects((prev) => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <>
            <style>{GLOBAL_STYLES}</style>

            <div className="layout">
                {/* ── Desktop sidebar ── */}
                <Sidebar
                    subjects={examData}
                    selectedSubject={selectedSubject}
                    selectedTopic={selectedTopic}
                    openSubjects={openSubjects}
                    onToggleSubject={toggleSubject}
                    onNavigate={navigate}
                />

                {/* ── Mobile sidebar + overlay ── */}
                {mobileOpen && (
                    <>
                        <div
                            className="mobile-overlay"
                            onClick={() => setMobileOpen(false)}
                        />
                        <Sidebar
                            subjects={examData}
                            selectedSubject={selectedSubject}
                            selectedTopic={selectedTopic}
                            openSubjects={openSubjects}
                            onToggleSubject={toggleSubject}
                            onNavigate={navigate}
                            extraClass="mobile-open"
                        />
                    </>
                )}

                {/* ── Main content area ── */}
                <div className="main">
                    <Breadcrumb
                        currentSubject={currentSubject}
                        currentTopic={currentTopic}
                        onNavigate={navigate}
                    />

                    <div className="content">
                        <QuestionList topic={currentTopic} onNavigate={navigate} />
                    </div>
                </div>

                {/* ── Mobile FAB toggle ── */}
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