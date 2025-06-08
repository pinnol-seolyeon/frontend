import styled, { createGlobalStyle } from "styled-components";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "../../../components/Box";
import MiniHeader from "../../../components/study/MiniHeader";
import Button from "../../../components/Button";
import TtsPlayer from "../../../components/TtsPlayer";
import tiger from "../../../assets/tiger-pencil.png";
import { useChapter } from "../../../context/ChapterContext";

/* 1. 전역 스타일: box-sizing + rem 기준 설정 */
const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 16px; /* 1rem = 16px */
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }
`;

/* 2. Grid 컨테이너: 헤더 / 메인 / 풋터 */
const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto; /* 헤더, 메인, 풋터 */
  width: 100%;
  min-height: 100vh;
  padding: 1rem;      /* 1rem = 16px */
  gap: 1.5rem;        /* row 간격 */
`;

/* 3. 이미지 영역: 중앙 정렬 */
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* 4. 일러스트: 반응형 크기 제한 */
const Image = styled.img`
  width: 100%;
  max-width: 20rem;   /* 20rem = 320px */
  height: auto;
  object-fit: contain;
`;

/* 5. 말풍선(풋터): flex-column */
const SpeechBubble = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 50rem;   /* 50rem = 800px */
  background-color: #fef3e1;
  border-radius: 0.5rem; /* 8px */
  padding: 1.5rem;
  box-sizing: border-box;
`;

/* 6. 텍스트 박스 */
const TextBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;  /* 20px */
  line-height: 1.6;
  text-align: center;
  font-family: "Noto Sans KR", sans-serif;
  color: #333;
`;

/* 7. 버튼: 절대 위치 제거, flex 내 정렬로 처리 */
const BubbleButton = styled(Button)`
  align-self: flex-end;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
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
        setTitle(chapterData?.chapterTitle ?? "⚠️ 로딩 실패");
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
      alert("✅ 화면 상단 '다음 단계로' 버튼을 눌러주세요!");
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

      <Container>
        {/* 1) 헤더 */}
        <Box style={{ width: "100%" }}>
          <MiniHeader
            left={<Button onClick={() => navigate(-1)}>뒤로</Button>}
            right={<Button onClick={() => navigate(`/study/2`)}>다음 단계로</Button>}
          >
            1/6 선생님과 학습하기
          </MiniHeader>
        </Box>

        {/* 2) 메인 이미지 */}
        <ImageWrapper>
          <Image src={tiger} alt="호랑이 선생님" />
        </ImageWrapper>

        {/* 3) 풋터 말풍선 */}
        <Box style={{ width: "100%" }}>
          <TtsPlayer
            sentences={textToRead}
            answers={[]}
            isAnsweringPhase={false}
            currentIndex={0}
            autoPlay
            style={{ display: "none" }}
            onPreloadDone={() => setPreloadDone(true)}
          />

          {!preloadDone ? (
            <TextBox>화면을 준비 중입니다...</TextBox>
          ) : (
            <SpeechBubble>
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
            </SpeechBubble>
          )}
        </Box>
      </Container>
    </>
  );
}
