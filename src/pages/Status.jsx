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
  margin-top: 2rem;
`;

const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #191919;
  margin-bottom: 1rem;
  margin-top: 2rem;
`;



const Status = ({user, login, setLogin}) => {
  console.log('REDIRECT_URI:', process.env.REACT_APP_KAKAO_REDIRECT_URI);
  console.log('현재 NODE_ENV:', process.env.NODE_ENV);

  const navigate = useNavigate();
  const [statusBoxes, setStatusBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 백엔드에서 받을 데이터 예시 (실제로는 API 호출)
  useEffect(() => {
    // 임시 데이터 - 실제로는 API에서 받아올 데이터
    const mockData = [
      {
        id: 1,
        title: "돈이란 무엇일까?",
        status: "completed",
        progress: 100,
        description: "돈에 대한 이해도가 높아요!",
        stickers: [
          { type: "review", name: "복습왕 스티커" },
          { type: "learning", name: "학습왕 스티커" },
          { type: "focus", name: "집중왕 스티커" }
        ]
      },
      {
        id: 2,
        title: "돈이란 무엇일까?",
        status: "completed",
        progress: 100,
        description: "돈에 대한 이해도가 높아요!",
        stickers: [
          { type: "review", name: "복습왕 스티커" },
          { type: "learning", name: "학습왕 스티커" },
          { type: "focus", name: "집중왕 스티커" }
        ]
      },
      {
        id: 3,
        title: "돈이란 무엇일까?",
        status: "in_progress",
        progress: 65,
        description: "돈에 대한 이해도가 높아요!",
        stickers: [
          { type: "review", name: "복습왕 스티커" },
          { type: "learning", name: "학습왕 스티커" },
          { type: "focus", name: "집중왕 스티커" }
        ]
      },
      {
        id: 4,
        title: "돈이란 무엇일까?",
        status: "not_started",
        progress: 0,
        description: "돈에 대한 이해도가 높아요!",
        stickers: []
      },
      {
        id: 5,
        title: "돈이란 무엇일까?",
        status: "not_started",
        progress: 0,
        description: "돈에 대한 이해도가 높아요!",
        stickers: []
      },
      {
        id: 6,
        title: "돈이란 무엇일까?",
        status: "not_started",
        progress: 0,
        description: "돈에 대한 이해도가 높아요!",
        stickers: []
      }
    ];

    // 실제 API 호출 시뮬레이션
    setTimeout(() => {
      setStatusBoxes(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // 실제 API 호출 함수 (예시)
  const fetchStatusBoxes = async () => {
    try {
      // const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/status/boxes`, {
      //   credentials: 'include'
      // });
      // const data = await response.json();
      // setStatusBoxes(data);
    } catch (error) {
      console.error('StatusBoxes 데이터 로드 실패:', error);
    }
  };

  const handleStatusBoxClick = (data) => {
    navigate('/status/detail', { 
      state: { 
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
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - 65 / 100)}`}
                                transform="rotate(-90 60 60)"
                            />
                        </svg>
                        <ProgressText><NumberText>65%</NumberText>완료</ProgressText>
                    </CircularProgress>
                    <ProgressTextWrapper>
                        <ProgressTitle>총 6개 단원 중 2개를 완료했어요!</ProgressTitle>
                        <ProgressSubtitle>전체 진행률은 65%로 평균 수준입니다.</ProgressSubtitle>
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