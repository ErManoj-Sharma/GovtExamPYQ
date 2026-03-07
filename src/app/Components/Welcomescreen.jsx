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
  .welcome p { color: var(--muted); font-size: 16px; max-width: 500px; line-height: 1.6; margin-bottom: 8px; }
  .welcome-subtitle { color: var(--accent); font-size: 14px; font-weight: 600; margin-bottom: 32px; }

  .subject-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 20px;
    width: 100%;
    max-width: 800px;
  }
  .subject-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  .subject-card:hover {
    border-color: var(--accent);
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(108,99,255,0.2);
  }
  .subject-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }
  .subject-card-icon  { 
    font-size: 32px; 
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface2);
    border-radius: 12px;
  }
  .subject-card-name  { font-weight: 700; font-size: 16px; color: var(--text); }
  .subject-card-topics { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
  .subject-card-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--accent);
    font-weight: 600;
  }
  .subject-card-btn span { transition: transform 0.2s; }
  .subject-card:hover .subject-card-btn span { transform: translateX(4px); }
  
  .quick-links {
    margin-top: 40px;
    padding-top: 32px;
    border-top: 1px solid var(--border);
    width: 100%;
    max-width: 800px;
  }
  .quick-links h3 {
    font-size: 14px;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }
  .quick-links-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .quick-link {
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.15s;
  }
  .quick-link:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
`;

const ICONS = {
  Hindi: 'हि',
  Mathematics: '∑',
  Biology: '🧬',
  Chemistry: '⚗️',
  Physics: '⚡',
  History: '📜',
  AncientHistory: '🏛️',
  MedivalHistory: '⚔️',
  ModernHistory: '🚩',
  RajasthanHistory: '🕌',
  Geography: '🌍',
  IndianGeography: '🗺️',
  WorldGeography: '🌏',
  RajasthanGeography: '🏜️',
  Polity: '🏛️',
  StatePolity: '🪧',
  CurrentAffairs: '📰',
  Reasoning: '🧠',
  Economy: '💰',
  EconomicSurvey: '📊',
  Ecology: '🌿',
  Biotechnology: '🧫',
  ArtAndCulture: '🎨',
  ArtAndCultureofRajasthan: '🎨',
  Law: '⚖️',
  Science: '🔬',
};

function getSubjectIcon(subjectName) {
  return ICONS[subjectName] || '📚';
}

export default function WelcomeScreen({ subjects, onNavigate }) {
  const allTopics = subjects.flatMap(s =>
    s.topics.map(t => ({ subject: s.name, subjectId: s.id, ...t }))
  ).sort((a, b) => b.questionCount - a.questionCount).slice(0, 8);

  return (
    <>
      <style>{WELCOME_STYLES}</style>
      <div className="welcome">
        <div className="welcome-glyph">📖</div>
        <h1>Exam Practice Hub</h1>
        <p className="welcome-subtitle">Master your exam preparation with topic-wise practice questions</p>
        <p>Select a subject and topic from the sidebar to begin your practice session.</p>

        <div className="subject-cards">
          {subjects.slice(0, 3).map((s) => (
            <div
              key={s.id}
              className="subject-card"
              onClick={() => onNavigate(s.id, s.topics[0]?.id)}
            >
              <div className="subject-card-header">
                <div className="subject-card-icon">{getSubjectIcon(s.name)}</div>
                <div className="subject-card-name">{s.name}</div>
              </div>
              <div className="subject-card-topics">
                {s.topics.length} topics • {s.topics.reduce((sum, t) => sum + t.questionCount, 0)} questions
              </div>
              <div className="subject-card-btn">
                Start Practice <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}