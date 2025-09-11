import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import StudyStatsBox from '../../components/analyze/StudyStatsBox';
import StudyTimeStats from '../../components/analyze/StudyTimeStats';
import RadarGraph from '../../components/analyze/RadarChart';
import QnAViewer from '../../components/analyze/QnAViewer';
import { fetchStudyStats, fetchRadarScore } from '../../api/analyze/analytics';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;
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
  margin: 2rem 10rem;
`;

const TitleText = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333333;
  align-self: center;
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-self: center;
  border-radius: 20px;
`;

const TopBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 20px;
  background-color: white;
  padding: 2rem;
  box-shadow: 0 4px 4px rgba(153, 175, 203, 0.5);
`;

const TopBoxes = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  border-radius: 20px;
  background-color: white;
  padding: 2rem;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #4A91FE;
  border-radius: 10px;
  padding: 0.3rem 1.3rem;
`;

const ProgressValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
`;

const ProgressChart = styled.div`
  width: 100%;
  height: 20px;
  background-color: #E5E5E5;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #4A91FE;
  border-radius: 10px;
  width: ${props => props.progress || 0}%;
  transition: width 0.3s ease;
`;


const BottomBoxes = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;

const SquareBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

const RadarChartBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartBox = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: space-between;
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 60px 0;
  color: #666;
  font-size: 1.1rem;
`;

export default function Dashboard({ user, login, setLogin }) {
  const [studyStats, setStudyStats] = useState({ totalCompleted: 0, weeklyCompleted: 0 });
  const [thisWeek, setThisWeek] = useState({});
  const [lastWeek, setLastWeek] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudyStats()
    .then(setStudyStats)
    .catch(err => {
      console.error("❌ 통계 불러오기 실패:", err);
      setStudyStats(null);
    });
    fetchRadarScore().then(score => {
      setThisWeek(score.thisWeek);
      setLastWeek(score.lastWeek);
    });
  }, []);

  // 페이지 정보 설정
  const pageInfo = {
    icon: "📊",
    title: "Lv.01",
    subtitle: "What is money?"
  };

  return (
    <Wrapper>
      <Header user={user} login={login} setLogin={setLogin} pageInfo={pageInfo} />
      <MainWrapper>
        <BackButton
          onClick={() => navigate('/main')}
        >{'<'} 이전 페이지로 돌아가기</BackButton>
        
        <ContentBox>
          {/* 위쪽 수평 두 개 */}
          <TopBox>
            <TopWrapper>
              <TitleText>전체 진행률</TitleText>
              <ProgressWrapper>
                <ProgressValue>40%</ProgressValue>
              </ProgressWrapper>
            </TopWrapper>
            <ProgressChart>
              <ProgressFill progress={40} />
            </ProgressChart>
            <TopBoxes>
              <StudyStatsBox type="total" />
              <StudyStatsBox type="weekly" />
              <StudyStatsBox type="level" />
            </TopBoxes>
          </TopBox>

          {/* 가운데 박스: 방사형 그래프 + 설명 */}
          {/* {thisWeek && lastWeek && Object.keys(thisWeek).length > 0 ? (
              <RadarGraph thisWeek={thisWeek} lastWeek={lastWeek} />
            ) : (
              <LoadingText>분석 데이터를 불러오는 중입니다...</LoadingText>
            )} */}
          <ChartBox>
            <RadarGraph thisWeek={thisWeek} lastWeek={lastWeek} />
            <StudyTimeStats />
          </ChartBox>

        <QnAViewer />
        </ContentBox>
      </MainWrapper>
    </Wrapper>
  );
}
