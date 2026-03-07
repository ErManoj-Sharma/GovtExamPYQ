"use client";

/**
 * Sidebar
 *
 * Props:
 *  - subjects       {Array}    examData array
 *  - selectedSubject {string|null}
 *  - selectedTopic   {string|null}
 *  - openSubjects    {Set<string>}
 *  - onToggleSubject (subjectId: string) => void
 *  - onNavigate      (subjectId: string, topicId: string) => void
 *  - extraClass      {string}   optional extra className (e.g. "mobile-open")
 */

const SIDEBAR_STYLES = `
  .sidebar {
    width: 260px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    overflow-y: auto;
    position: sticky;
    top: 0;
    height: 100vh;
  }
  .sidebar-logo {
    padding: 28px 24px 20px;
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 900;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-section { padding: 16px 12px; }
  .sidebar-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
    padding: 0 12px;
    margin-bottom: 10px;
  }
  .subject-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: 2px;
  }
  .subject-btn:hover { background: var(--surface2); }
  .subject-btn.active {
    background: linear-gradient(135deg, rgba(108,99,255,0.25), rgba(255,101,132,0.15));
    color: #a89fff;
  }
  .subject-icon { font-size: 18px; margin-right: 10px; }
  .chevron { transition: transform 0.2s; color: var(--muted); font-size: 12px; }
  .chevron.open { transform: rotate(180deg); }
  .topic-list {
    padding-left: 14px;
    margin-bottom: 4px;
    border-left: 2px solid var(--border);
    margin-left: 22px;
  }
  .topic-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
    margin-bottom: 2px;
  }
  .topic-btn:hover { color: var(--text); background: rgba(255,255,255,0.04); }
  .topic-btn.active { color: #a89fff; background: rgba(108,99,255,0.15); font-weight: 600; }
  .topic-count {
    margin-left: auto;
    font-size: 11px;
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 1px 7px;
    border-radius: 20px;
    color: var(--muted);
  }
`;

export default function Sidebar({
    subjects,
    selectedSubject,
    selectedTopic,
    openSubjects,
    onToggleSubject,
    onNavigate,
    extraClass = "",
}) {
    return (
        <>
            <style>{SIDEBAR_STYLES}</style>
            <aside className={`sidebar ${extraClass}`.trim()}>
                <div className="sidebar-logo">ExamPrep</div>
                <div className="sidebar-section">
                    <div className="sidebar-label">Subjects</div>
                    {subjects.map((subject) => (
                        <div key={subject.id}>
                            <button
                                className={`subject-btn${selectedSubject === subject.id ? " active" : ""}`}
                                onClick={() => {
                                    onToggleSubject(subject.id);
                                }}
                            >
                                <span style={{ display: "flex", alignItems: "center" }}>
                                    <span className="subject-icon">{subject.icon}</span>
                                    {subject.name}
                                </span>
                                <span className={`chevron${openSubjects.has(subject.id) ? " open" : ""}`}>
                                    ▼
                                </span>
                            </button>

                            {openSubjects.has(subject.id) && (
                                <div className="topic-list">
                                    {subject.topics.map((topic) => (
                                        <button
                                            key={topic.id}
                                            className={`topic-btn${selectedTopic === topic.id &&
                                                selectedSubject === subject.id
                                                ? " active"
                                                : ""
                                                }`}
                                            onClick={() => onNavigate(subject.id, topic.id)}
                                        >
                                            <span>{topic.icon}</span>
                                            <span>{topic.name}</span>
                                            <span className="topic-count">{topic.questionCount}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
}