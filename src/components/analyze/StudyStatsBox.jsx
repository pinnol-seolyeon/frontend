import React from 'react';
import styled from 'styled-components';
// import { fetchStudyStats } from '../../api/analyze/analytics';

const StatsCard = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-radius: 12px;
  background: ${props => props.backgroundColor || '#E8F5E8'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const IconContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.textColor || '#2E7D32'};
  margin-bottom: 0.2rem;
`;

const Value = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.textColor || '#2E7D32'};
`;

function StudyStatsBox({ type }) {
  // API 호출 부분 주석처리
  // const [stats, setStats] = useState(null);
  // const [error, setError] = useState(false);

  // useEffect(() => {
  //   fetchStudyStats()
  //     .then(setStats)
  //     .catch(err => {
  //       console.error("❌ 통계 불러오기 실패:", err);
  //       setError(true);
  //     });
  // }, []);

  // 하드코딩된 데이터로 디자인 작업
  const getConfig = () => {
    switch (type) {
      case 'total':
        return {
          icon: '📚',
          title: '총 완료 단원 수',
          value: '2개',
          backgroundColor: '#E8F5E8',
          textColor: '#2E7D32'
        };
      case 'weekly':
        return {
          icon: '✏️',
          title: '이번 주 완료 단원 수',
          value: '3개',
          backgroundColor: '#E3F2FD',
          textColor: '#1976D2'
        };
      case 'level':
        return {
          icon: '🏆',
          title: '전체 학습 수준',
          value: '우수',
          backgroundColor: '#FFF3E0',
          textColor: '#F57C00'
        };
      default:
        return {
          icon: '📊',
          title: '통계',
          value: '0개',
          backgroundColor: '#F5F5F5',
          textColor: '#666'
        };
    }
  };

  const config = getConfig();

  return (
    <StatsCard backgroundColor={config.backgroundColor}>
      <LeftSection>
        <IconContainer>
          {config.icon}
        </IconContainer>
        <TextSection>
          <Title textColor={config.textColor}>{config.title}</Title>
        </TextSection>
      </LeftSection>
      <Value textColor={config.textColor}>{config.value}</Value>
    </StatsCard>
  );
}

export default StudyStatsBox;
