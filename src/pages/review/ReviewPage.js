import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import ReviewPageCSS from '../review/ReviewPage.css';
import { fetchReviewList } from '../../api/review/fetchReview';

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
  transition: opacity 0.2s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
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

// 아이콘 매핑 함수 (chapterId 또는 chapterTitle 기반)
const getChapterIcon = (chapterId, chapterTitle) => {
  const id = String(chapterId).toLowerCase();
  const title = String(chapterTitle).toLowerCase();
  
  if (id.includes('1') || title.includes('기초') || title.includes('1단계')) return "📘";
  if (id.includes('2') || title.includes('저축') || title.includes('투자') || title.includes('2단계')) return "💰";
  if (id.includes('3') || title.includes('소비') || title.includes('3단계')) return "🛒";
  if (id.includes('4') || title.includes('용돈') || title.includes('4단계')) return "💵";
  if (id.includes('5') || title.includes('미래') || title.includes('5단계')) return "🎯";
  if (id.includes('6') || title.includes('금융') || title.includes('생활') || title.includes('6단계')) return "🏦";
  
  return "📚"; // 기본 아이콘
};

function ReviewPage({ user, login, setLogin }) {
  const navigate = useNavigate();
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModules, setReviewModules] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true
  });

  // API 호출
  useEffect(() => {
    const loadReviewData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchReviewList(currentPage);
        
        // API 응답 데이터를 컴포넌트 형식으로 변환
        const modules = (data.content || []).map((chapter) => {
          const isFirstReviewAvailable = chapter.lockStatus?.firstReview !== 'LOCKED';
          const isSecondReviewAvailable = chapter.lockStatus?.secondReview !== 'LOCKED';
          
          return {
            chapterId: chapter.chapterId,
            title: chapter.chapterTitle,
            subTitle: "복습 가능한 단원입니다",
            icon: getChapterIcon(chapter.chapterId, chapter.chapterTitle),
            firstReviewAvailable: isFirstReviewAvailable,
            secondReviewAvailable: isSecondReviewAvailable,
            // 복습하기 버튼은 firstReview가 가능하면 활성화
            // 퀴즈풀기 버튼은 secondReview가 가능하면 활성화
          };
        });
        
        setReviewModules(modules);
        setPaginationInfo({
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          first: data.first || false,
          last: data.last || false
        });
      } catch (error) {
        console.error('Review page error:', error);
        setError(error.message || '페이지를 불러오는 중 오류가 발생했습니다.');
        setReviewModules([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviewData();
  }, [currentPage]);

  const handleReview = (chapterId) => {
    navigate(`/main/learning/${chapterId}`, { state: { isReview: true }});
  };

  const handleQuiz = (chapterId) => {
    navigate(`/main/learning/${chapterId}`, { state: { isReview: true, isQuiz: true }});
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
              {reviewModules.length === 0 && !loading ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '2rem', color: '#9E9E9E' }}>
                  복습할 단원이 없습니다.
                </div>
              ) : (
                reviewModules.map((module) => (
                  <ReviewCard key={module.chapterId}>
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
                      <ReviewButton 
                        onClick={() => handleReview(module.chapterId)} 
                        disabled={!module.firstReviewAvailable}
                      >
                        1차 복습
                      </ReviewButton>
                      <ReviewButton 
                        onClick={() => handleQuiz(module.chapterId)} 
                        disabled={!module.secondReviewAvailable}
                      >
                        2차 복습
                      </ReviewButton>
                    </ReviewButtons>
                  </ReviewCard>
                ))
              )}
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
