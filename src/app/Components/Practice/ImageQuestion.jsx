import Image from "next/image";

const IMAGE_QUESTION_STYLES = `
  .image-question-container {
    margin-bottom: 24px;
  }
  .image-wrapper {
    margin-bottom: 24px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
    background: var(--surface2);
  }
  .image-wrapper img {
    width: 100%;
    height: auto;
    display: block;
  }
  .image-caption {
    padding: 12px 16px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    font-size: 13px;
    color: var(--muted);
    font-style: italic;
  }
  .image-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .image-option-btn {
    display: flex;
    align-items: center;
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
  }
  .image-option-btn:hover:not(:disabled) {
    border-color: var(--accent);
    background: rgba(108, 99, 255, 0.08);
  }
  .image-option-btn.selected {
    border-color: var(--accent);
    background: rgba(108, 99, 255, 0.15);
  }
  .image-option-btn.correct {
    border-color: var(--success);
    background: rgba(52, 211, 153, 0.12);
  }
  .image-option-btn.wrong {
    border-color: var(--error);
    background: rgba(248, 113, 113, 0.12);
  }
  .image-option-btn:disabled {
    cursor: default;
  }
  .image-option-letter {
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
`;

const LETTERS = ["A", "B", "C", "D", "E"];

export default function ImageQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  showResult
}) {
  const { image_url, image_description, options } = question;
  
  if (!options) {
    return <p style={{ color: 'var(--muted)' }}>No options available</p>;
  }

  const optionKeys = Object.keys(options);

  const getOptionClass = (key) => {
    let cls = "image-option-btn";
    
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
    
    return cls;
  };

  const handleClick = (key) => {
    if (showResult) return;
    onSelectAnswer(key);
  };

  return (
    <>
      <style>{IMAGE_QUESTION_STYLES}</style>
      
      <div className="image-question-container">
        {image_url && (
          <div className="image-wrapper">
            <Image
              src={image_url}
              alt={image_description || `Question ${question.question_number}`}
              width={800}
              height={450}
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
            {image_description && (
              <div className="image-caption">{image_description}</div>
            )}
          </div>
        )}
        
        <div className="image-options">
          {optionKeys.map((key, index) => {
            const letter = LETTERS[index] || key;
            
            return (
              <button
                key={key}
                className={getOptionClass(key)}
                onClick={() => handleClick(key)}
                disabled={showResult}
              >
                <span className="image-option-letter">{letter}</span>
                <span>{options[key]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
