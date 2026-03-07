const TOPIC_LIST_STYLES = `
  .topic-list-container {
    max-width: 800px;
  }
  .topic-list-header {
    margin-bottom: 28px;
  }
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 12px;
    margin-bottom: 16px;
    border-radius: 8px;
    transition: all 0.15s;
  }
  .back-btn:hover {
    background: var(--surface2);
    color: var(--text);
  }
  .topic-list-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 900;
    color: var(--text);
    margin-bottom: 8px;
  }
  .topic-list-header p {
    color: var(--muted);
    font-size: 14px;
  }
  .topic-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .topic-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 24px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .topic-item:hover {
    border-color: var(--accent);
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(108, 99, 255, 0.1);
  }
  .topic-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .topic-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  .topic-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
  }
  .topic-count {
    font-size: 13px;
    color: var(--muted);
  }
  .topic-arrow {
    color: var(--muted);
    font-size: 18px;
    transition: transform 0.2s;
  }
  .topic-item:hover .topic-arrow {
    transform: translateX(4px);
    color: var(--accent);
  }
  @media (max-width: 640px) {
    .topic-list-header h1 { font-size: 24px; }
    .topic-item { padding: 16px 20px; }
  }
`;

export default function TopicList({ subject, topics, onSelect, onBack }) {
  return (
    <>
      <style>{TOPIC_LIST_STYLES}</style>
      
      <div className="topic-list-container">
        <div className="topic-list-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Subjects
          </button>
          
          <h1>{subject}</h1>
          <p>{topics.length} topics available</p>
        </div>
        
        <div className="topic-list">
          {topics.map((topic, index) => (
            <button
              key={topic.id}
              className="topic-item"
              onClick={() => onSelect(topic.id)}
            >
              <div className="topic-info">
                <div className="topic-icon">
                  {String.fromCharCode(65 + index)}
                </div>
                <div>
                  <div className="topic-name">{topic.name}</div>
                  <div className="topic-count">{topic.questionCount} questions</div>
                </div>
              </div>
              <span className="topic-arrow">→</span>
            </button>
          ))}
        </div>
        
        {topics.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <p>No topics found for this subject</p>
          </div>
        )}
      </div>
    </>
  );
}
