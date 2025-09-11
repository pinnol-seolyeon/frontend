import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../Book/BookPage.css';
import Header from '../../../components/Header';
import lock from '../../../assets/lock.png';


const Wrapper = styled.div`
  background-color: #F0F4FC;
`;

const MainWrapper = styled.div` 
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: calc(var(--header-height, 70px) + 20px) 20px 20px 20px;
`;


const BackButton = styled.div`
  border-radius: 8px;
  padding: 0.6rem 1rem;
  border: 1px solid #B8B8B8;
  font-size: 0.8rem;
  font-weight: 300;
  color: #4C4C4C;
  cursor: pointer;
  background-color: white;
  margin: 2rem 10rem 0;
`;

const BookPageContainer = styled.div`
  width: 100vw;
  padding: 1rem;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  text-align: center;
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const BookCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }

  ${props => props.status === 'locked' && `
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

const LevelBadge = styled.div`
  background: #fff;
  color: #4C4C4C;
  padding: 0.3rem 0.8rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
  border: 1px solid #B8B8B8;
`;

const LockIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background-color: #999;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
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
  
  ${props => props.color && `
    background-color: ${props.color};
  `}
`;

const BookTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const BookDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const ProgressSection = styled.div`
  margin-bottom: 1rem;
`;

const ProgressLabel = styled.div`
  font-size: 0.7rem;
  color: #666;
  margin-bottom: 0.5rem;
  text-align: left;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.7rem;
  background: #e9ecef;
  border-radius: 30px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 30px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;

  ${props => props.variant === 'completed' && `
    background: #4A91FE;
  `}

  ${props => props.variant === 'in_progress' && `
    background: linear-gradient(to right, #4A91FE, #303AFF);
  `}
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.3rem;
  text-align: right;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'completed' && `
    background: #4A91FE;
    color: white;
    font-weight: 500;
  `}
  
  ${props => props.variant === 'continue' && `
    background: linear-gradient(to right, #4A91FE, #303AFF);
    color: white;
    font-weight: 700;
    
    &:hover {
      background: linear-gradient(to right,rgb(55, 130, 243),rgb(30, 41, 239));
    }
  `}
  
  ${props => props.variant === 'locked' && `
    background: #B8B8B8;
    color: #4C4C4C;
    cursor: not-allowed;
    font-weight: 500;
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
    return '계속하기';
  };

  const getButtonVariant = () => {
    if (book.status === 'locked') return 'locked';
    if (book.status === 'completed') return 'completed';
    return 'continue';
  };

  const getProgressPercentage = () => {
    if (book.status === 'locked') return 0;
    if (book.status === 'completed') return 100;
    return (book.currentProgress / book.totalProgress) * 100;
  };

  return (
    <BookCard status={book.status}>
      <div>
        <LevelBadge>{book.level}</LevelBadge>
        {book.status === 'locked' && <LockIcon><img src={lock} alt="lock" /></LockIcon>}
        
        <IconContainer color={book.iconColor}>
          {book.icon}
        </IconContainer>
        
        <BookTitle>{book.title}</BookTitle>
        <BookDescription>{book.description}</BookDescription>
      </div>

      <div>
        {book.status !== 'locked' && (
          <ProgressSection>
            <ProgressLabel>진행률</ProgressLabel>
            <ProgressBar>
              <ProgressFill 
                progress={getProgressPercentage()} 
                variant={book.status}
              />
            </ProgressBar>
          </ProgressSection>
        )}

        <ActionButton 
          variant={getButtonVariant()}
          onClick={() => onSelect(book.path)}
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
  // 책 목록 데이터 (API 연동 시 이 부분만 수정하면 됩니다)
  const bookList = [
    { 
      id: 1,
      level: "Lv.01",
      title: "돈이란 무엇일까?", 
      icon: "💰", 
      iconColor: "#BFDBFF",
      path: "/book/chapter",
      description: "돈의 기본 개념과 역할을 배워보며 금융의 첫걸음을 시작해요!",
      status: "completed",
      currentProgress: 6,
      totalProgress: 6
    },
    { 
      id: 2,
      level: "Lv.02",
      title: "돈은 왜 소중한가?", 
      icon: "💎", 
      iconColor: "#E0F2F1",
      path: "/book/chapter",
      description: "돈의 기본 개념과 역할을 배워보며 금융의 첫걸음을 시작해요!",
      status: "completed",
      currentProgress: 6,
      totalProgress: 6
    },
    { 
      id: 3,
      level: "Lv.03",
      title: "돈의 여러가지 모습", 
      icon: "🌍", 
      iconColor: "#F3E5F5",
      path: "/book/chapter",
      description: "돈의 기본 개념과 역할을 배워보며 금융의 첫걸음을 시작해요!",
      status: "in_progress",
      currentProgress: 3,
      totalProgress: 6
    },
    { 
      id: 4,
      level: "Lv.04",
      title: "돈은 이렇게 벌어!", 
      icon: "💼", 
      iconColor: "#FFF3E0",
      path: "/book/chapter",
      description: "돈의 기본 개념과 역할을 배워보며 금융의 첫걸음을 시작해요!",
      status: "locked",
      currentProgress: 0,
      totalProgress: 6
    },
    { 
      id: 5,
      level: "Lv.05",
      title: "돈은 왜 모을까?", 
      icon: "💵", 
      iconColor: "#FCE4EC",
      path: "/book/chapter",
      description: "돈의 기본 개념과 역할을 배워보며 금융의 첫걸음을 시작해요!",
      status: "locked",
      currentProgress: 0,
      totalProgress: 6
    },
    { 
      id: 6,
      level: "Lv.06",
      title: "은행이 하는 일", 
      icon: "🏦", 
      iconColor: "#FFF8E1",
      path: "/book/chapter",
      description: "돈의 기본 개념과 역할을 배워보며 금융의 첫걸음을 시작해요!",
      status: "locked",
      currentProgress: 0,
      totalProgress: 6
    },
  ];

  const handleBookSelect = (path) => {
    navigate(path);
  };

  return (
    <Wrapper>
      <Header user={user} login={login} setLogin={setLogin} />
      <MainWrapper>
        <BackButton
          onClick={() => navigate('/main')}
        >{'<'} 이전 페이지로 돌아가기</BackButton>
        <BookPageContainer>
        <PageHeader>
          {/* <PageTitle>{user?.childName}의 멋진 학습 여정🚀</PageTitle> */}
          <PageTitle>{user?.childName ? user.childName.slice(1) : "친구"}의 멋진 학습 여정🚀</PageTitle>
          <PageSubtitle>벌써 2개 레벨을 완료했구나! 지금 레벨3을 열심히 배우고 있어!</PageSubtitle>
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
      </MainWrapper>
    </Wrapper>
  );
}

export default BookListPage;
