import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import StudyStatsBox from '../../components/analyze/StudyStatsBox';
import StudyTimeStats from '../../components/analyze/StudyTimeStats';
import RadarGraph from '../../components/analyze/RadarChart';
import QnAViewer from '../../components/analyze/QnAViewer';
import { fetchStudyStats, fetchRadarScore } from '../../api/analyze/analytics';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 0;
  padding: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MainWrapper = styled.div` 
  flex: 1;
  min-height: calc(100vh - var(--header-height, 70px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  
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
  margin-bottom: 2rem;
`;

const TitleText = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #191919;
`;

const SubTitleText = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: #191919;
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
  flex-direction: row;
  gap: 0.8rem;
  background-color: white;
  width: 100%;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  padding: 1.2rem;
  border-radius: 5px;
  border: 1px solid #DADADA;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

const ContainerTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #191919;
`;

const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContainerText = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #454545;
  white-space: pre-line;
`;

const PlusContainer = styled.div`
  border: 1px solid #2D7BED;
  border-radius: 10px;
  width: fit-content;
  padding: 0.2rem 0.5rem;
  font-size: 14px;
  font-weight: 500;
  color: #2D7BED;
`;

const CircleWrapper = styled.div`
  min-width: 5rem;
  min-height: 5rem;
  max-width: 6rem;
  max-height: 6rem;
  border-radius: 50%;
  background-color: #F0F4FC;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
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

const CircularProgress = styled.div`
  width: 8rem;
  height: 8rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressText = styled.div`
  position: absolute;
  font-size: 20px;
  font-weight: 700;
  color: #454545;
  z-index: 1;
`;

const CircleText = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #478CEE;
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
  const [progress, setProgress] = useState(80);

  // useEffect(() => {
  //   setProgress(studyStats.totalCompleted / 100);
  // }, [studyStats]);

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
    title: "Lv.01",
    subtitle: "돈이란 무엇일까?"
  };

  return (
    <Wrapper>
      <ContentWrapper>
        <Sidebar user={user} login={login} setLogin={setLogin} />
        <MainWrapper>
          <ContentContainer>
            <TitleWrapper>
              <TitleText>학습 분석</TitleText>
              <SubTitleText>학습 분석을 통해 학습 현황을 확인할 수 있습니다.</SubTitleText>
            </TitleWrapper>         
            <ContentBox>
            {/* 위쪽 수평 두 개 */}
            <TopBox>
              <ProgressContainer>
                <ContainerWrapper>
                  <ContainerTitle>전체 진행률</ContainerTitle>
                  <PlusContainer>+20%</PlusContainer>
                  <ContainerText>{`지난주 보다 20% 상승했어요!
  앞으로도 지금처럼 열심해 해봐요!`}</ContainerText>
                </ContainerWrapper>
                <CircularProgress>
                  <svg width="96" height="96" viewBox="0 0 96 96">
                    {/* 배경 원 */}
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="#E5E5E5"
                      strokeWidth="7"
                    />
                    {/* 진행률 원 */}
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="#4A91FE"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                      transform="rotate(-90 48 48)"
                    />
                  </svg>
                  <ProgressText>{progress}%</ProgressText>
                </CircularProgress>            
              </ProgressContainer>
              <ProgressContainer>
              <ContainerWrapper>
                  <ContainerTitle>학습 완료한 단원 수</ContainerTitle>
                  <ContainerText>{`지금까지 2개의 레벨을 학습 완료했어요!
  앞으로도 열심히 해봐요!`}</ContainerText>
                </ContainerWrapper>
                <CircleWrapper>
                  <CircleText>2</CircleText>
                </CircleWrapper>
              </ProgressContainer>
              <ProgressContainer>
              <ContainerWrapper>
                  <ContainerTitle>현재 단원 레벨</ContainerTitle>
                  <ContainerText>{`현재 학습 단원은 Lv.3
  돈의 여러가지 모습을 학습하고 있어요!`}</ContainerText>
                </ContainerWrapper>
                <CircleWrapper>
                  <CircleText>Lv.3</CircleText>
                </CircleWrapper>
              </ProgressContainer> 

              {/* <TopWrapper>
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
              </TopBoxes> */}
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
          </ContentContainer>
        </MainWrapper>

      </ContentWrapper>
    </Wrapper>
  );
}
