import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchStudyTimeStats } from '../../api/analyze/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

const TimeCard = styled.div`
  background: white;
  border-radius: 5px;
  padding: 2rem;
  border : 1px solid #DADADA;
  flex : 0.7;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const HeaderLeft = styled.div`
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #191919;
  margin: 0 0 0.8rem 0;
`;

const CardSubtitle = styled.p`
  font-size: 14px;
  color: #454545;
  margin: 0;
  font-weight: 300;
  white-space: pre-line;
`;

const TypeButton = styled.button`
  background: #191919;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.25rem 1.1rem;
  font-size: 14px;
  font-weight: 500;
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
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 1rem;
  // border: 1px solid #f0f0f0;

  & > div {
    display: flex !important;
    justify-content: flex-start !important;
  }

`;



const TypeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
`;


const TypeText = styled.div`
  font-size: 14px;
  color: #454545;
  font-weight: 300;
  white-space: pre-line;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
`;

export default function StudyTimeStats() {
  const [preferredType, setPreferredType] = useState('');
  const [weeklyStats, setWeeklyStats] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const data = await fetchStudyTimeStats();
        
        if (!data) {
          setError(true);
          return;
        }
        
        setPreferredType(data.preferredType || '');
        setWeeklyStats(data.weeklyStats || {});
        
        console.log('📊 StudyTimeStats 데이터 처리:', {
          preferredType: data.preferredType,
          weeklyStats: data.weeklyStats
        });
      } catch (err) {
        console.error("❌ 공부 시간 데이터 요청 실패:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  // API 데이터를 차트 형식으로 변환하는 함수
  const transformWeeklyStatsToChartData = (weeklyStats) => {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    return dayNames.map(day => {
      const dayData = weeklyStats[day] || {};
      return {
        day,
        morning: dayData.morning || 0,
        afternoon: dayData.afternoon || 0,
        evening: dayData.evening || 0,
        night: dayData.night || 0,
      };
    });
  };

  // API 데이터 변환 - 데이터가 없어도 빈 차트 표시
  const data = Object.keys(weeklyStats).length > 0 
    ? transformWeeklyStatsToChartData(weeklyStats)
    : transformWeeklyStatsToChartData({});

  return (
    <TimeCard>
      <CardHeader>
        <HeaderLeft>
          <CardTitle>주간 학습 패턴</CardTitle>
          <CardSubtitle>선호 학습시간대를 알아보고 분석해보아요!</CardSubtitle>
        </HeaderLeft>
        <LegendContainer>
            <LegendItem>
              <LegendColor color="#BFDBFF" />
              <span>오전</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#FFDD8F" />
              <span>낮</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#EAD4FF" />
              <span>저녁</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#C5F8B5" />
              <span>새벽</span>
            </LegendItem>
          </LegendContainer>
      </CardHeader>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          <p>데이터를 불러오는데 실패했습니다.</p>
        </div>
      )}

      {!loading && !error && (
        <ContentWrapper>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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

          <TypeContainer>
            <TypeButton>
              {preferredType || '언제든지 좋아형'}
            </TypeButton>
            <TypeText>
              {preferredType || '언제든지 좋아형'}으로 오전~오후 상관없이 언제나 열심히 학습을 하고 있는 유형입니다!
            </TypeText>
          </TypeContainer>

        </ContentWrapper>
      )}
    </TimeCard>
  );
}
