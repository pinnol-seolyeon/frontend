import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import point from '../assets/point_img.svg';

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
  margin: 0 0 2rem 0 ;
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

const TotalPointWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  background-color: #F0F4FC;
  border-radius: 10px;
  padding: 1rem 1.3rem;
  width: 100%;
  gap: 1rem;
`;

const PointIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4em;
  height: 4rem;
  border-radius: 50%;
  background-color: #ffffff;
`;

const PointIcon = styled.img`
  width: 2rem;
  height: 2rem;
  object-fit: contain;
`;

const PointTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
`;

const PointText = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #454545;
`;

const PointValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #191919;
`;

const TableWrapper = styled.div`
  width: 100%;
  margin-top: 2rem;
  overflow-x: auto;
  border-radius: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
`;

const TableHeader = styled.thead`
  background-color: #F7F7F7;
`;

const TableHeaderCell = styled.th`
  padding: 1.3rem;
  text-align: left;
  font-size: 15px;
  font-weight: 700;
  color: #333333;
  border-bottom: 2px solid #E0E0E0;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #F0F0F0;
  
  &:hover {
    background-color: #FAFAFA;
  }
`;

const TableCell = styled.td`
  padding: 1.2rem 1rem;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: #454545;
`;

const DetailTableCell = styled(TableCell)`
  text-align: left;
  font-weight: 700;
  font-size: 18px;
  color: #333333;
`;

const CategoryTag = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background-color: #ffffff;
  border: 1px solid ${props => props.isDebit ? '#FF5050' : '#2D7BED'};
  color: ${props => props.isDebit ? '#FF5050' : '#2D7BED'};
  min-width: 120px;
  text-align: center;
`;

const PointChange = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.isPositive ? '#2D7BED' : '#FF5050'};
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem 0;
  align-self: center;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.active ? 700 : 400};
  font-size: ${props => props.isArrow ? '24px' : '16px'};
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background-color: ${props => props.active ? '#F0F4FC' : '#ffffff'};
  color: ${props => props.active ? '#478CEE' : '#454545'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? '#F0F4FC' : '#F0F4FC'};
    cursor: ${props => props.active ? 'default' : 'pointer'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #EAEAEA; !important
    color: #B8B8B8; !important
  }
`;

function Point({ user, login, setLogin }) {
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  // 임시 포인트 내역 데이터
  const pointHistory = [
    { id: 1, category: '게임 포인트', detail: '1단원 퀴즈게임', date: '2025-10-19 18:24', point: 2000, isDebit: false },
    { id: 2, category: '게임 포인트', detail: '2단원 퀴즈게임', date: '2025-10-19 18:24', point: 2000, isDebit: false },
    { id: 3, category: '방문 미션', detail: '화폐박물관 방문 미션 완료', date: '2025-10-19 18:24', point: 2000, isDebit: false },
    { id: 4, category: '계좌 환급', detail: '50,000원 용돈 환급', date: '2025-10-19 18:24', point: 50000, isDebit: true },
    { id: 5, category: '상품권 구매', detail: '50,000원 상품권 구매', date: '2025-10-19 18:24', point: 50000, isDebit: true },
    { id: 6, category: '게임포인트', detail: '3단원 퀴즈게임', date: '2025-10-19 18:24', point: 2000, isDebit: false },
    { id: 7, category: '게임포인트', detail: '4단원 퀴즈게임', date: '2025-10-19 18:24', point: 2000, isDebit: false },
    { id: 8, category: '게임 포인트', detail: '5단원 퀴즈게임', date: '2025-10-20 10:15', point: 2000, isDebit: false },
    { id: 9, category: '방문 미션', detail: '은행 방문 미션 완료', date: '2025-10-20 14:30', point: 3000, isDebit: false },
    { id: 10, category: '상품권 구매', detail: '10,000원 상품권 구매', date: '2025-10-21 09:00', point: 10000, isDebit: true },
  ];
  
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

  // 페이지네이션 계산
  const totalPages = Math.ceil(pointHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = pointHistory.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
              <TitleText>포인트 내역</TitleText>
              <SubTitleText>포인트 상세 내역을 확인해 보세요!</SubTitleText>
            </TitleWrapper>

            <TotalPointWrapper>
                <PointIconWrapper>
                    <PointIcon src={point} alt="point" />
                </PointIconWrapper>
                <PointTextWrapper>
                    <PointText>현재 {user?.name}님의 피넛</PointText>
                    <PointValue>{(user?.coin ?? 0).toLocaleString()}P</PointValue>
                </PointTextWrapper>
            </TotalPointWrapper>

            <TableWrapper>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>NO</TableHeaderCell>
                    <TableHeaderCell>카테고리</TableHeaderCell>
                    <TableHeaderCell>상세내역</TableHeaderCell>
                    <TableHeaderCell>날짜</TableHeaderCell>
                    <TableHeaderCell>포인트내역</TableHeaderCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{String(startIndex + index + 1).padStart(2, '0')}</TableCell>
                      <TableCell>
                        <CategoryTag isDebit={item.isDebit}>
                          {item.category}
                        </CategoryTag>
                      </TableCell>
                      <DetailTableCell>{item.detail}</DetailTableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <PointChange isPositive={!item.isDebit}>
                          {item.isDebit ? '-' : '+'} {item.point.toLocaleString()}P
                        </PointChange>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>

            <PaginationWrapper>
              <PaginationButton 
                isArrow
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                «
              </PaginationButton>
              <PaginationButton 
                isArrow
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </PaginationButton>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationButton
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationButton>
              ))}
              <PaginationButton 
                isArrow
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </PaginationButton>
              <PaginationButton 
                isArrow
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              </PaginationButton>
            </PaginationWrapper>
          </ContentContainer>
        </MainWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}

export default Point;
