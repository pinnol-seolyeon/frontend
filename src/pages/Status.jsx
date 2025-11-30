import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import pencil from "../assets/pencil_icon.png";
import analysis from "../assets/analysis_icon.png";
import lesson from "../assets/lesson_icon.png";
import goal from "../assets/goal_icon.png";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatusBox from "../components/StatusBox";
import Book from "../assets/book.svg";
import Graph from "../assets/graph.svg";
import Pencil from "../assets/pencil.svg";
import CircleGraph from "../assets/circle_graph.svg";
import { fetchCurrentSituation } from "../api/status/currentSituation";
import { fetchTotalProgress } from "../api/analyze/analytics";

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
  justify-content: flex-start;
  padding: 2rem 0;
  
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
  padding: 2rem;
`;


const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
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

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #F0F4FC;
  border-radius: 5px;
  width: 100%;
`;

const CircularProgress = styled.div`
  width: 10rem;
  height: 10rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NumberText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #4C4C4C;
`;

const ProgressText = styled.div`
  position: absolute;
  font-size: 13px;
  font-weight: 300;
  color: #4C4C4C;
  z-index: 1;
  white-space: pre-line;
  text-align: center;
  line-height: 1.2;
`;

const ProgressTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #191919;
  line-height: 1.3;
`;

const ProgressSubtitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #454545;
  line-height: 1.4;
`;

const StatusBoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #191919;
  margin-bottom: 1rem;
  margin-top: 2rem;
`;



const Status = ({user, login, setLogin}) => {
  const navigate = useNavigate();
  const [statusBoxes, setStatusBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overall, setOverall] = useState({ percent: 0, total: 0, completed: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        // 두 API를 병렬로 호출
        const [page, overallPercent] = await Promise.all([
          fetchCurrentSituation(0),
          fetchTotalProgress()
        ]);
        
        const list = Array.isArray(page?.content) ? page.content : [];

        const mapped = list.map((item, idx) => ({
          id: item.chapterId || idx,
          title: item.chapterTitle,
          status: item.status === 'COMPLETED' 
            ? 'completed' 
            : (item.status === 'IN_PROGRESS' || item.status === 'STUDYING') 
              ? 'in_progress' 
              : 'not_started',
          progress: typeof item.progress === 'number' ? item.progress : 0,
          description: '',
          stickers: Array.isArray(item.badgeType) ? item.badgeType.map(b => ({ type: b, name: b })) : []
        }));

        const total = list.length;
        const completed = list.filter(i => i.status === 'COMPLETED').length;
        // overall-progress API에서 받은 percent 사용 (숫자 값, 예: 33.3)
        const percent = typeof overallPercent === 'number' ? Math.round(overallPercent) : 0;

        setStatusBoxes(mapped);
        setOverall({ percent, total, completed });
      } catch (e) {
        console.error('학습 현황 로드 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusBoxClick = (data) => {
    navigate('/status/detail', { 
      state: { 
        chapterId: data.chapterId,
        title: data.title,
        status: data.status,
        progress: data.progress,
        description: data.description,
        stickers: data.stickers
      }
    });
  };

  return (
    <Wrapper>
      <ContentWrapper>
        <Sidebar user={user} login={login} setLogin={setLogin} />
        <MainWrapper>
            <ContentContainer>
                <TitleWrapper>
                    <TitleText>학습 현황</TitleText>
                    <SubTitleText>{user?.name}님의 학습 현황</SubTitleText>
                </TitleWrapper>
                <ProgressWrapper>
                    <CircularProgress>
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            {/* 배경 원 */}
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#E5E5E5"
                                strokeWidth="8"
                            />
                            {/* 진행률 원 */}
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#4A91FE"
                                strokeWidth="13"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 50}`}
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - (overall.percent || 0) / 100)}`}
                                transform="rotate(-90 60 60)"
                            />
                        </svg>
                        <ProgressText><NumberText>{Math.round(overall.percent || 0)}%</NumberText>완료</ProgressText>
                    </CircularProgress>
                    <ProgressTextWrapper>
                        <ProgressTitle>총 {overall.total}개 단원 중 {overall.completed}개를 완료했어요!</ProgressTitle>
                        <ProgressSubtitle>전체 진행률은 {Math.round(overall.percent || 0)}% 입니다.</ProgressSubtitle>
                    </ProgressTextWrapper>
                </ProgressWrapper>
                
                <SectionTitle>학습 단원 현황</SectionTitle>
                
                {loading ? (
                    <div>로딩 중...</div>
                ) : (
                    <StatusBoxGrid>
                        {statusBoxes.map((box) => (
                            <StatusBox
                                key={box.id}
                                chapterId={box.id}
                                title={box.title}
                                status={box.status}
                                progress={box.progress}
                                description={box.description}
                                stickers={box.stickers}
                                onClick={handleStatusBoxClick}
                            />
                        ))}
                    </StatusBoxGrid>
                )}
            </ContentContainer>
        </MainWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Status;