import SimpleQuestion from "./SimpleQuestion";
import MatchListQuestion from "./MatchListQuestion";
import ImageQuestion from "./ImageQuestion";

const QUESTION_RENDERER_STYLES = `
  .question-renderer {
    max-width: 900px;
    margin: 0 auto;
  }
  .question-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }
  .question-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .question-number-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    font-size: 14px;
    font-weight: 700;
    color: white;
  }
  .question-topic {
    font-size: 13px;
    color: var(--muted);
    background: var(--surface2);
    padding: 6px 12px;
    border-radius: 20px;
  }
  .question-text {
    font-size: 16px;
    line-height: 1.7;
    color: var(--text);
    margin-bottom: 24px;
  }
  .question-type-badge {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 12px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .question-type-badge.match { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
  .question-type-badge.image { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
`;

export default function QuestionRenderer({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult
}) {
  const getQuestionType = () => {
    if (!question) return null;
    return question.question_type;
  };

  const questionType = getQuestionType();

  const renderQuestion = () => {
    switch (questionType) {
      case "Match_List1_With_L2":
        return (
          <MatchListQuestion
            question={question}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            showResult={showResult}
          />
        );
      case "Image-Based-Question":
        return (
          <ImageQuestion
            question={question}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            showResult={showResult}
          />
        );
      default:
        return (
          <SimpleQuestion
            question={question}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
            showResult={showResult}
          />
        );
    }
  };

  const getTypeBadge = () => {
    switch (questionType) {
      case "Match_List1_With_L2":
        return <span className="question-type-badge match">Match List</span>;
      case "Image-Based-Question":
        return <span className="question-type-badge image">Image Based</span>;
      default:
        return null;
    }
  };

  if (!question) {
    return null;
  }

  return (
    <>
      <style>{QUESTION_RENDERER_STYLES}</style>
      
      <div className="question-renderer">
        <div className="question-header">
          <div className="question-meta">
            <span className="question-number-badge">
              {questionNumber}/{totalQuestions}
            </span>
            {question.topics && question.topics.length > 0 && (
              <span className="question-topic">
                {Array.isArray(question.topics) ? question.topics[0] : question.topics}
              </span>
            )}
          </div>
          {getTypeBadge()}
        </div>
        
        <div className="question-text">
          <span style={{ fontWeight: '600', marginRight: '8px' }}>
            Q.{question.question_number}.
          </span>
          <span dangerouslySetInnerHTML={{ __html: question.question_text }} />
        </div>
        
        {renderQuestion()}
      </div>
    </>
  );
}
