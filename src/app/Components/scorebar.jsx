"use client";

/**
 * ScoreBar  –  sticky footer shown at the bottom of the question list.
 *
 * Props:
 *  - total           {number}   total number of questions
 *  - answeredCount   {number}   how many have been answered
 *  - correctCount    {number}   how many are correct (only meaningful after submit)
 *  - showResults     {boolean}
 *  - onSubmit        () => void
 *  - onReset         () => void
 */

const SCORE_BAR_STYLES = `
  .footer-bar {
    position: sticky; bottom: 0;
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 20px 32px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .progress-info { font-size: 14px; color: var(--muted); }
  .progress-info strong { color: var(--text); }

  .score-wrap { display: flex; align-items: center; gap: 20px; }
  .score-ring {
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 15px; font-weight: 900;
  }
  .score-ring.great { background: rgba(52,211,153,0.15);  color: var(--success); border: 2px solid var(--success); }
  .score-ring.ok    { background: rgba(251,191,36,0.15);  color: #fbbf24;        border: 2px solid #fbbf24; }
  .score-ring.poor  { background: rgba(248,113,113,0.15); color: var(--error);   border: 2px solid var(--error); }
  .score-label { font-size: 15px; font-weight: 600; }
  .score-sub   { font-size: 13px; color: var(--muted); margin-top: 2px; }
`;

export default function ScoreBar({
    total,
    answeredCount,
    correctCount,
    showResults,
    onSubmit,
    onReset,
}) {
    const pct = Math.round((correctCount / total) * 100);
    const scoreClass = pct >= 70 ? "great" : pct >= 40 ? "ok" : "poor";

    return (
        <>
            <style>{SCORE_BAR_STYLES}</style>
            <div className="footer-bar">
                {showResults ? (
                    <div className="score-wrap">
                        <div className={`score-ring ${scoreClass}`}>{pct}%</div>
                        <div>
                            <div className="score-label">Quiz Complete!</div>
                            <div className="score-sub">
                                {correctCount} / {total} correct
                            </div>
                        </div>
                    </div>
                ) : (
                    <span className="progress-info">
                        Answered: <strong>{answeredCount}/{total}</strong>
                    </span>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                    {showResults && (
                        <button className="btn-secondary" onClick={onReset}>
                            Try Again
                        </button>
                    )}
                    {!showResults && (
                        <button
                            className="btn-primary"
                            disabled={answeredCount < total}
                            onClick={onSubmit}
                        >
                            Submit Answers
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}