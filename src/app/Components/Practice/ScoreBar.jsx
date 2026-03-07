const SCORE_BAR_STYLES = `
  .score-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  }
  .score-bar-info {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .score-bar-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .score-bar-label {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .score-bar-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
  }
  .score-bar-value.success {
    color: var(--success);
  }
  .score-bar-value.warning {
    color: #fbbf24;
  }
  .score-bar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .score-percentage {
    font-size: 24px;
    font-weight: 700;
    padding: 8px 20px;
    border-radius: 10px;
  }
  .score-percentage.excellent {
    background: rgba(52, 211, 153, 0.15);
    color: var(--success);
  }
  .score-percentage.good {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }
  .score-percentage.average {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }
  .score-percentage.poor {
    background: rgba(248, 113, 113, 0.15);
    color: var(--error);
  }
  .score-results {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .score-detail {
    font-size: 14px;
    color: var(--muted);
  }
  .score-detail strong {
    color: var(--text);
  }
`;

export default function ScoreBar({
  total,
  answeredCount,
  skippedCount,
  correctCount,
  showResults,
  onSubmit,
  onReset
}) {
  const allAnswered = answeredCount === total;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const getScoreClass = () => {
    if (percentage >= 80) return "excellent";
    if (percentage >= 60) return "good";
    if (percentage >= 40) return "average";
    return "poor";
  };

  return (
    <>
      <style>{SCORE_BAR_STYLES}</style>
      
      <div className="score-bar">
        <div className="score-bar-info">
          <div className="score-bar-stat">
            <span className="score-bar-label">Answered</span>
            <span className="score-bar-value">{answeredCount} / {total}</span>
          </div>
          
          <div className="score-bar-stat">
            <span className="score-bar-label">Skipped</span>
            <span className="score-bar-value warning">{skippedCount}</span>
          </div>
          
          {showResults && (
            <div className="score-bar-stat">
              <span className="score-bar-label">Correct</span>
              <span className="score-bar-value success">{correctCount}</span>
            </div>
          )}
        </div>
        
        <div className="score-bar-actions">
          {showResults ? (
            <>
              <div className="score-results">
                <span className="score-percentage {getScoreClass()}">
                  {percentage}%
                </span>
                <span className="score-detail">
                  <strong>{correctCount}</strong> correct out of {total} questions
                </span>
              </div>
              <button className="btn-secondary" onClick={onReset}>
                Try Again
              </button>
            </>
          ) : (
            <>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                {!allAnswered && "Answer all questions to submit"}
              </span>
              <button 
                className="btn-primary" 
                onClick={onSubmit}
                disabled={!allAnswered}
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
