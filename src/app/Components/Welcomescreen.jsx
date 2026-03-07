"use client";

/**
 * WelcomeScreen  –  shown when no topic is selected.
 *
 * Props:
 *  - subjects    {Array}   examData array
 *  - onNavigate  (subjectId: string, topicId: string) => void
 */

const WELCOME_STYLES = `
  .welcome {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; text-align: center;
  }
  .welcome-glyph {
    font-size: 80px;
    margin-bottom: 24px;
    filter: drop-shadow(0 0 40px rgba(108,99,255,0.4));
  }
  .welcome h1 {
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    font-weight: 900;
    margin-bottom: 12px;
    background: linear-gradient(135deg, var(--text), var(--muted));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .welcome p { color: var(--muted); font-size: 16px; max-width: 400px; line-height: 1.6; }

  .subject-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    margin-top: 40px;
    width: 100%;
    max-width: 620px;
  }
  .subject-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  .subject-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(108,99,255,0.15);
  }
  .subject-card-icon  { font-size: 28px; margin-bottom: 10px; }
  .subject-card-name  { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
  .subject-card-count { font-size: 12px; color: var(--muted); }
`;

export default function WelcomeScreen({ subjects, onNavigate }) {
    return (
        <>
            <style>{WELCOME_STYLES}</style>
            <div className="welcome">
                <div className="welcome-glyph">📖</div>
                <h1>Exam Practice Hub</h1>
                <p>Select a subject and topic from the sidebar to begin your practice session.</p>
                <div className="subject-cards">
                    {subjects.map((s) => (
                        <div
                            key={s.id}
                            className="subject-card"
                            onClick={() => onNavigate(s.id, s.topics[0].id)}
                        >
                            <div className="subject-card-icon">{s.icon}</div>
                            <div className="subject-card-name">{s.name}</div>
                            <div className="subject-card-count">{s.topics.length} topics</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}