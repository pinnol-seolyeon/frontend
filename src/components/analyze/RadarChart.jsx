import React, { useState } from 'react';
import styled from 'styled-components';
import Info from "../../assets/info_icon.svg";

import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer
} from 'recharts';

// import styles from './RadarGraph.module.css'; // 스타일 분리

const AnalysisCard = styled.div`
  background: white;
  border-radius: 5px;
  padding: 2rem;
  border : 1px solid #DADADA;
  flex : 0.3;
`;

const CardHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const CardTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
`;

const CardInfo = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 20px;
    height: 20px;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 1;
    }
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(0,0,0,0.8);
  color: white;
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 400;
  white-space: pre;
  line-height: 1.3;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
  
  /* 툴팁 화살표 */
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #333333;
  }
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #191919;
`;

const CardSubtitle = styled.p`
  font-size: 14px;
  color: #454545;
  margin: 0;
  white-space: pre-line;
  font-weight: 300;
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


const SummaryMessage = styled.div`
  display: flex;
  font-size: 14px;
  color: #454545;
  font-weight: 300;
  justify-content: flex-start;
  align-items: center;
  text-align: flex-start;
  margin: 0;
  white-space: pre-line;
`;

const KeywordMessage = styled.div`
  display: flex;
  background-color: #191919;
  width: fit-content;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  padding: 0.25rem 1.1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  justify-content: center;
  align-items: center;
  text-align: center;
`;




  export default function RadarGraph({ thisWeek, lastWeek }) {
  const [showTooltip, setShowTooltip] = useState(false);
  // API 데이터가 없거나 빈 객체인 경우 기본값 설정
  const safeThisWeek = thisWeek || { engagement: 0, focus: 0, understanding: 0, expression: 0 };
  const safeLastWeek = lastWeek || { engagement: 0, focus: 0, understanding: 0, expression: 0 };

  // API 데이터를 사용하여 차트 데이터 생성
  const data = [
    { subject: "참여도", thisWeek: safeThisWeek.engagement * 100, lastWeek: safeLastWeek.engagement * 100 },
    { subject: "집중도", thisWeek: safeThisWeek.focus * 100, lastWeek: safeLastWeek.focus * 100 },
    { subject: "이해도", thisWeek: safeThisWeek.understanding * 100, lastWeek: safeLastWeek.understanding * 100 },
    { subject: "표현력", thisWeek: safeThisWeek.expression * 100, lastWeek: safeLastWeek.expression * 100 },
  ];

  const getSummaryText = () => {
    const avg = (safeThisWeek.engagement + safeThisWeek.focus + safeThisWeek.understanding + safeThisWeek.expression) / 4 * 100;
    if (avg >= 80) return "학습 태도가 매우 우수합니다! 👍";
    if (avg >= 60) return "양호한 학습 태도입니다.\n약간의 개선 여지는 있지만 좋은 흐름이에요.";
    // if (avg >= 40) return "노력이 필요해요. 열심히 하면 못할 건 없어요!";
    return "노력이 필요해요.\n열심히 하면 못할 건 없어요!";

    // return "학습 활동이 부족해요. 충분한 학습이 필요합니다.";
  };

  const getKeywordText = () => {
    const avg = (safeThisWeek.engagement + safeThisWeek.focus + safeThisWeek.understanding + safeThisWeek.expression) / 4 * 100;
    if (avg >= 80) return "학습 태도가 매우 우수해요!";
    if (avg >= 60) return "양호한 학습 태도에요!";
    return "노력이 필요해요!";
  };

  console.log('📊 RadarGraph 데이터:', { thisWeek: safeThisWeek, lastWeek: safeLastWeek, data });

  return (
    <AnalysisCard>
      <CardHeader>
        <CardTitleWrapper>
          <CardTitle>이해도 분석</CardTitle>
          <CardInfo 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <img src={Info} alt="info" />
            <Tooltip show={showTooltip}>
               {`이해도 분석은 여러가지 점수 합산을\n통하여 통합 점수를 그래프로\n보여줍니다.`}
            </Tooltip>
          </CardInfo>
        </CardTitleWrapper>
        <CardSubtitle>{`이번 주와 지난 주의 학습 성과를
        항목별로 비교해보세요!`}</CardSubtitle>
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
        <KeywordMessage>
          {getKeywordText()}
        </KeywordMessage>


      <SummaryMessage>
        {getSummaryText()}
      </SummaryMessage>
    </AnalysisCard>
  );
}
