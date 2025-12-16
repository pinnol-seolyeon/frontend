import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StudyTimeStats from '../../components/analyze/StudyTimeStats';
import RadarGraph from '../../components/analyze/RadarChart';
import QnAViewer from '../../components/analyze/QnAViewer';
import { fetchStudyStats, fetchStudyNowStats, fetchRadarScore, fetchTotalProgress } from '../../api/analyze/analytics';
import Sidebar from '../../components/Sidebar';
import lite from '../../assets/lite_analyze.png';

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

const TitleTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 0.5rem;
`;

const LightImg = styled.img`
  width: 2rem;
  object-fit: contain;
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
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-self: flex-start;
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


const ChartBox = styled.div`
  display: flex;
  gap: 0.8rem;
  width: 100%;
  align-items: stretch;
`;

export default function Dashboard({ user, login, setLogin }) {
  const [studyStats, setStudyStats] = useState({ totalCompleted: 0, weeklyCompleted: 0 });
  const [thisWeek, setThisWeek] = useState({});
  const [lastWeek, setLastWeek] = useState({});
  const [progress, setProgress] = useState(80);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noStudy, setNoStudy] = useState(false);
  const [nowStudying, setNowStudying] = useState(null);
  const [totalProgress, setTotalProgress] = useState(null);
  useEffect(() => {
    if (totalProgress !== null && totalProgress !== undefined) {
      // totalProgress는 API에서 바로 퍼센트 값으로 옴 (33.3)
      setProgress(Math.round(totalProgress));
      console.log('📊 진행률 설정:', {
        totalProgress,
        finalProgress: Math.round(totalProgress)
      });
    }
  }, [totalProgress]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsData, nowStudyingResponse, radarData, totalProgressData] = await Promise.all([
          fetchStudyStats(),
          fetchStudyNowStats(),
          fetchRadarScore(),
          fetchTotalProgress()
        ]);
        
        console.log('📊 now-studying API 응답:', nowStudyingResponse);
        
        console.log('📊 statsData:', statsData);
        console.log('📊 totalProgressData:', totalProgressData);
        console.log('📊 radarData 원본:', radarData);
        
        if (statsData === 0) {
          setNoStudy(true);
          setStudyStats({ totalCompleted: 0 });
        } else {
          setNoStudy(false);
          // API 응답: { totalCompleted: 2 }
          setStudyStats(statsData);
        }
        
        // now-studying API의 새로운 구조 사용
        if (nowStudyingResponse && nowStudyingResponse.data) {
          setNowStudying(nowStudyingResponse.data);
          console.log('✅ 현재 학습 중:', nowStudyingResponse.data);
        } else {
          setNowStudying(null);
          console.log('⚠️ 현재 학습 중인 데이터 없음');
        }
        
        // totalProgressData는 숫자 (33.3)
        setTotalProgress(totalProgressData);
        
        // radarData가 { data: { thisWeek, lastWeek } } 형식인지 확인
        if (radarData && radarData.data) {
          console.log('✅ radarData.data 사용:', radarData.data);
          setThisWeek(radarData.data.thisWeek || {});
          setLastWeek(radarData.data.lastWeek || {});
        } else if (radarData) {
          console.log('✅ radarData 직접 사용:', radarData);
          setThisWeek(radarData.thisWeek || {});
          setLastWeek(radarData.lastWeek || {});
        } else {
          console.log('⚠️ radarData 없음');
          setThisWeek({});
          setLastWeek({});
        }
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Wrapper>
      <ContentWrapper>
        <Sidebar user={user} login={login} setLogin={setLogin} />
        <MainWrapper>
          <ContentContainer>
            <TitleWrapper>
              <TitleTextWrapper>
                <TitleText>학습 분석</TitleText>
                <LightImg src={lite} />
              </TitleTextWrapper>
              <SubTitleText>학습 분석을 통해 학습 현황을 확인할 수 있습니다.</SubTitleText>
            </TitleWrapper>
            
            {loading && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>데이터를 불러오는 중입니다...</p>
              </div>
            )}
            
            {error && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                <p>데이터를 불러오는데 실패했습니다: {error}</p>
              </div>
            )}
            
            {!loading && !error && (
            <ContentBox>
            {/* 위쪽 수평 두 개 */}
            <TopBox>
              <ProgressContainer>
                <ContainerWrapper>
                  <ContainerTitle>전체 진행률</ContainerTitle>
                  <PlusContainer>+{studyStats?.totalCompleted || 0}</PlusContainer>
                  <ContainerText>{noStudy ? `아직 학습을 진행 안했어요\n학습을 시작해볼까요?` : `이번 주에 ${studyStats?.totalCompleted || 0}개의 단원을 완료했어요!
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
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (totalProgress || 0) / 100)}`}
                      transform="rotate(-90 48 48)"
                    />
                  </svg>
                  <ProgressText>{progress}%</ProgressText>
                </CircularProgress>            
              </ProgressContainer>
              <ProgressContainer>
              <ContainerWrapper>
                  <ContainerTitle>학습 완료한 단원 수</ContainerTitle>
                  <ContainerText>{noStudy ? '아직 학습을 진행 안했어 학습을 시작해볼까?' : `지금까지 ${studyStats?.totalCompleted || 0}개의 레벨을 학습 완료했어요!
  앞으로도 열심히 해봐요!`}</ContainerText>
                </ContainerWrapper>
                <CircleWrapper>
                  <CircleText>{studyStats?.totalCompleted || 0}</CircleText>
                </CircleWrapper>
              </ProgressContainer>
              <ProgressContainer>
              <ContainerWrapper>
                  <ContainerTitle>현재 학습 중</ContainerTitle>
                  <ContainerText>
                    {noStudy || !nowStudying ? '아직 학습을 진행 안했어 학습을 시작해볼까?' : 
                    `${nowStudying.bookTitle} - ${nowStudying.chapterTitle}
Level ${nowStudying.currentLevel}을 학습하고 있어요!`}
                  </ContainerText>
                </ContainerWrapper>
                <CircleWrapper>
                  <CircleText>
                    {nowStudying ? `Lv.${nowStudying.currentLevel}` : 'Lv.0'}
                  </CircleText>
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
            )}
          </ContentContainer>
        </MainWrapper>

      </ContentWrapper>
    </Wrapper>
  );
}
