const SIMPLE_QUESTION_STYLES = `
  .options-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .option-btn {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: var(--surface2);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
    line-height: 1.5;
  }
  .option-btn:hover:not(:disabled) {
    border-color: var(--accent);
    background: rgba(108, 99, 255, 0.08);
  }
  .option-btn.selected {
    border-color: var(--accent);
    background: rgba(108, 99, 255, 0.15);
  }
  .option-btn.correct {
    border-color: var(--success);
    background: rgba(52, 211, 153, 0.12);
    color: var(--success);
  }
  .option-btn.wrong {
    border-color: var(--error);
    background: rgba(248, 113, 113, 0.12);
    color: var(--error);
  }
  .option-btn.skipped {
    opacity: 0.6;
    font-style: italic;
  }
  .option-btn:disabled {
    cursor: default;
  }
  .option-letter {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .option-text {
    flex: 1;
  }
  .result-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    font-size: 13px;
    font-weight: 600;
  }
`;

const LETTERS = ["A", "B", "C", "D", "E"];

export default function SimpleQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  showResult
}) {
  const options = question.options;
  
  if (!options) {
    return <p style={{ color: 'var(--muted)' }}>No options available</p>;
  }

  const optionKeys = Object.keys(options);
  const isSkipped = selectedAnswer === "E";

  const getOptionClass = (key) => {
    let cls = "option-btn";
    
    if (!showResult) {
      if (selectedAnswer === key) {
        return cls + " selected";
      }
      return cls;
    }
    
    if (key === question.correct_answer) {
      return cls + " correct";
    }
    
    if (selectedAnswer === key && key !== question.correct_answer) {
      return cls + " wrong";
    }
    
    if (key === "E" && isSkipped) {
      return cls + " skipped";
    }
    
    return cls;
  };

  const getResultText = (key) => {
    if (!showResult) return null;
    
    if (key === question.correct_answer) {
      return <span className="result-indicator">✓ Correct</span>;
    }
    
    if (selectedAnswer === key && key !== question.correct_answer) {
      return <span className="result-indicator">✗ Wrong</span>;
    }
    
    return null;
  };

  const handleClick = (key) => {
    if (showResult) return;
    onSelectAnswer(key);
  };

  return (
    <>
      <style>{SIMPLE_QUESTION_STYLES}</style>
      
      <div className="options-container">
        {optionKeys.map((key, index) => {
          const letter = LETTERS[index] || key;
          const isNotAttempted = key === "E" && options[key] === "Question not attempted";
          
          return (
            <button
              key={key}
              className={getOptionClass(key)}
              onClick={() => handleClick(key)}
              disabled={showResult}
            >
              <span className="option-letter">{letter}</span>
              <span className="option-text">
                {options[key]}
              </span>
              {getResultText(key)}
            </button>
          );
        })}
      </div>
    </>
  );
}
