"use client";

/**
 * Breadcrumb
 *
 * Props:
 *  - currentSubject  {object|undefined}  full subject object
 *  - currentTopic    {object|undefined}  full topic object
 *  - onNavigate      (subjectId?, topicId?) => void
 */

const BREADCRUMB_STYLES = `
  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 16px 32px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--muted);
  }
  .breadcrumb-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.15s;
  }
  .breadcrumb-btn:hover { color: var(--text); background: var(--surface2); }
  .breadcrumb-sep { color: var(--border); }
  .breadcrumb-current { color: var(--text); font-weight: 600; padding: 4px 8px; }
`;

export default function Breadcrumb({ currentSubject, currentTopic, onNavigate }) {
    return (
        <>
            <style>{BREADCRUMB_STYLES}</style>
            <div className="topbar">
                <nav className="breadcrumb">
                    <button className="breadcrumb-btn" onClick={() => onNavigate()}>
                        🏠 Dashboard
                    </button>

                    {currentSubject && (
                        <>
                            <span className="breadcrumb-sep">›</span>
                            <button
                                className="breadcrumb-btn"
                                onClick={() => onNavigate(currentSubject.id)}
                            >
                                {currentSubject.name}
                            </button>
                        </>
                    )}

                    {currentTopic && (
                        <>
                            <span className="breadcrumb-sep">›</span>
                            <span className="breadcrumb-current">{currentTopic.name}</span>
                        </>
                    )}
                </nav>
            </div>
        </>
    );
}