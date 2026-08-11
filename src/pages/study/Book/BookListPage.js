import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import '../Book/BookPage.css';
import Header from '../../../components/Header';
import lock from '../../../assets/lock.png';
import Sidebar from '../../../components/Sidebar';
import api from '../../../api/login/axiosInstance';


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

const BookGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const BookCard = styled.div`
  background: ${props => props.status === 'locked' ? '#F7F7F7' : '#ffffff'};
  padding: 1.5rem;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #DADADA;
  flex: 1;
  min-width: 280px;
  max-width: 350px;
  opacity: ${props => props.status === 'locked' ? 0.65 : 1};
  
  @media (max-width: 768px) {
    min-width: 200px;
    max-width: 250px;
  }
  
  @media (max-width: 480px) {
    min-width: 100%;
    max-width: 100%;
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2.5rem;
  background-color: #F7F7F7;
`;

const LockIcon = styled.img`
  width: 42px;
  height: 42px;
  object-fit: contain;
`;

const BookTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #191919;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const BookDescription = styled.p`
  font-size: 14px;
  color: #9E9E9E;
  font-weight: 300;
  margin-bottom: 1rem;
  line-height: 1.4;
  white-space: pre-line;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 0.6rem;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #DADADA;
  color: #9E9E9E;
  font-weight: 500;

  &:disabled {
    cursor: not-allowed;
  }
  
  ${props => props.variant === 'continue' && `
    background: #2D7BED;
    color: #ffffff;
    font-weight: 500;
    
    &:hover {
      background: #104EA7;
    }
  `}

`;

const ThumbIcon = styled.span`
  font-size: 1rem;
