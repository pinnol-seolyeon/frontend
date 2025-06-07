// src/components/TtsPlayer.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * props:
 *   sentences: 질문 문장 배열
 *   answers: AI 응답 문장 배열
 *   isAnsweringPhase: false → 질문 단계, true → 답변 단계
 *   currentIndex: 현재 재생할 문장 인덱스
 *   autoPlay (기본 true): true면 currentIndex나 단계 바뀔 때 자동 재생
 *   style: <audio> 태그 스타일
 *   onPreloadDone: 모든 문장 캐싱 완료 시 호출되는 콜백
 */
export default function TtsPlayer({
  sentences = [],
  answers = [],
  isAnsweringPhase,
  currentIndex,
  autoPlay = true,
  style = { display: "none" },
  onPreloadDone,
}) {
  const audioRef = useRef(null);
  const [preloadAudio, setPreloadAudio] = useState([[], []]);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadError, setPreloadError] = useState(null);

  // (1) 질문 문장 캐싱
  useEffect(() => {
    if (!sentences.length) return;

    setIsPreloading(true);
    setPreloadError(null);

    Promise.all(
      sentences.map(async (text) => {
        const res = await fetch("http://localhost:8080/api/tts/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error("TTS 요청 실패: " + res.statusText);
        const buffer = await res.arrayBuffer();
        const blob = new Blob([buffer], { type: "audio/mpeg" });
        return URL.createObjectURL(blob);
      })
    )
      .then((questionUrls) => {
        setPreloadAudio((prev) => [questionUrls, prev[1]]);
        if (!answers.length) {
          setIsPreloading(false);
          onPreloadDone && onPreloadDone();
        }
      })
      .catch((e) => {
        console.error("질문 문장 캐싱 중 에러:", e);
        setPreloadError(e.message);
        setIsPreloading(false);
      });
  }, [sentences]);

  // (2) 답변 문장 캐싱
  useEffect(() => {
    if (!answers.length) return;

    setIsPreloading(true);
    setPreloadError(null);

    Promise.all(
      answers.map(async (text) => {
        const res = await fetch("http://localhost:8080/api/tts/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error("TTS 요청 실패: " + res.statusText);
        const buffer = await res.arrayBuffer();
        const blob = new Blob([buffer], { type: "audio/mpeg" });
        return URL.createObjectURL(blob);
      })
    )
      .then((answerUrls) => {
        setPreloadAudio((prev) => [prev[0], answerUrls]);
        setIsPreloading(false);
        onPreloadDone && onPreloadDone();
      })
      .catch((e) => {
        console.error("답변 문장 캐싱 중 에러:", e);
        setPreloadError(e.message);
        setIsPreloading(false);
      });
  }, [answers]);

  // (3) 재생: 인덱스나 단계 바뀔 때
  useEffect(() => {
    if (!autoPlay) return;
    if (isPreloading) return;

    const phaseIndex = isAnsweringPhase ? 1 : 0;
    const urlList = preloadAudio[phaseIndex];
    if (!urlList || urlList.length === 0) return;
    if (currentIndex < 0 || currentIndex >= urlList.length) return;

    const urlToPlay = urlList[currentIndex];
    if (audioRef.current && urlToPlay) {
      audioRef.current.src = urlToPlay;
      audioRef.current.play().catch((e) => console.error("재생 오류:", e));
    }
  }, [currentIndex, isAnsweringPhase, preloadAudio, isPreloading, autoPlay]);

  // (4) 수동 재생용
  const playNow = () => {
    const phaseIndex = isAnsweringPhase ? 1 : 0;
    const urlList = preloadAudio[phaseIndex];
    if (!urlList || urlList.length === 0) return;
    if (currentIndex < 0 || currentIndex >= urlList.length) return;

    const urlToPlay = urlList[currentIndex];
    if (audioRef.current && urlToPlay) {
      audioRef.current.src = urlToPlay;
      audioRef.current.play().catch((e) => console.error("재생 오류:", e));
    }
  };

  // (5) 언마운트 시 Blob URL 해제
  useEffect(() => {
    return () => {
      preloadAudio.flat().forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [preloadAudio]);

  return (
    <div>
      <audio ref={audioRef} style={style} controls={!style?.display} />
      {isPreloading && (
        <p style={{ textAlign: "center", color: "#555" }}>
        </p>
      )}
      {preloadError && (
        <p style={{ textAlign: "center", color: "red" }}>
          캐싱 오류: {preloadError}
        </p>
      )}
      {!autoPlay && (
        <button onClick={playNow} style={{ marginTop: 8 }}>
          🔊 듣기
        </button>
      )}
    </div>
  );
}
