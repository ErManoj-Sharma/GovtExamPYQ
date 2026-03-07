"use client";

/**
 * QuestionCard
 *
 * Props:
 *  - question        {object}   question object from examData
 *  - index           {number}   1-based display index
 *  - selectedAnswer  {number|undefined}
 *  - onSelectAnswer  (answerIndex: number) => void
 *  - showResult      {boolean}
 */

const QUESTION_CARD_STYLES = `
  .question-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px 28px;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .question-card.correct  { border-color: var(--success); }
  .question-card.incorrect { border-color: var(--error); }

  .q-number {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    font-size: 12px; font-weight: 700; margin-bottom: 12px;
  }
  .q-text { font-size: 15px; line-height: 1.65; color: var(--text); margin-bottom: 18px; }

  .options { display: flex; flex-direction: column; gap: 10px; }
  .option-btn {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 18px;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    background: var(--surface2);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
  }
  .option-btn:hover:not(:disabled) { border-color: var(--accent); background: rgba(108,99,255,0.08); }
  .option-btn.selected   { border-color: var(--accent); background: rgba(108,99,255,0.15); }
  .option-btn.correct-ans { border-color: var(--success); background: rgba(52,211,153,0.1); color: var(--success); }
  .option-btn.wrong-ans   { border-color: var(--error);   background: rgba(248,113,113,0.1); color: var(--error); }
  .option-btn:disabled { cursor: default; }

  .option-letter {
    width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
  }

  .result-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600;
    margin-bottom: 12px;
    padding: 4px 12px; border-radius: 20px;
  }
  .result-badge.correct   { background: rgba(52,211,153,0.15); color: var(--success); }
  .result-badge.incorrect { background: rgba(248,113,113,0.15); color: var(--error); }

  .explanation {
    margin-top: 14px;
    padding: 14px 16px;
    background: rgba(52,211,153,0.06);
    border-left: 3px solid var(--success);
    border-radius: 0 8px 8px 0;
    font-size: 13px;
    color: #a7f3d0;
    line-height: 1.6;
  }
`;

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({
    question,
    index,
    selectedAnswer,
    onSelectAnswer,
    showResult,
}) {
    const isCorrect = selectedAnswer === question.correctAnswer;

    const getOptionClass = (i) => {
        let cls = "option-btn";
        if (!showResult) {
            return selectedAnswer === i ? cls + " selected" : cls;
        }
        if (i === question.correctAnswer) return cls + " correct-ans";
        if (selectedAnswer === i && !isCorrect) return cls + " wrong-ans";
        return cls;
    };

    return (
        <>
            <style>{QUESTION_CARD_STYLES}</style>
            <div
                className={`question-card${showResult ? (isCorrect ? " correct" : " incorrect") : ""
                    }`}
            >
                {showResult && (
                    <div className={`result-badge ${isCorrect ? "correct" : "incorrect"}`}>
                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </div>
                )}

                <div className="q-number">{index}</div>
                <p className="q-text">{question.text}</p>

                <div className="options">
                    {question.options.map((opt, i) => (
                        <button
                            key={i}
                            className={getOptionClass(i)}
                            onClick={() => onSelectAnswer(i)}
                            disabled={showResult}
                        >
                            <span className="option-letter">{LETTERS[i]}</span>
                            {opt}
                        </button>
                    ))}
                </div>

                {showResult && (
                    <div className="explanation">
                        <strong>Explanation:</strong> {question.explanation}
                    </div>
                )}
            </div>
        </>
    );
}