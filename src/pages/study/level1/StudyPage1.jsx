import styled, { createGlobalStyle } from "styled-components";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-pencil.png";
import Button from "../../../components/Button";
import MiniHeader from "../../../components/study/MiniHeader";
import TtsPlayer from "../../../components/TtsPlayer";
import { useChapter } from "../../../context/ChapterContext";

/* 전역 스타일: 스크롤 없애고 box-sizing 통일 */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    overflow: hidden;
  }
`;

/* 1280×720 고정 크기 컨테이너 */
const Container = styled.div`
  width: 1280px;
  height: 720px;
  margin: 0 auto;      /* 브라우저 가운데 정렬 */
  position: relative;  
  background: white;
  overflow: hidden;
`;

/* 헤더 영역: 절대 배치 */
const HeaderArea = styled(Box)`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 60px;
`;

/* 이미지 영역: 절대 배치, 중앙 */
const ImageWrapper = styled.div`
  position: absolute;
  top: 120px;
  left: calc(50% - 150px); /* 300px 너비의 절반 */
  width: 300px;
`;

const Image = styled.img`
  width: 300px;
  height: auto;
`;

/* 말풍선 영역: 절대 배치, 중앙 하단 */
const SpeechBubble = styled.div`
  position: absolute;
  bottom: 50px;
  left: calc(50% - 400px); /* 800px 너비의 절반 */
  width: 800px;
  padding: 20px;
  background-color: #FEF3E1;
  border-radius: 8px;
`;

/* 텍스트 박스 */
const TextBox = styled.div`
  font-size: 20px;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 20px;
`;

/* 말풍선 버튼: 절대 배치 제거, 내부 상대 배치 */
const BubbleButton = styled(Button)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 40px;
  font-size: 16px;
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
        if (chapterData?.chapterTitle) {
          setTitle(chapterData.chapterTitle);
        }
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
      alert("✅ 화면 상단 ‘다음 단계로’ 버튼을 클릭해주세요!");
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
        {/* 헤더 */}
        <HeaderArea>
          <MiniHeader
            left={<Button onClick={() => navigate(-1)}>뒤로</Button>}
            right={<Button onClick={() => navigate(`/study/2`)}>다음 단계로</Button>}
          >
            1/6 선생님과 학습하기
          </MiniHeader>
        </HeaderArea>

        {/* 이미지 */}
        <ImageWrapper>
          <Image src={tiger} alt="샘플" />
        </ImageWrapper>

        {/* 말풍선 */}
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
