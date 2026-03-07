import Image from "next/image";

const MATCH_LIST_STYLES = `
  .match-list-container {
    margin-bottom: 24px;
  }
  .match-table-container {
    overflow-x: auto;
    margin-bottom: 24px;
  }
  .match-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .match-table th {
    background: var(--surface2);
    padding: 14px 16px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border);
  }
  .match-table td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 14px;
    color: var(--text);
  }
  .match-table tr:last-child td {
    border-bottom: none;
  }
  .match-table tr:hover td {
    background: rgba(108, 99, 255, 0.05);
  }
  .match-item-id {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--accent);
    color: white;
    font-size: 11px;
    font-weight: 700;
    margin-right: 10px;
  }
  .match-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .match-option-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
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
  .match-option-btn:hover:not(:disabled) {
    border-color: var(--accent);
    background: rgba(108, 99, 255, 0.08);
  }
  .match-option-btn.selected {
    border-color: var(--accent);
    background: rgba(108, 99, 255, 0.15);
  }
  .match-option-btn.correct {
    border-color: var(--success);
    background: rgba(52, 211, 153, 0.12);
  }
  .match-option-btn.wrong {
    border-color: var(--error);
    background: rgba(248, 113, 113, 0.12);
  }
  .match-option-btn:disabled {
    cursor: default;
  }
  .match-option-letter {
    width: 26px;
    height: 26px;
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

const LETTERS = ["A", "B", "C", "D"];

export default function MatchListQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  showResult
}) {
  const { description, options } = question;
  
  if (!description || !description.list1_items || !description.list2_items) {
    return <p style={{ color: 'var(--muted)' }}>Match list data not available</p>;
  }

  const optionKeys = Object.keys(options || {});

  const getOptionClass = (key) => {
    let cls = "match-option-btn";
    
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
      <style>{MATCH_LIST_STYLES}</style>
      
      <div className="match-list-container">
        <div className="match-table-container">
          <table className="match-table">
            <thead>
              <tr>
                <th>{description.list1_title}</th>
                <th>{description.list2_title}</th>
              </tr>
            </thead>
            <tbody>
              {description.list1_items.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <span className="match-item-id">{item.id}</span>
                    {item.text || item.equation}
                  </td>
                  <td>
                    <span className="match-item-id">
                      {description.list2_items[index]?.id || '?'}
                    </span>
                    {description.list2_items[index]?.text || description.list2_items[index]?.type || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="match-options">
          {optionKeys.map((key, index) => {
            const letter = LETTERS[index] || key;
            
            return (
              <button
                key={key}
                className={getOptionClass(key)}
                onClick={() => handleClick(key)}
                disabled={showResult}
              >
                <span className="match-option-letter">{letter}</span>
                <span>{options[key]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
