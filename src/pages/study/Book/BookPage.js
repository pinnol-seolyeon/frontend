import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import '../Book/BookPage.css';

function BookPage() {
  const navigate = useNavigate();

  // 🛡 useOutletContext가 null일 수 있으므로 방어적 처리
  const outletContext = useOutletContext() || {};
  const { userProgress = { completedSteps: [] } } = outletContext;

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedStages, setCompletedStages] = useState([]);

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);

        const completed = Array.isArray(userProgress?.completedSteps)
          ? userProgress.completedSteps
          : Object.keys(userProgress?.completedSteps || {}).map(Number);

        setCompletedStages(completed);
      } catch (error) {
        console.error('Review page error:', error);
        setError(error.message || '페이지를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [userProgress]);

  const reviewModules = [
    { title: "1단계: 금융의 기초", completed: completedStages.includes(1), icon: "📘", id: 1 },
    { title: "2단계: 저축과 투자", completed: completedStages.includes(2), icon: "💰", id: 2 },
    { title: "3단계: 현명한 소비", completed: completedStages.includes(3), icon: "🛒", id: 3 },
    { title: "4단계: 용돈 관리", completed: completedStages.includes(4), icon: "💵", id: 4 },
    { title: "5단계: 미래 설계", completed: completedStages.includes(5), icon: "🎯", id: 5 },
    { title: "6단계: 금융 생활", completed: completedStages.includes(6), icon: "🏦", id: 6 }
  ];

  const handleReview = (moduleId) => {
    navigate(`/main/learning/${moduleId}`, { state: { isReview: true } });
  };

  const handleQuiz = (moduleId) => {
    navigate(`/main/learning/${moduleId}`, { state: { isReview: true, isQuiz: true } });
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="review-page">
      <div className="page-header">
        {/* <h2>학습 복습하기</h2>
        <p>완료한 단계들을 다시 학습하고 복습해보세요!</p> */}
      </div>

      <div className="review-modules">
        {reviewModules.map((module) => (
          <div
            key={module.id}
            className={`review-card ${module.completed ? 'completed' : 'locked'}`}
          >
            <div className="module-icon">{module.icon}</div>
            <h3>{module.title}</h3>
            <div className="review-status">
              {module.completed ? '완료' : '잠김'}
            </div>
            <div className="review-buttons">
              <button
                className="review-btn"
                onClick={() => handleReview(module.id)}
                disabled={!module.completed}
              >
                학습 내용 복습
              </button>
              <button
                className="quiz-btn"
                onClick={() => handleQuiz(module.id)}
                disabled={!module.completed}
              >
                퀴즈 다시 풀기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookPage;
