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
 *   onTtsStart: TTS 재생이 시작될 때 호출되는 콜백
 *   onTtsEnd: TTS 재생이 끝날 때 호출되는 콜백
 */
export default function TtsPlayer({
  sentences = [],
  answers = [],
  isAnsweringPhase,
  currentIndex,
  autoPlay = true,
  style = { display: "none" },
  onPreloadDone,
  onTtsStart,
  onTtsEnd,
}) {
  const audioRef = useRef(null);
  const [preloadAudio, setPreloadAudio] = useState([[], []]);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadError, setPreloadError] = useState(null);
  const preloadAudioRef = useRef([[], []]); // ref로 최신 preloadAudio 유지

  // (1) 질문 문장 캐싱
  useEffect(() => {
    if (!sentences.length) return;

    setIsPreloading(true);
    setPreloadError(null);

    Promise.all(
      sentences.map(async (text) => {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tts/text`, {
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
        // 이전 질문 URL들 정리
        preloadAudioRef.current[0].forEach((url) => {
          if (url && url.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(url);
            } catch (e) {
              console.warn('Blob URL 해제 실패 (무시):', e);
            }
          }
        });
        const newPreloadAudio = [questionUrls, preloadAudioRef.current[1]];
        preloadAudioRef.current = newPreloadAudio;
        setPreloadAudio(newPreloadAudio);
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
    if (!answers.length) {
      // answers가 비어있으면 이전 답변 URL들만 정리 (질문 URL은 유지)
      setPreloadAudio((prev) => {
        prev[1].forEach((url) => {
          if (url && url.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(url);
            } catch (e) {
              console.warn('Blob URL 해제 실패 (무시):', e);
            }
          }
        });
        return [prev[0], []];
      });
      preloadAudioRef.current = [preloadAudioRef.current[0], []];
      return;
    }

    setIsPreloading(true);
    setPreloadError(null);

    // 이전 답변 URL들 정리 (질문 URL은 유지)
    setPreloadAudio((prev) => {
      prev[1].forEach((url) => {
        if (url && url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url);
          } catch (e) {
            console.warn('Blob URL 해제 실패 (무시):', e);
          }
        }
      });
      return [prev[0], []];
    });
    preloadAudioRef.current = [preloadAudioRef.current[0], []];

    Promise.all(
      answers.map(async (text) => {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tts/text`, {
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
        // 이전 답변 URL들 정리
        preloadAudioRef.current[1].forEach((url) => {
          if (url && url.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(url);
            } catch (e) {
              console.warn('Blob URL 해제 실패 (무시):', e);
            }
          }
        });
        const newPreloadAudio = [preloadAudioRef.current[0], answerUrls];
        preloadAudioRef.current = newPreloadAudio;
        setPreloadAudio(newPreloadAudio);
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
    // ref에서 최신 preloadAudio 가져오기
    const urlList = preloadAudioRef.current[phaseIndex];
    if (!urlList || urlList.length === 0) {
      console.warn("URL 리스트가 비어있습니다:", { phaseIndex, urlList });
      return;
    }
    if (currentIndex < 0 || currentIndex >= urlList.length) {
      console.warn("currentIndex가 범위를 벗어났습니다:", { currentIndex, urlListLength: urlList.length });
      return;
    }

    const urlToPlay = urlList[currentIndex];
    if (!urlToPlay) {
      console.warn("URL이 없습니다:", { phaseIndex, currentIndex, urlListLength: urlList.length });
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    // Blob URL이 유효한지 확인 (URL이 blob:으로 시작하는지 확인)
    if (!urlToPlay.startsWith('blob:')) {
      console.error("유효하지 않은 Blob URL:", urlToPlay);
      return;
    }

    // 이전 재생 중지 및 초기화
    audio.pause();
    // src를 빈 문자열로 설정하여 이전 오디오 해제
    audio.src = "";

    // 오디오 로드 후 재생 핸들러
    let handleCanPlay = null;
    let handleError = null;
    let loadTimeout = null;

    // 약간의 지연을 두어 이전 오디오가 완전히 해제되도록 함
    loadTimeout = setTimeout(() => {
      // URL이 여전히 유효한지 다시 확인
      if (!urlToPlay || !urlToPlay.startsWith('blob:')) {
        console.error("URL이 유효하지 않음:", urlToPlay);
        return;
      }

      handleCanPlay = () => {
        audio.play().then(() => {
          // TTS 재생 시작 콜백 호출
          if (onTtsStart) {
            onTtsStart();
          }
        }).catch((e) => {
          console.error("재생 오류:", e);
          console.error("실패한 URL:", urlToPlay);
        });
        if (handleCanPlay) audio.removeEventListener("canplay", handleCanPlay);
        if (handleError) audio.removeEventListener("error", handleError);
      };

      handleError = (e) => {
        console.error("오디오 로드 오류:", e);
        console.error("실패한 URL:", urlToPlay);
        console.error("오디오 네트워크 상태:", audio.networkState);
        console.error("오디오 준비 상태:", audio.readyState);
        if (handleCanPlay) audio.removeEventListener("canplay", handleCanPlay);
        if (handleError) audio.removeEventListener("error", handleError);
      };

      audio.addEventListener("canplay", handleCanPlay, { once: true });
      audio.addEventListener("error", handleError, { once: true });

      // Blob URL 설정 및 로드
      try {
        audio.src = urlToPlay;
        audio.load();
      } catch (error) {
        console.error("오디오 src 설정 오류:", error);
        if (handleCanPlay) audio.removeEventListener("canplay", handleCanPlay);
        if (handleError) audio.removeEventListener("error", handleError);
    }
    }, 50);

    return () => {
      if (loadTimeout) clearTimeout(loadTimeout);
      if (handleCanPlay) audio.removeEventListener("canplay", handleCanPlay);
      if (handleError) audio.removeEventListener("error", handleError);
    };
  }, [currentIndex, isAnsweringPhase, isPreloading, autoPlay, onTtsStart]); // preloadAudio 제거

  // (3-1) TTS 재생 종료 감지
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      console.log("TTS 재생 완료");
      if (onTtsEnd) {
        onTtsEnd();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onTtsEnd]);

  // (4) 수동 재생용
  const playNow = () => {
    const phaseIndex = isAnsweringPhase ? 1 : 0;
    // ref에서 최신 preloadAudio 가져오기
    const urlList = preloadAudioRef.current[phaseIndex];
    if (!urlList || urlList.length === 0) return;
    if (currentIndex < 0 || currentIndex >= urlList.length) return;

    const urlToPlay = urlList[currentIndex];
    if (audioRef.current && urlToPlay) {
      audioRef.current.src = urlToPlay;
      audioRef.current.play().then(() => {
        // TTS 재생 시작 콜백 호출
        if (onTtsStart) {
          onTtsStart();
        }
      }).catch((e) => console.error("재생 오류:", e));
    }
  };

  // (5) 언마운트 시 Blob URL 해제
  useEffect(() => {
    return () => {
      preloadAudioRef.current.flat().forEach((url) => {
        if (url && url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url);
          } catch (e) {
            console.warn('Blob URL 해제 실패 (무시):', e);
          }
        }
      });
    };
  }, []); // 빈 배열로 변경하여 언마운트 시에만 실행

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
      {/* {!autoPlay && (
        <button onClick={playNow} style={{ marginTop: 8 }}>
          🔊 듣기
        </button>
      )} */}
    </div>
  );
}