`;

// BookCard 컴포넌트
const BookCardComponent = ({ book, onSelect }) => {
  const getButtonText = () => {
    if (book.status === 'locked') return '잠금';
    if (book.status === 'completed') return '학습완료';
    return '학습시작';
  };

  const getButtonVariant = () => {
    if (book.status === 'locked') return 'locked';
    if (book.status === 'completed') return 'completed';
    return 'continue';
  };

  return (
    <BookCard status={book.status}>
      <div>
        {book.level && <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5rem' }}>{book.level}</div>}
        
        <IconContainer color={book.iconColor}>
          {book.status === 'locked' ? <LockIcon src={lock} alt="잠금" /> : book.icon}
        </IconContainer>
        
        <BookTitle>{book.title}</BookTitle>
        <BookDescription>{book.description}</BookDescription>
      </div>

      <div>
        <ActionButton 
          variant={getButtonVariant()}
          onClick={() => book.status !== 'locked' && onSelect(book.path)}
          disabled={book.status === 'locked'}
        >
          {getButtonText()}
          {book.status === 'completed' && <ThumbIcon>👍</ThumbIcon>}
        </ActionButton>
      </div>
    </BookCard>
  );
};

function BookListPage({ user, login, setLogin }) {
  const navigate = useNavigate();
  
  // useOutletContext가 null일 수 있으므로 방어적 처리
  const outletContext = useOutletContext() || {};
  const { userProgress = { completedSteps: [] } } = outletContext;

  const [error, setError] = useState(null);
  const [apiBookList, setApiBookList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/study/book-select')
      .then(res => {
        console.log("🔍 사용자 데이터:", res.data);
        if (res.data && res.data.data && res.data.data.bookList) {
          setApiBookList(res.data.data.bookList);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("❌ 사용자 데이터 조회 실패:", err);
        setError("책 목록을 불러오는데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  // 페이지 이탈 감지 이벤트 리스너
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     // 사용자에게 페이지를 떠날 것인지 확인하는 메시지 표시
  //     const message = '헬로';
      
  //     // 표준 beforeunload 확인 메시지 설정
  //     event.preventDefault();
  //     event.returnValue = message; // Chrome에서 필요
  //     return message; // 일부 브라우저에서 필요
  //   };

  //   const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //       console.log('👁️ 탭이 비활성화됨 (다른 탭으로 이동 또는 브라우저 최소화)');
  //     } else {
  //       console.log('👁️ 탭이 다시 활성화됨');
  //     }
  //   };

  //   const handlePageHide = (event) => {
  //     if (event.persisted) {
  //       console.log('📄 페이지가 백/포워드 캐시로 이동');
  //     } else {
  //       console.log('📄 페이지가 완전히 언로드됨 (탭 닫기, 브라우저 종료, 또는 새로고침)');
  //     }
  //   };

  //   const handleFocus = () => {
  //     console.log('🎯 창이 다시 포커스를 받음');
  //   };

  //   const handleBlur = () => {
  //     console.log('🎯 창이 포커스를 잃음');
  //   };

  //   // 이벤트 리스너 등록
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   window.addEventListener('pagehide', handlePageHide);
  //   window.addEventListener('focus', handleFocus);
  //   window.addEventListener('blur', handleBlur);

  //   // 클린업 함수
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //     window.removeEventListener('pagehide', handlePageHide);
  //     window.removeEventListener('focus', handleFocus);
  //     window.removeEventListener('blur', handleBlur);
  //   };
  // }, []);

  // useMemo를 사용하여 completedStages를 계산
  const completedStages = useMemo(() => {
    try {
      console.log('🔍 BookListPage API 데이터:', {
        userProgress,
        completedSteps: userProgress?.completedSteps,
        outletContext
      });
      
      const result = Array.isArray(userProgress?.completedSteps)
        ? userProgress.completedSteps
        : Object.keys(userProgress?.completedSteps || {}).map(Number);
      
      console.log('✅ 계산된 completedStages:', result);
      return result;
    } catch (error) {
      console.error('❌ Book page error:', error);
      setError(error.message || '데이터를 처리하는 중 오류가 발생했습니다.');
      return [];
    }
  }, [userProgress?.completedSteps]);

  // API 데이터를 사용하여 책 목록 생성
  const bookList = useMemo(() => {
    if (!apiBookList || apiBookList.length === 0) {
      return [];
    }

    const isBookCompleted = (book) => (
      book.status === 'completed'
      || book.progressStatus === 'completed'
      || book.completed === true
      || book.isCompleted === true
    );

    const sortedBookList = [...apiBookList].sort((a, b) => {
      const aLevel = Number(a.bookLevel);
      const bLevel = Number(b.bookLevel);
      const normalizedALevel = Number.isFinite(aLevel) ? aLevel : Number.POSITIVE_INFINITY;
      const normalizedBLevel = Number.isFinite(bLevel) ? bLevel : Number.POSITIVE_INFINITY;

      return normalizedALevel - normalizedBLevel;
    });

    const currentBookIndex = sortedBookList.findIndex((book) => !isBookCompleted(book));

    return sortedBookList.map((book, index) => {
      const status = isBookCompleted(book)
        ? 'completed'
        : index === currentBookIndex
          ? 'in_progress'
          : 'locked';

      // API 데이터 구조에 맞게 매핑
      const bookData = {
        id: book.id,
        title: book.title,
        icon: "📚", // 기본 아이콘 설정
        path: `/book/chapter/${book.id}`, // 책 ID를 포함한 경로
        description: `재미있게 학습해보세요!`,
        status
      };

      return bookData;
    });
  }, [apiBookList]);

  // 최종 bookList 출력
  console.log('📚 최종 bookList:', bookList);

  const handleBookSelect = (path) => {
    navigate(path);
  };

  const pageInfo = {
    title: "AI 학습하기",
    subtitle: "호핀이와 함께 단계별로 학습해요"
  }


  if (loading) return (
    <Wrapper>
      <Sidebar user={user} login={login} setLogin={setLogin} />
      <MainWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ fontSize: '16px', color: '#666' }}>책 목록을 불러오는 중...</div>
        </div>
      </MainWrapper>
    </Wrapper>
  );

  if (error) return (
    <Wrapper>
      <Sidebar user={user} login={login} setLogin={setLogin} />
      <MainWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ fontSize: '16px', color: '#e74c3c' }}>{error}</div>
        </div>
      </MainWrapper>
    </Wrapper>
  );

  return (
    <Wrapper>
      <Sidebar user={user} login={login} setLogin={setLogin} />
      <MainWrapper>
        <ContentContainer>
          <BookPageContainer>
            <PageHeader>
              {/* <PageTitle>{user?.childName}의 멋진 학습 여정🚀</PageTitle> */}
              <PageTitle>{user?.name ? user.name.slice(1) : "친구"}의 멋진 학습 여정</PageTitle>
              <PageSubtitle>{bookList.filter(book => book.status === 'completed').length > 0 ? `벌써 ${bookList.filter(book => book.status === 'completed').length}개 레벨을 완료했구나! 지금 열심히 배우고 있어!` : '학습을 시작해보자!'}</PageSubtitle>
            </PageHeader>

            <BookGrid>
              {bookList.map((book) => (
                <BookCardComponent
                  key={book.id}
                  book={book}
                  onSelect={handleBookSelect}
                />
              ))}
            </BookGrid>
          </BookPageContainer>
        </ContentContainer>
      </MainWrapper>
    </Wrapper>
  );
}

export default BookListPage;
