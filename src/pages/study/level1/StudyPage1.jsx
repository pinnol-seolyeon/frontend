import styled, { createGlobalStyle } from "styled-components";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../../components/Header";           // 전체 페이지 헤더
import Box from "../../../components/Box";                 // 카드 역할
import MiniHeader from "../../../components/study/MiniHeader"; 
import Button from "../../../components/Button";
import TtsPlayer from "../../../components/TtsPlayer";
import tiger from "../../../assets/tiger-pencil.png";
import { useChapter } from "../../../context/ChapterContext";

/* 전역 스타일: box-sizing 통일 + 스크롤 숨김 */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin:0; padding:0;
    overflow: hidden; /* 필요에 따라 auto로 바꿔도 됩니다 */
  }
`;

/* 1) 화면 전체를 감싸는 Wrapper: 수직으로 쌓되, 위에서부터 배치 */
const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

/* 2) 페이지 헤더 아래에 띄울 Box(카드) */
const Card = styled(Box)`
  position: relative;       /* 내부 말풍선 절대 배치용 */
  width: 80%;
  max-width: 900px;
  margin-top: 24px;         /* Header와 간격 */
  height: 600px;            /* 원하는 고정 높이 */
  overflow: hidden;         
`;

/* 3) MiniHeader (카드 내부 단계 헤더) */
const StepHeader = styled(MiniHeader)`
  /* 필요시 스타일 추가 */
`;

/* 4) 이미지: 카드 내부에서 140px 아래, 중앙정렬 */
const ImageWrapper = styled.div`
  position: absolute;
  top: 140px;
  left: calc(50% - 150px);  /* 300px 이미지 폭의 절반 */
  width: 300px;
`;

const Image = styled.img`
  width: 300px;
  height: auto;
  object-fit: contain;
`;

/* 5) 말풍선: 카드 바닥에 딱 붙여, 좌우 여백 없이 꽉 채움 */
const SpeechBubble = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;             /* 카드 폭 그대로 */
  background-color: #FEF3E1;
  padding: 24px;
  box-sizing: border-box;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

/* 6) 말풍선 텍스트 */
const TextBox = styled.div`
  font-size: 20px;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 16px;
`;

/* 7) 말풍선 버튼: 말풍선 안에서 오른쪽 아래 */
const BubbleButton = styled(Button)`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 120px;
  height: 44px;
  font-size: 18px;
`;

export default function StudyPage() {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const { chapterData } = useChapter();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [preloadDone, setPreloadDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setTitle(chapterData?.chapterTitle ?? "⚠️단원명 로딩실패");
      } finally {
        setLoading(false);
        setPreloadDone(false);
      }
    })();
  }, [chapterId, chapterData]);

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      setPreloadDone(false);
    } else {
      alert("✅화면 상단 ‘다음 단계로’ 버튼을 클릭해주세요!");
    }
  };

  const textToRead = useMemo(() => {
    if (loading) return [];
    return step === 0
      ? ["안녕! 나는 호랑이 선생님이야"]
      : [`이번 단원은 ${title} 이제 본격적으로 공부를 시작해보자`];
  }, [loading, step, title]);

  return (
    <>
      <GlobalStyle />

      <Wrapper>
        {/* 전체 사이트 헤더 */}
        <Header />

        {/* 메인 카드 */}
        <Card>
          {/* 카드 내부 단계 헤더 */}
          <StepHeader
            left={<Button onClick={() => navigate(-1)}>뒤로</Button>}
            right={<Button onClick={() => navigate(`/study/2`)}>다음 단계로</Button>}
          >
            1/6 선생님과 학습하기
          </StepHeader>

          {/* 중앙 이미지 */}
          <ImageWrapper>
            <Image src={tiger} alt="호랑이 샘플" />
          </ImageWrapper>

          {/* TTS 프리로드 */}
          <TtsPlayer
            sentences={textToRead}
            answers={[]}
            isAnsweringPhase={false}
            currentIndex={0}
            autoPlay
            style={{ display: "none" }}
            onPreloadDone={() => setPreloadDone(true)}
          />

          {/* 말풍선: 카드 바닥에 딱 붙어, 좌우 여백 없음 */}
          <SpeechBubble>
            {!preloadDone ? (
              <TextBox>화면을 준비 중입니다...</TextBox>
            ) : (
              <>
                <TextBox>
                  {loading
                    ? "단원을 준비 중이에요..."
                    : step === 0
                    ? "안녕! 나는 호랑이 선생님이야"
                    : `이번 단원은 ${title} 이제 본격적으로 공부를 시작해보자`}
                </TextBox>
                <BubbleButton onClick={handleNext}>
                  {step === 0 ? "다음" : "시작하기"}
                </BubbleButton>
              </>
            )}
          </SpeechBubble>
        </Card>
      </Wrapper>
    </>
  );
}
