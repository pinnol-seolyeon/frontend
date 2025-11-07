import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams} from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import '../Chapter/ChapterPage.css';
import {fetchChapters,fetchChapterContents} from "../../../api/study/level3API";
import {useChapter} from "../../../context/ChapterContext";
import Sidebar from '../../../components/Sidebar';

const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;

`;

const MainWrapper = styled.div` 
  flex: 1;
  min-height: calc(100vh - var(--header-height, 70px));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BookPageContainer = styled.div`
  width: 100%;
  padding: 1rem;
`;

const PageHeader = styled.div`
  text-align: flex-start;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
`;

const ChapterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 1023px) and (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 599px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ChapterCard = styled.div`
  background: #ffffff;
  padding: 2rem 1.5rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  border: 1px solid #E5E5E5;
  width: 100%;
  height: 250px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  ${props => props.status === 'current' && `
    border-color: #E5E5E5;
    background: #ffffff;
  `}
  
  ${props => props.status === 'locked' || props.status === 'completed' && `
    border-color: #E5E5E5;
    background: #ffffff;
  `}
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    height: 250px;
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    min-height: 250px;
  }
`;

const ChapterTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #191919;
  margin: 0;
  line-height: 1.4;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  
  ${props => props.variant === 'completed' && `
    background: #E8E8E8;
    color: #666666;
    cursor: not-allowed;
    
    &:hover {
      background: #E8E8E8;
    }
  `}
  
  ${props => props.variant === 'current' && `
    background: #2D7BED;
    color: #ffffff;
    
    &:hover {
      background: #1E6DD8;
    }
  `}
  
  ${props => props.variant === 'locked' && `
    background: #DADADA;
    color: #9E9E9E;
    cursor: not-allowed;
  `}
`;

const LevelIcon = styled.div`
  font-size: 13px;
  color: #ffffff;
  font-weight: 600;
  background-color: #AED2FF;
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  display: inline-block;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;


  // ChapterCard 컴포넌트
  const ChapterCardComponent = ({ chapter, onSelect, levelNumber }) => {
    const getButtonText = () => {
      if (chapter.status === 'locked') return '잠금';
      if (chapter.status === 'completed') return '완료!';
      return '시작하기';
    };

    const getButtonVariant = () => {
      if (chapter.status === 'locked') return 'locked';
      if (chapter.status === 'completed') return 'completed';
      return 'current';
    };

    return (
      <ChapterCard status={chapter.status}>
        <TitleWrapper>
          <LevelIcon>
            {`Lv.${String(levelNumber).padStart(2, '0')}`}
          </LevelIcon>
          <ChapterTitle>{chapter.title}</ChapterTitle>
        </TitleWrapper>

        <ActionButton 
          variant={getButtonVariant()}
          onClick={() => onSelect(chapter.id)}
          disabled={chapter.status === 'locked' || chapter.status === 'completed'}
        >
          {getButtonText()}
        </ActionButton>
      </ChapterCard>
    );
  };



function ChapterPage({ user, login, setLogin }) {
  const navigate = useNavigate();
  const { bookId } = useParams(); //URL에서 bookID 가져오기
  const {chapterData,setChapterData,clearChapterData}=useChapter();

  // bookId 디버깅
  console.log('📖 ChapterPage - URL에서 가져온 bookId:', bookId);


  const [chapters,setChapters]=useState([]);
  const [currentChapterId,setCurrentChapterId]=useState(null);
  const [currentLevel,setCurrentLevel]=useState(null); // 현재 학습 중인 레벨 추가
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

    const handleFetchChapters=async()=>{
      try{
        const data=await fetchChapters(bookId);
        console.log("📚 Chapters data received:", data);
        console.log("📚 Data type:", typeof data);
        console.log("📚 Is array:", Array.isArray(data));
        
        // Handle the specific API response structure
        if (data && data.data && data.data.chapterList && Array.isArray(data.data.chapterList.content)) {
          setChapters(data.data.chapterList.content);
          setCurrentChapterId(data.data.currentChapterId);
          setCurrentLevel(data.data.currentLevel); // currentLevel 저장
          console.log("🎯 Current Chapter ID:", data.data.currentChapterId);
          console.log("🎯 Current Level:", data.data.currentLevel);
        } else if (Array.isArray(data)) {
          setChapters(data);
        } else if (data && Array.isArray(data.chapters)) {
          setChapters(data.chapters);
        } else if (data && Array.isArray(data.data)) {
          setChapters(data.data);
        } else {
          console.error("❌ Unexpected data structure:", data);
          setChapters([]);
          setError("단원 데이터 형식이 올바르지 않습니다.");
        }
        }
        catch(err){
          console.error("❌ Error fetching chapters:", err);
          setError(err.message);
          setChapters([]);
      }finally{
        setLoading(false);
      }
    };


  //페이지 진입 시 자동 실행
  useEffect(()=>{
    if (bookId) {
      handleFetchChapters();
    }
  },[bookId]);

  // 챕터 상태를 판단하는 함수
  const getChapterStatus = (chapterId) => {
    if (!currentChapterId) return { isCompleted: false, isCurrent: false };
    
    // currentChapterId보다 낮은 ID는 완료된 것으로 간주
    const isCompleted = chapterId < currentChapterId;
    const isCurrent = chapterId === currentChapterId;
    
    return { isCompleted, isCurrent };
  };

  const handleChapterClick = async (clickedChapterId) => {
  try {
    // 클릭한 챕터가 현재 학습 중인 챕터인지 확인
    const isCurrentChapter = clickedChapterId === currentChapterId;
    const targetLevel = isCurrentChapter && currentLevel ? currentLevel : 1; // 현재 챕터면 currentLevel, 아니면 1부터
    
    console.log("🎯 챕터 클릭:", {
      clickedChapterId,
      currentChapterId,
      currentLevel,
      isCurrentChapter,
      targetLevel
    });
    
    const chapter = await fetchChapterContents(targetLevel, clickedChapterId, bookId);
    if(chapterData?.chapterId){
      clearChapterData();
    }
    // bookId를 포함하여 setChapterData 호출
    setChapterData({
      ...chapter,
      bookId: bookId
    });
    console.log("✅API응답 chapter:",chapter.chapterId, "bookId:", bookId);

    // currentLevel에 따라 해당 레벨로 이동
    const levelRoutes = {
      1: `/study/1?chapterId=${chapter.chapterId}`,
      2: `/study/2?chapterId=${chapter.chapterId}`,
      3: `/study/level3?chapterId=${chapter.chapterId}`,
      4: `/game`,
      5: `/study/level6/summary?chapterId=${chapter.chapterId}`,
      6: `/study/level6/2?chapterId=${chapter.chapterId}`
    };
    
    const targetRoute = levelRoutes[targetLevel] || `/study/1?chapterId=${chapter.chapterId}`;
    console.log("🚀 이동할 경로:", targetRoute);
    navigate(targetRoute);
  } catch (err) {
    console.error("학습 시작 API 호출 실패:", err);
    alert("단원 정보를 불러오지 못했습니다.");
  }
};


  if (loading) return <div className="loading">단원을 불러오는중..</div>;
  if (error) return <div className="error-message">{error}</div>;

  //유저가 해당 책의 진도를 완료 -> review-card completed로.. 기본은 review-card
  
  return (
    <Wrapper>
      <Sidebar user={user} login={login} setLogin={setLogin} />
      <MainWrapper>
        <ContentContainer>
          <BookPageContainer>
            <PageHeader>
              <PageTitle>단원을 선택하세요</PageTitle>
              <PageSubtitle>학습할 단원을 선택해주세요</PageSubtitle>
            </PageHeader>

            {loading && <div>단원을 불러오는 중...</div>}
            {error && <div>오류: {error}</div>}
            
            {!loading && !error && (
              <ChapterGrid>
                {Array.isArray(chapters) && chapters.map((chapter, index) => {
                  const {chapterId, chapterTitle} = chapter;
                  const id = chapterId;
                  const title = chapterTitle;
                  
                  // currentChapterId를 기준으로 상태 계산
                  const {isCompleted, isCurrent} = getChapterStatus(chapterId);
                  
                  const chapterData = {
                    id,
                    title,
                    status: isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'
                  };

                  return (
                    <ChapterCardComponent
                      key={index}
                      chapter={chapterData}
                      onSelect={handleChapterClick}
                      levelNumber={index + 1}
                    />
                  );
                })}
                {(!Array.isArray(chapters) || chapters.length === 0) && (
                  <div>단원이 없습니다.</div>
                )}
              </ChapterGrid>
            )}

          </BookPageContainer>
        </ContentContainer>
      </MainWrapper>
    </Wrapper>
    // <div className="chapter-page">
    //   <div className="page-header">
    //     {/* <h2>단원을 선택하세요</h2> */}
    //   </div>

    //   <div className="book-modules">
    //     {Array.isArray(chapters) && chapters.map((chapter,index) => {
    //       const {chapterId, chapterTitle} = chapter;
    //       const id = chapterId; // Use chapterId as id for compatibility
    //       const title = chapterTitle; // Use chapterTitle as title for compatibility
          
    //       // currentChapterId를 기준으로 상태 계산
    //       const {isCompleted, isCurrent} = getChapterStatus(chapterId);

    //       return(
    //         <div
    //           key={index}
    //           className={`book-card
    //               ${isCompleted?'completed':''}
    //               ${isCurrent?'current':''} `}
    //           // onClick={()=>{
    //           //   if(isCompleted) handleChapterClick(id); //완료된 단원만 클릭 가능 
    //           // }}
    //           style={{cursor:isCompleted?'pointer':'default'}}
    //         >
    //            <div className="module-icon">{isCompleted ? '📖' : '📘'}</div>

    //            <h3>{title}</h3>
        
          
    //         <div className="review-buttons">
    //           {isCompleted && (
    //             <button
    //               className="review-btn completed"
    //               disabled={true}
    //             >
    //               학습 완료
    //             </button>
    //           )}
    //           {isCurrent && (
    //             <button
    //               className="review-btn current"
    //               onClick={(e)=>{
    //                 e.stopPropagation();
    //                 handleChapterClick(id);
    //               }}
    //             >
    //               학습하기
    //             </button>
    //           )}
    //           {!isCompleted && !isCurrent && (
    //             <button
    //               className="review-btn locked"
    //               disabled={true}
    //             >
    //               잠금
    //             </button>
    //           )}
    //         </div>
    //       </div>
      
    //       );
    //     })}
    //     {!Array.isArray(chapters) || chapters.length === 0 ? (
    //       <div className="no-chapters">
    //         <p>단원이 없습니다.</p>
    //       </div>
    //     ) : null}
    //     </div>
    //   </div>
  );
}

export default ChapterPage;