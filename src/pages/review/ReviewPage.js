import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import ReviewPageCSS from '../review/ReviewPage.css';

const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 0;
  padding: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const MainWrapper = styled.div` 
  flex: 1;
  min-height: calc(100vh - var(--header-height, 70px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  max-width: 100%;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: flex-start;
  margin: 2rem 0 ;
`;

const TitleText = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #191919;
  margin-bottom: 0.5rem;
`;

const SubTitleText = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: #191919;
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  max-width: 100%;
  gap: 1rem;
`;

const ReviewCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  width: 100%;
  max-width: 100%;
  border: 1px solid #DADADA;
  border-radius: 5px;
  padding: 1.3rem 1rem;
`;

const ReviewContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  width: fit-content;
  gap: 1rem;
`;

const ReviewIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #F7F7F7;
`;

const ReviewIcon = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #191919;
`;

const ReviewTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #191919;
`;

const ReviewSubTitle = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #9E9E9E;
`

const ReviewStatus = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #191919;
`;

const ReviewButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const ReviewButton = styled.button`
  padding: 0.5rem 4rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: #F0F4FC;
  background-color: #2D7BED;
`;

const ReviewText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  width: fit-content;
  gap: 0.5rem;
`;

function ReviewPage({ user, login, setLogin }) {
  const navigate = useNavigate();
  
  // API 관련 상태 및 로직은 임시로 주석 처리
  // const { userProgress } = useOutletContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedStages, setCompletedStages] = useState([]);

  // API 호출 부분은 임시로 주석 처리
  // useEffect(() => {
  //   const initializePage = async () => {
  //     try {
  //       setLoading(true);
  //       if (!auth.currentUser) {
  //         throw new Error('로그인이 필요합니다.');
  //       }
        
  //       // completedSteps 데이터 처리
  //       const completed = Array.isArray(userProgress?.completedSteps) 
  //         ? userProgress.completedSteps 
  //         : Object.keys(userProgress?.completedSteps || {}).map(Number);
        
  //       setCompletedStages(completed);
  //     } catch (error) {
  //       console.error('Review page error:', error);
  //       setError(error.message || '페이지를 불러오는 중 오류가 발생했습니다.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   initializePage();
  // }, [userProgress]);

  // 임시 데이터로 표시 (API 연결 전)
  useEffect(() => {
    // 임시로 모든 단계를 완료 상태로 설정
    setCompletedStages([1, 2, 3, 4, 5, 6]);
    setLoading(false);
  }, []);

  const reviewModules = [
    {
      title: "1단계: 금융의 기초",
      completed: completedStages.includes(1),
      subTitle: "마지막 복습 8일전, 퀴즈 풀기 10번",
      icon: "📘",
      id: 1
    },
    {
      title: "2단계: 저축과 투자",
      completed: completedStages.includes(2),
      subTitle: "마지막 복습 8일전, 퀴즈 풀기 10번",
      icon: "💰",
      id: 2
    },
    {
      title: "3단계: 현명한 소비",
      completed: completedStages.includes(3),
      subTitle: "마지막 복습 8일전, 퀴즈 풀기 10번",
      icon: "🛒",
      id: 3
    },
    {
      title: "4단계: 용돈 관리",
      completed: completedStages.includes(4),
      subTitle: "마지막 복습 8일전, 퀴즈 풀기 10번",
      icon: "💵",
      id: 4
    },
    {
      title: "5단계: 미래 설계",
      completed: completedStages.includes(5),
      subTitle: "마지막 복습 8일전, 퀴즈 풀기 10번",
      icon: "🎯",
      id: 5
    },
    {
      title: "6단계: 금융 생활",
      completed: completedStages.includes(6),
      subTitle: "마지막 복습 8일전, 퀴즈 풀기 10번",
      icon: "🏦",
      id: 6
    }
  ];

  const handleReview = (moduleId) => {
    navigate(`/main/learning/${moduleId}`, { state: { isReview: true }});
  };

  const handleQuiz = (moduleId) => {
    navigate(`/main/learning/${moduleId}`, { state: { isReview: true, isQuiz: true }});
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <Wrapper>
      <ContentWrapper>
        <Sidebar user={user} login={login} setLogin={setLogin} />
        <MainWrapper>
          <ContentContainer>
            <TitleWrapper>
              <TitleText>복습하기</TitleText>
              <SubTitleText>이전 학습 내용을 복습하고 실력을 다져보세요!</SubTitleText>
            </TitleWrapper>
            <ReviewContainer>
              {reviewModules.map((module) => (
                <ReviewCard key={module.id}>
                  <ReviewContent>
                    <ReviewIconContainer>
                      <ReviewIcon>
                        {module.icon}
                      </ReviewIcon>
                    </ReviewIconContainer>
                    <ReviewText>
                      <ReviewTitle>
                        {module.title}
                      </ReviewTitle>
                      <ReviewSubTitle>
                        {module.subTitle}
                      </ReviewSubTitle>
                    </ReviewText>
                  </ReviewContent>
                  <ReviewButtons>
                    <ReviewButton onClick={() => handleReview(module.id)} disabled={!module.completed}>
                      복습하기
                    </ReviewButton>
                    <ReviewButton onClick={() => handleQuiz(module.id)} disabled={!module.completed}>
                      퀴즈풀기
                    </ReviewButton>
                  </ReviewButtons>
                </ReviewCard>
              ))}
            </ReviewContainer>
          </ContentContainer>
          {/* <div className="review-page">
            <div className="page-header">
              <h2>학습 복습하기</h2>
              <p>완료한 단계들을 다시 학습하고 복습해보세요!</p>
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
          </div> */}
        </MainWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}

export default ReviewPage;
