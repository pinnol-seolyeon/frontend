import React, { useState } from 'react';
import styled from 'styled-components';
// import { fetchStudyTimeStats } from '../../api/analyze/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TimeCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const HeaderLeft = styled.div``;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const CardSubtitle = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
`;

const TypeButton = styled.button`
  background: #4A91FE;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #333333;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 250px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  // border: 1px solid #f0f0f0;
`;

const ChartPlaceholder = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  align-self: flex-end;
`;

const PeriodButton = styled.button`
  padding: 0.3rem 1.3rem;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  border: ${props => props.active ? 'none' : '1px solid #4A91FE'};
  background: ${props => props.active ? '#4A91FE' : 'white'};
  color: ${props => props.active ? 'white' : '#4A91FE'};
`;

export default function StudyTimeStats() {
  // API 데이터 주석처리 - 하드코딩된 데이터로 디자인 작업
  // const [preferredType, setPreferredType] = useState('');
  // const [weeklyData, setWeeklyData] = useState([]);
  // const [error, setError] = useState(false);

  // useEffect(() => {
  //   fetchStudyTimeStats()
  //     .then(data => {
  //       if (!data) {
  //         setError(true);
  //         return;
  //       }
  //       setPreferredType(data.preferredType || '');
  //       // ... 기존 로직
  //     })
  //     .catch(err => {
  //       console.error("❌ 공부 시간 데이터 요청 실패:", err);
  //       setError(true);
  //     });
  // }, []);

  // 버튼 active 상태 관리
  const [activePeriod, setActivePeriod] = useState('weekly');

  const handlePeriodClick = (period) => {
    setActivePeriod(period);
  };

  // 하드코딩된 데이터로 차트 표시
  const data = [
    { day: '일', morning: 2, afternoon: 4, evening: 6, night: 1 },
    { day: '월', morning: 3, afternoon: 5, evening: 4, night: 0 },
    { day: '화', morning: 4, afternoon: 3, evening: 5, night: 1 },
    { day: '수', morning: 2, afternoon: 6, evening: 3, night: 2 },
    { day: '목', morning: 5, afternoon: 2, evening: 4, night: 0 },
    { day: '금', morning: 3, afternoon: 4, evening: 5, night: 1 },
    { day: '토', morning: 1, afternoon: 3, evening: 7, night: 2 },
  ];

  return (
    <TimeCard>
      <CardHeader>
        <HeaderLeft>
          <CardTitle>선호 학습 시간대</CardTitle>
          <CardSubtitle>선호 학습시간대를 알아보아요!</CardSubtitle>
        </HeaderLeft>
        <TypeButton>언제든지 좋아형</TypeButton>
      </CardHeader>

      <LegendContainer>
        <LegendItem>
          <LegendColor color="#BFDBFF" />
          <span>오전 (5~12시)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#FFDD8F" />
          <span>낮 (12~18시)</span>
        </LegendItem>
      </LegendContainer>
      <LegendContainer>
        <LegendItem>
          <LegendColor color="#EAD4FF" />
          <span>저녁 (18-23시)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#C5F8B5" />
          <span>새벽 (23~5시)</span>
        </LegendItem>
      </LegendContainer>

      <ChartContainer>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
                dataKey="day" 
                fontSize={10} 
                tick={{ fill: '#B8B8B8' }}
                axisLine={{ stroke: '#EAEAEA', strokeWidth: 1 }}
                tickLine={false}
              />
            <YAxis 
              fontSize={9} 
              tick={{ fill: '#B8B8B8' }}
              axisLine={{ stroke: '#EAEAEA', strokeWidth: 1 }}
              tickLine={{ stroke: '#EAEAEA' }}
            />
            <Bar dataKey="morning" stackId="a" fill="#BFDBFF" name="오전" />
            <Bar dataKey="afternoon" stackId="a" fill="#FFDD8F" name="낮" />
            <Bar dataKey="evening" stackId="a" fill="#EAD4FF" name="저녁" />
            <Bar dataKey="night" stackId="a" fill="#C5F8B5" name="새벽" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ButtonContainer>
        <PeriodButton 
          active={activePeriod === 'weekly'}
          onClick={() => handlePeriodClick('weekly')}
        >
          주간
        </PeriodButton>
        <PeriodButton 
          active={activePeriod === 'monthly'}
          onClick={() => handlePeriodClick('monthly')}
        >
          월간
        </PeriodButton>
      </ButtonContainer>
    </TimeCard>
  );
}
