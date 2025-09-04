import React from 'react';
import styled from 'styled-components';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Legend
} from 'recharts';

// import styles from './RadarGraph.module.css'; // 스타일 분리

const AnalysisCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const CardHeader = styled.div`
  margin-bottom: 1.5rem;
`;

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

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  // border: 1px solid #e9ecef;
`;

const ChartPlaceholder = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

const SummaryMessage = styled.p`
  font-size: 1rem;
  color: #2F2F2F;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0;
`;

export default function RadarGraph({ thisWeek, lastWeek }) {
  //api
  // const getSummaryText = () => {
  //   const avg = (thisWeek.engagement + thisWeek.focus + thisWeek.understanding + thisWeek.expression) / 4;
  //   if (avg >= 0.8) return "학습 태도가 매우 우수합니다! 👍";
  //   if (avg >= 0.6) return "양호한 학습 태도입니다. 약간의 개선 여지는 있지만 좋은 흐름이에요.";
  //   if (avg >= 0.4) return "노력이 필요해요. 열심히 하면 못할 건 없어요!";
  //   return "학습 활동이 부족해요. 충분한 학습이 필요합니다.";
  // };


  // API 데이터 주석처리 - 하드코딩된 데이터로 디자인 작업
  // const data = [
  //   { subject: "참여도", thisWeek: thisWeek.engagement * 100, lastWeek: lastWeek.engagement * 100 },
  //   { subject: "집중도", thisWeek: thisWeek.focus * 100, lastWeek: lastWeek.focus * 100 },
  //   { subject: "이해도", thisWeek: thisWeek.understanding * 100, lastWeek: lastWeek.understanding * 100 },
  //   { subject: "표현력", thisWeek: thisWeek.expression * 100, lastWeek: lastWeek.expression * 100 },
  // ];

  // 하드코딩된 데이터로 차트 표시
  const data = [
    { subject: "참여도", thisWeek: 85, lastWeek: 70 },
    { subject: "집중도", thisWeek: 90, lastWeek: 75 },
    { subject: "이해도", thisWeek: 80, lastWeek: 65 },
    { subject: "표현력", thisWeek: 75, lastWeek: 60 },
  ];

  const getSummaryText = () => {
    const avg = (85 + 90 + 80 + 75) / 4;
    if (avg >= 80) return "학습 태도가 매우 우수합니다! 👍";
    if (avg >= 60) return "양호한 학습 태도입니다. 약간의 개선 여지는 있지만 좋은 흐름이에요.";
    if (avg >= 40) return "노력이 필요해요. 열심히 하면 못할 건 없어요!";
    return "학습 활동이 부족해요. 충분한 학습이 필요합니다.";
  };

  return (
    <AnalysisCard>
      <CardHeader>
        <CardTitle>이해도 분석</CardTitle>
        <CardSubtitle>이번 주와 지난 주의 학습 성과를 항목별로 비교해보세요!</CardSubtitle>
      </CardHeader>

      <LegendContainer>
        <LegendItem>
          <LegendColor color="#FFDD8F" />
          <span>이번 주</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#BFDBFF" />
          <span>지난 주</span>
        </LegendItem>
      </LegendContainer>

      <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid />
            <PolarAngleAxis 
              dataKey="subject" 
              fontSize={12} 
              tickMargin={15}
              tick={{ fill: '#B8B8B8', fontSize: 10 }}
            />
            <PolarRadiusAxis angle={45} domain={[0, 100]} fontSize={9} />
            <Radar name="이번 주" dataKey="thisWeek" stroke="#FFDD8F" fill="#FFDD8F" fillOpacity={0.6} />
            <Radar name="지난 주" dataKey="lastWeek" stroke="#BFDBFF" fill="#BFDBFF" fillOpacity={0.7} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <SummaryMessage>
        {getSummaryText()}
      </SummaryMessage>
    </AnalysisCard>
  );
}
