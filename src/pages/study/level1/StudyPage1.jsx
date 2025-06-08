import styled, { createGlobalStyle } from "styled-components";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "../../../components/Box";
import MiniHeader from "../../../components/study/MiniHeader";
import Button from "../../../components/Button";
import TtsPlayer from "../../../components/TtsPlayer";
import tiger from "../../../assets/tiger-pencil.png";
import { useChapter } from "../../../context/ChapterContext";

/* 전역 스타일: 화면 스크롤 제거 + box-sizing 통일 */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; overflow: hidden; }
`;

/* 1280×720px 고정 컨테이너 */
const Container = styled.div`
  width: 1280px;
  height: 720px;
  margin: 0 auto;
  position: relative;
  background: #fff;
  border: 1px solid #333;
  border-radius: 16px;
  overflow: hidden;
`;

/* 1) 헤더: 높이 80px */
const HeaderArea = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
`;

/* 2) 이미지: Y축 140px, 중앙 정렬 */
const ImageWrapper = styled.div`
  position: absolute;
  top: 140px;
  left: calc(50% - 150px);  /* 300px / 2 */
  width: 300px;
`;

const Image = styled.img`
  width: 300px;
  height: auto;
`;

/* 3) 말풍선: 폭 900px, 하단 여백 80px */
const SpeechBubble = styled.div`
  position: absolute;
  bottom: 80px;
  left: calc(50% - 450px);  /* 900px / 2 */
  width: 900px;
  padding: 24px;
  background-color: #FEF3E1;
  border-radius: 8px;
`;

/* 텍스트 */
const TextBox = styled.div`
  font-size: 20px;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 20px;
`;

/* 말풍선 버튼 */
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
        if (chapterData?.chapterTitle) setTitle(chapterData.chapterTitle);
      } catch {
        setTitle("⚠️ 단원명 로딩실패");
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
      alert("화면 상단 ‘다음 단계로’ 버튼을 눌러주세요!");
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
        <HeaderArea>
          <MiniHeader
            left={<Button onClick={() => navigate(-1)}>뒤로</Button>}
            right={<Button onClick={() => navigate(`/study/2`)}>다음 단계로</Button>}
          >
            1/6 선생님과 학습하기
          </MiniHeader>
        </HeaderArea>

        {/* 2) 이미지 */}
        <ImageWrapper>
          <Image src={tiger} alt="호랑이 샘플" />
        </ImageWrapper>

        {/* 3) 말풍선 */}
        <SpeechBubble>
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
      </Container>
    </>
  );
}
