const TOPIC_CARDS_STYLES = `
  .topic-cards-container {
    max-width: 900px;
    margin: 0 auto;
  }
  .topic-cards-header {
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
  .topic-cards-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 900;
    color: var(--text);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .topic-cards-header p {
    color: var(--muted);
    font-size: 14px;
  }
  .topic-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  .topic-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  .topic-card:hover {
    border-color: var(--accent);
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(108,99,255,0.15);
  }
  .topic-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .topic-card-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
  }
  .topic-card-count {
    font-size: 12px;
    color: var(--muted);
    background: var(--surface2);
    padding: 4px 10px;
    border-radius: 20px;
  }
  .topic-card-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--accent);
    font-weight: 600;
    margin-top: 8px;
  }
  .topic-card-btn span {
    transition: transform 0.2s;
  }
  .topic-card:hover .topic-card-btn span {
    transform: translateX(4px);
  }
`;

export default function TopicCards({ subject, topics, onSelect, onBack }) {
  if (!subject || !topics || topics.length === 0) {
    return null;
  }

  return (
    <>
      <style>{TOPIC_CARDS_STYLES}</style>

      <div className="topic-cards-container">
        <div className="topic-cards-header">


          <h1>
            <span>{subject.icon}</span>
            {subject.name}
          </h1>
          <p>{topics.length} topics available</p>
        </div>

        <div className="topic-cards-grid">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="topic-card"
              onClick={() => onSelect(topic.id)}
            >
              <div className="topic-card-header">
                <div className="topic-card-name">{topic.name}</div>
                <div className="topic-card-count">{topic.questionCount} Q</div>
              </div>
              <div className="topic-card-btn">
                Start Practice <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
