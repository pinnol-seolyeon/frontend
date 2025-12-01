import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import point from '../assets/point_img.svg';
import { fetchPointHistory } from '../api/analyze/pointHistory';
import axios from 'axios';

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
  
  const [currentPage, setCurrentPage] = useState(0); // API는 0부터 시작
  const itemsPerPage = 7;
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedStages, setCompletedStages] = useState([]);
  
  // API 응답 데이터
  const [pointHistory, setPointHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // 최신 coin 값 (직접 API에서 가져옴)
  const [currentCoin, setCurrentCoin] = useState(user?.coin ?? 0);

  // 날짜 포맷팅 함수 (밀리초 제거, 시:분까지만)
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
      // "2025-11-09T22:13:31.347" -> "2025-11-09 22:13"
      const [datePart, timePart] = dateTimeString.split('T');
      const timeWithoutMs = timePart.split('.')[0]; // 밀리초 제거
      const [hour, minute] = timeWithoutMs.split(':');
      
      return `${datePart} ${hour}:${minute}`;
    } catch (error) {
      console.error('날짜 포맷팅 실패:', error);
      return dateTimeString;
    }
  };
  
  // 카테고리에 따라 차감 여부 판단
  const isDebitCategory = (category) => {
    return category === '계좌 환급' || category === '상품권 구매';
  };
  
  // 최신 user 정보 불러오기 (coin 값 갱신)
  const fetchUserCoin = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, { withCredentials: true });
      if (response.data && response.data.coin !== undefined) {
        setCurrentCoin(response.data.coin);
        console.log('✅ 최신 coin 값:', response.data.coin);
      }
    } catch (err) {
      console.error('❌ 사용자 정보 불러오기 실패:', err);
      // 실패해도 기존 값 유지
    }
  };

  // 컴포넌트 마운트 시 최신 coin 값 불러오기
  useEffect(() => {
    fetchUserCoin();
  }, []);

  // 포인트 히스토리 불러오기
  useEffect(() => {
    const loadPointHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchPointHistory(currentPage, itemsPerPage);
        
        console.log('📊 포인트 히스토리 데이터:', data);
        
        setPointHistory(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        
        // 포인트 히스토리 로딩 완료 후 최신 coin 값 갱신
        await fetchUserCoin();
      } catch (err) {
        console.error('❌ 포인트 히스토리 불러오기 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadPointHistory();
  }, [currentPage]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Wrapper>
      <ContentWrapper>
        <Sidebar user={user} login={login} setLogin={setLogin} />
        <MainWrapper>
          <ContentContainer>
            <TitleWrapper>
              <TitleText>피넛(FINUT) 내역</TitleText>
              <SubTitleText>피넛(FINUT) 상세 내역을 확인해 보세요!</SubTitleText>
            </TitleWrapper>

            <TotalPointWrapper>
                <PointIconWrapper>
                    <PointIcon src={point} alt="point" />
                </PointIconWrapper>
                    <PointTextWrapper>
                    <PointText>현재 {user?.name}님의 피넛</PointText>
                    <PointValue>{currentCoin.toLocaleString()}F</PointValue>
                </PointTextWrapper>
            </TotalPointWrapper>

            {loading && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>포인트 내역을 불러오는 중입니다...</p>
              </div>
            )}

            {error && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>
                <p>데이터를 불러오는데 실패했습니다: {error}</p>
              </div>
            )}

            {!loading && !error && (
            <>
              <TableWrapper>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHeaderCell>NO</TableHeaderCell>
                      <TableHeaderCell>카테고리</TableHeaderCell>
                      <TableHeaderCell>상세내역</TableHeaderCell>
                      <TableHeaderCell>날짜</TableHeaderCell>
                      <TableHeaderCell>피넛(FINUT) 내역</TableHeaderCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {pointHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                          아직 포인트 내역이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pointHistory.map((item, index) => {
                        const isDebit = isDebitCategory(item.category);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{String(currentPage * itemsPerPage + index + 1).padStart(2, '0')}</TableCell>
                            <TableCell>
                              <CategoryTag isDebit={isDebit}>
                                {item.category}
                              </CategoryTag>
                            </TableCell>
                            <DetailTableCell>{item.category}</DetailTableCell>
                            <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                            <TableCell>
                              <PointChange isPositive={!isDebit}>
                                {isDebit ? '-' : '+'} {item.amount.toLocaleString()}F
                              </PointChange>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableWrapper>

              {totalPages > 0 && (
                <PaginationWrapper>
                <PaginationButton 
                  isArrow
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                >
                  «
                </PaginationButton>
                <PaginationButton 
                  isArrow
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  ‹
                </PaginationButton>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationButton
                    key={index}
                    active={currentPage === index}
                    onClick={() => handlePageChange(index)}
                  >
                    {index + 1}
                  </PaginationButton>
                ))}
                <PaginationButton 
                  isArrow
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  ›
                </PaginationButton>
                <PaginationButton 
                  isArrow
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  »
                </PaginationButton>
                </PaginationWrapper>
              )}
            </>
            )}
          </ContentContainer>
        </MainWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}

export default Point;
