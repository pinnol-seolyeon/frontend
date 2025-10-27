import React, { useEffect } from "react";
import styled from "styled-components";
import Card from "../../components/Card";
import pencil from "../../assets/pencil_icon.png";
import analysis from "../../assets/analysis_icon.png";
import lesson from "../../assets/lesson_icon.png";
import goal from "../../assets/goal_icon.png";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Book from "../../assets/book.svg";
import Graph from "../../assets/graph.svg";
import Pencil from "../../assets/pencil.svg";
import CircleGraph from "../../assets/circle_graph.svg";

// 이미지를 미리 로드하여 캐시에 저장
const preloadImages = () => {
  const images = [Book, Graph, Pencil, CircleGraph];
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

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
  padding: 2rem 0;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  max-width: 80%;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  gap: 0.8rem;
  align-items: flex-start;
`;

const TitleText = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #191919;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  text-align: left; /* 왼쪽 정렬로 변경 */
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-top: 1rem;
    margin-bottom: 0.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.2rem;
  }
`;

const SubTitleText = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  color: #191919;
  text-align: left; /* 왼쪽 정렬로 변경 */
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CardWrapper = styled.div` 
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬로 변경 */
  gap: 2.5rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2.5rem;
  width: 100%;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
`;

const Main = ({user, login, setLogin}) => {
  console.log('REDIRECT_URI:', process.env.REACT_APP_KAKAO_REDIRECT_URI);
  console.log('현재 NODE_ENV:', process.env.NODE_ENV);

  const navigate = useNavigate();
  
  // SVG 이미지 프리로딩 - 컴포넌트가 마운트되기 전에 실행
  useEffect(() => {
    preloadImages();
  }, []);
  
  // 메인페이지에 처음 접근할 때도 프리로드
  if (typeof window !== 'undefined') {
    preloadImages();
  }
  
  return (
    <Wrapper>
      <ContentWrapper>
        <Sidebar user={user} login={login} setLogin={setLogin} />
        <MainWrapper>
          <ScreenWrapper>
            <TextWrapper>
              <TitleText>
                {user?.name ? user.name.slice(1) : "친구"}, 오늘도 함께 배워볼까?
              </TitleText>
              <SubTitleText>재미있는 금융 모험이 기다리고 있어!</SubTitleText>
            </TextWrapper>
            <CardsContainer>
              <CardWrapper>
                <Card
                    icon={Book}
                    title="AI 학습하기"
                    description={`AI 선생님과 함께
                      오늘의 학습을 시작해보자!`}
                    backgroundColor = "#FFA546"
                    onButtonClick={() => {
                      console.log('클릭!');
                      navigate('/book');
                    }}          />
                <Card
                  icon={Graph}
                  title="학습 분석"
                  description={`나의 학습 상태를 분석하고
                      피드백을 받아보자!`}
                  backgroundColor = "#478CEE"
                  onButtonClick={() => {
                    console.log('클릭!');
                    navigate('/dashboard');
                  }}
                />
              </CardWrapper>
              <CardWrapper>
                <Card
                  icon={Pencil}
                  title="복습하기"
                  description={`이전 학습 내용을 복습하고
                      퀴즈를 받아보자!`}
                  backgroundColor = "#6FC3FB"
                  onButtonClick={() => console.log('클릭!')}
                />
                <Card
                  icon={CircleGraph}
                  title="학습 현황"
                  description={`전체 학습 진도와
                    획득 포인트를 확인해보자!`}
                  backgroundColor = "#FFC43C"
                  onButtonClick={() => console.log('클릭!')}
                />
              </CardWrapper>
            </CardsContainer>
          </ScreenWrapper>
        </MainWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Main;