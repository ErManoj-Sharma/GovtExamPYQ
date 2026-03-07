const QUESTION_NAV_STYLES = `
  .question-nav {
    max-width: 900px;
    margin: 32px auto;
    padding: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
  }
  .question-nav-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 16px;
  }
  .question-nav-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .question-nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1.5px solid var(--border);
    background: var(--surface2);
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .question-nav-btn:hover {
    border-color: var(--accent);
    color: var(--text);
  }
  .question-nav-btn.current {
    border-color: var(--accent);
    background: var(--accent);
    color: white;
  }
  .question-nav-btn.answered {
    background: rgba(52, 211, 153, 0.15);
    border-color: var(--success);
    color: var(--success);
  }
  .question-nav-btn.skipped {
    background: rgba(251, 191, 36, 0.15);
    border-color: #fbbf24;
    color: #fbbf24;
  }
  .question-nav-btn.wrong {
    background: rgba(248, 113, 113, 0.15);
    border-color: var(--error);
    color: var(--error);
  }
  .question-nav-btn.correct {
    background: rgba(52, 211, 153, 0.2);
    border-color: var(--success);
    color: var(--success);
    box-shadow: 0 0 0 2px var(--success);
  }
  .question-nav-btn.not-visited {
    opacity: 0.5;
  }
  .question-nav-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--muted);
  }
  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 4px;
  }
  .legend-dot.answered { background: rgba(52, 211, 153, 0.4); border: 1px solid var(--success); }
  .legend-dot.skipped { background: rgba(251, 191, 36, 0.4); border: 1px solid #fbbf24; }
  .legend-dot.wrong { background: rgba(248, 113, 113, 0.4); border: 1px solid var(--error); }
  .legend-dot.correct { background: rgba(52, 211, 153, 0.6); border: 2px solid var(--success); }
  .legend-dot.current { background: var(--accent); }
  .legend-dot.not-visited { background: var(--surface2); border: 1px solid var(--border); }
`;

export default function QuestionNav({
  questions,
  answers,
  showResults,
  currentIndex,
  onJump
}) {
  const getQuestionStatus = (question, index) => {
    const questionNum = question.question_number;
    const userAnswer = answers[questionNum];
    
    if (index === currentIndex) {
      return "current";
    }
    
    if (!userAnswer) {
      return "not-visited";
    }
    
    if (showResults) {
      if (userAnswer === question.correct_answer) {
        return "correct";
      }
      if (userAnswer === "E") {
        return "skipped";
      }
      return "wrong";
    }
    
    if (userAnswer === "E") {
      return "skipped";
    }
    
    return "answered";
  };

  return (
    <>
      <style>{QUESTION_NAV_STYLES}</style>
      
      <div className="question-nav">
        <div className="question-nav-title">
          Questions ({questions.length})
        </div>
        
        <div className="question-nav-grid">
          {questions.map((question, index) => {
            const status = getQuestionStatus(question, index);
            
            return (
              <button
                key={question.question_number}
                className={`question-nav-btn ${status}`}
                onClick={() => onJump(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        
        <div className="question-nav-legend">
          <div className="legend-item">
            <span className="legend-dot current"></span>
            Current
          </div>
          <div className="legend-item">
            <span className="legend-dot answered"></span>
            Answered
          </div>
          <div className="legend-item">
            <span className="legend-dot skipped"></span>
            Skipped (E)
          </div>
          {showResults && (
            <>
              <div className="legend-item">
                <span className="legend-dot correct"></span>
                Correct
              </div>
              <div className="legend-item">
                <span className="legend-dot wrong"></span>
                Wrong
              </div>
            </>
          )}
          {!showResults && (
            <div className="legend-item">
              <span className="legend-dot not-visited"></span>
              Not Visited
            </div>
          )}
        </div>
      </div>
    </>
  );
}
