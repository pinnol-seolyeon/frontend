import styled from "styled-components";
import React, { useState, useEffect, useMemo, useRef } from "react";

import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import Button from "../../../components/Button";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { fetchFeedback, fetchChapterContents } from "../../../api/study/level3API";
import MiniHeader from "../../../components/study/MiniHeader";
import { useChapter } from "../../../context/ChapterContext";
import background from "../../../assets/study_background.png";
import hoppin from "../../../assets/hopin.svg";
import questionIcon from "../../../assets/question_icon.svg";
import TtsPlayer from "../../../components/TtsPlayer";
import api from "../../../api/login/axiosInstance";
import { useActivityTracker } from "../../../hooks/useActivityTracker";
import ladybugImage from "../../../assets/ladybug.png";
import { winBadge } from "../../../api/analyze/winBadge";


/*학습하기-3단계-1*/


// const Wrapper=styled.div`
//     width:100%;
//     height:100vh;
//     display:flex;
//     flex-direction:column;
//     align-items:center;
//     justify-content:center;
// `;

const Wrapper=styled.div`
    width:100%;
    min-height:100vh;
    height:auto;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    position: relative;
`;

const MainWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin-left: 0;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  margin-left: 2rem;
  gap: 0;
  flex: 2;
`;

const HoppinImage = styled.img`
  width: clamp(200px, 25vw, 350px);
  height: auto;
  object-fit: contain;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const ImageWithSpeechWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 1rem 0rem;
`;

const SpeechWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height: fit-content;
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.8);
    max-width: 1200px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    position:relative;
    margin-top: 0;
`;


const TextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: pre-line;

  width: 80%;
  margin: 0 auto;
  padding: 0 clamp(4vw, 6vw, 90px); 

  font-size: 20px;
  font-weight: 500;
  color: #454545;
`;

const AnswerInputBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  max-width: 600px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 12px 16px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-size: 16px;
  font-family: "Noto Sans KR", sans-serif;
  color: #333;
  background-color: #FAFAFA;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #478CEE;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(71, 140, 238, 0.1);
  }
  
  &::placeholder {
    color: #999;
    font-style: italic;
  }
`;


const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: #478CEE;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }
`;

const AiResponseBox = styled.div`
  margin-top: 16px;
  width: 80%;
  max-width: 600px;
  padding: 20px;
  background-color: #e9f1fb;
  border-left: 6px solid #2774B2;
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  font-family: "Noto Sans KR", sans-serif;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(71, 140, 238, 0.3);
  border-radius: 50%;
  border-top-color: #478CEE;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 16px;
  width: 80%;
  max-width: 600px;
  padding: 20px;
  background-color: transparent;
  font-size: 16px;
  color: #333;
`;

const QuestionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.5rem;
  background-color: #F0F4FC;
  color: #79B0FF;
  border: 1px solid #79B0FF;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s;
  align-self: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
  &:hover {
    background-color: #F5F5F5;
    border-color: #B8B8B8;
  }
  &:active {
    outline: none;
  }
`;

const QuestionIconImg = styled.img`
  width: 1rem;
  height: 1rem;
`;

const BubbleButton = styled.button`
  display:flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.6rem 5rem; 
  background-color: #478CEE;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  font-size:clamp(13px,1vw,20px);

  transition: background-color 0.3s;
  &:hover {
    background-color: #104EA7;
  }

  &:active {
    outline: none;
  }
`;

const BackButton = styled.button`
  display:flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.6rem 5rem; 
  background-color: white;
  color: #9E9E9E;
  border: 1px solid #B8B8B8;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  font-size:clamp(13px,1vw,20px);

  transition: all 0.3s;
  &:hover {
    background-color: #F5F5F5;
    border-color: #B8B8B8;
  }

  &:active {
    outline: none;
  }
`;

const ButtonWrapper=styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    width:100%;
    gap: 2rem;
`;

const AnswerButton = styled.button`
  padding: 12px 16px;
  background-color: #478CEE;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  white-space: nowrap;

  transition: background-color 0.3s;
  &:hover {
    background-color: #104EA7;
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background-color: #478CEE;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  font-family: "Noto Sans KR", sans-serif;
  white-space: nowrap;
  transition: all 0.3s ease;
  min-width: 80px;
  
  &:hover {
    background-color: #104EA7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(71, 140, 238, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(71, 140, 238, 0.2);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// 무당벌레 스타일
const Ladybug = styled.div`
    position: fixed;
    font-size: 60px;
    cursor: pointer;
    z-index: 9999;
    transition: transform 0.3s ease;
    animation: float 4s ease-in-out infinite;
    user-select: none;
    
    &:hover {
        transform: scale(1.2);
    }
    
    @keyframes float {
        0% {
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            transform: translate(var(--move-x-1, 30px), var(--move-y-1, -20px)) rotate(5deg);
        }
        50% {
            transform: translate(var(--move-x-2, -20px), var(--move-y-2, -30px)) rotate(-5deg);
        }
        75% {
            transform: translate(var(--move-x-3, 25px), var(--move-y-3, -10px)) rotate(3deg);
        }
        100% {
            transform: translate(0, 0) rotate(0deg);
        }
    }
`;

const LadybugImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;


function StudyPage({ user, login, setLogin }){

    const navigate=useNavigate();
    const location=useLocation();
    const [searchParams] = useSearchParams();
    const [sentences,setSentences]=useState([]);
    const [currentIndex,setCurrentIndex]=useState(0);
    const [answers, setAnswers] = useState([]); // AI 응답 문장 배열
    const [isAnsweringPhase, setIsAnsweringPhase] = useState(false); // AI 응답 재생 단계 여부
    const questionIndexBeforeAnswerRef = useRef(null); // AI 답변 전 원래 질문 인덱스 저장

    
    const {chapterData, setChapterData}=useChapter();
    const [questionIndexes, setQuestionIndexes] = useState([]);
    const [isFinished,setIsFinished]=useState(false);

    const [isQuestionFinished,setIsQuestionFinished]=useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [isAnswering,setIsAnswering]=useState(false);
    const [preloadDone, setPreloadDone] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recognizedText, setRecognizedText] = useState("");
    const [isVoiceRecognitionComplete, setIsVoiceRecognitionComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false); // AI 응답 로딩 상태
    const [isTtsCompleted, setIsTtsCompleted] = useState(false); // TTS 재생 완료 상태
    const recognitionRef = React.useRef(null); // 음성인식 객체를 ref로 관리
    const ttsSentences = useMemo(() => sentences, [sentences]);
    const nextContext=sentences[currentIndex+1]||"다음 학습 내용 없음";
    const returnToIndex=location.state?.returnToIndex??0;

    // 무당벌레 관련 상태
    const [ladybugs, setLadybugs] = useState([]); // [{id, x, y, createdAt}]
    const [ladybugCount, setLadybugCount] = useState(0); // 총 나타난 무당벌레 수
    const [questionClickTime, setQuestionClickTime] = useState(null); // 질문하기 클릭 시간
    const [firstLadybugTime, setFirstLadybugTime] = useState(null); // 첫 번째 무당벌레 생성 시간
    const [lastLadybugSpawnTime, setLastLadybugSpawnTime] = useState(null); // 마지막 무당벌레 생성 시간
    const [clickedLadybugs, setClickedLadybugs] = useState([]); // 클릭한 무당벌레 [{id, clickedAt}]
    const [consecutiveClicks, setConsecutiveClicks] = useState(0); // 연속 클릭 카운트
    const [lastClickTime, setLastClickTime] = useState(null); // 마지막 클릭 시간
    const [missedLadybugs, setMissedLadybugs] = useState(false); // 놓친 무당벌레 [{id, missedAt}]
    const [totalMissed, setTotalMissed] = useState(0); // 놓친 무당벌레 총 수
    const [fineHunter, setFineHunter] = useState(false);
    const [speedHunter, setSpeedHunter] = useState(true); // SPEED_HUNTER 상태 (초기값 true, 놓치거나 2초 초과 시 false)

    // 활동 감지 Hook 사용 (level 3)
    const { completeSession } = useActivityTracker(
        chapterData?.chapterId, 
        3, // level 3
        user?.userId,
        chapterData?.bookId
    );

    // 무당벌레 생성 함수
    const spawnLadybug = () => {
        if (ladybugCount >= 2) return; // 최대 1마리

        const now = Date.now();
        const id = now;
        const x = Math.random() * (window.innerWidth - 100); // 화면 너비 내 랜덤
        const y = Math.random() * (window.innerHeight - 100); // 화면 높이 내 랜덤

        // 각 무당벌레마다 랜덤한 움직임 값 생성 (자유로운 이동을 위해)
        const moveX1 = (Math.random() - 0.5) * 80; // -30 ~ 30px
        const moveY1 = (Math.random() - 0.5) * 80; // -30 ~ 30px
        const moveX2 = (Math.random() - 0.5) * 80; // -30 ~ 30px
        const moveY2 = (Math.random() - 0.5) * 80; // -30 ~ 30px
        const moveX3 = (Math.random() - 0.5) * 80; // -30 ~ 30px
        const moveY3 = (Math.random() - 0.5) * 80; // -30 ~ 30px

        // 첫 번째 무당벌레 생성 시간 기록
        if (ladybugCount === 0) {
            setFirstLadybugTime(now);
            console.log('🐞 첫 번째 무당벌레 생성 시간 기록:', now);
        }

        setLadybugs(prev => [...prev, { 
            id, 
            x, 
            y, 
            createdAt: now,
            moveX1,
            moveY1,
            moveX2,
            moveY2,
            moveX3,
            moveY3
        }]);
        const newCount = ladybugCount + 1;
        setLadybugCount(newCount);
        
        // // 마지막 무당벌레 생성 시간 기록 (3마리 모두 생성되었을 때)
        // if (newCount === 3) {
        //     setLastLadybugSpawnTime(now);
        //     console.log('🐞 마지막 무당벌레 생성 시간 기록:', now);
        // }

        // console.log('🐞 무당벌레 생성:', { id, x, y, count: ladybugCount + 1 });

        // 3초 후 자동 제거
        setTimeout(() => {
            setLadybugs(prev => prev.filter(lb => lb.id !== id));
            console.log('⏱️ 무당벌레 자동 제거 (3초 경과):', id);

            // 클릭되지 않았는지 확인 (함수형 업데이트로 최신 상태 확인)
            setClickedLadybugs(currentClicked => {
                const wasClicked = currentClicked.some(clb => clb.id === id);
                
                if (!wasClicked) {
                    // 놓친 무당벌레 기록
                    setMissedLadybugs(true);
                    setTotalMissed(prev => {
                        const newTotal = prev + 1;
                        console.log(`❌ 무당벌레 놓침! 총 놓친 개수: ${newTotal} (이전: ${prev} → 새 값: ${newTotal})`);
                        return newTotal;
                    });

                    // SPEED_HUNTER: 놓치면 바로 false
                    setSpeedHunter(false);
                    console.log('❌ SPEED_HUNTER 실패: 무당벌레를 놓침');

                    // 연속 클릭 초기화 (함수형 업데이트로 이전 값 확인 후 로그)
                    setConsecutiveClicks(prev => {
                        console.log(`❌ 연속 클릭 초기화: ${prev} → 0`);
                        return 0;
                    });

                } else {
                    console.log('✅ 무당벌레는 이미 잡혔음:', id);
                }
                
                return currentClicked; // 상태 변경 없이 반환
            });
        }, 3000);
    };

    // 무당벌레 클릭 핸들러
    const handleLadybugClick = async (id) => {
        // 질문하기 클릭 2초 이내인지 확인
        if (questionClickTime && Date.now() - questionClickTime < 2000) {
            console.log('❌ 무당벌레 클릭 무효 (질문하기 클릭 2초 이내)');
            return;
        }

        const clickTime = Date.now();
        const chapterId = searchParams.get('chapterId') || chapterData?.chapterId;

        // 클릭한 무당벌레의 생성 시간 찾기
        const clickedLadybug = ladybugs.find(lb => lb.id === id);
        if (!clickedLadybug) {
            console.log('❌ 무당벌레를 찾을 수 없음:', id);
            return;
        }

        const createdAt = clickedLadybug.createdAt;
        const timeToCatch = clickTime - createdAt; // 생성 후 잡기까지 걸린 시간

        // 연속 클릭 체크 (이전 클릭과 2초 이내면 연속으로 간주)
        // let newConsecutiveClicks = 1;
        // if (lastClickTime && clickTime - lastClickTime < 2000) {
        //     newConsecutiveClicks = consecutiveClicks + 1;
        // }
        
        // 클릭한 무당벌레 기록 (생성 시간과 클릭 시간 모두 저장)
        const newClickedLadybugs = [...clickedLadybugs, { 
            id, 
            clickedAt: clickTime,
            createdAt: createdAt,
            timeToCatch: timeToCatch
        }];
        const totalClicked = newClickedLadybugs.length;

        // 상태 업데이트
        setClickedLadybugs(newClickedLadybugs);
        setConsecutiveClicks(prev => {
            const newCount = prev + 1;
            console.log('무당벌레 잡음, 연속 :', newCount);
            
            // 연속 3마리 잡으면 FINE_HUNTER 획득
            if (newCount === 3) {
                setFineHunter(true);
                console.log('🏆 FINE_HUNTER 조건 만족! (연속 3마리 잡음)');
            }
            
            return newCount;
        });
        
        // SPEED_HUNTER 체크: 2초 내에 잡았는지 확인
        // 2초 초과하면 false, 2초 이내면 현재 상태 유지 (이미 false면 false 유지)
        setSpeedHunter(prev => {
            if (timeToCatch > 2000) {
                console.log(`❌ SPEED_HUNTER 실패: ${timeToCatch}ms (2초 초과)`);
                return false; // 2초 초과하면 false
            } else {
                // 2초 이내에 잡았지만, 이전에 이미 false면 false 유지
                if (prev) {
                    console.log(`✅ SPEED_HUNTER 유지: ${timeToCatch}ms (2초 이내)`);
                } else {
                    console.log(`⚠️ SPEED_HUNTER: ${timeToCatch}ms (2초 이내)지만 이전에 실패하여 false 유지`);
                }
                return prev; // 이전 상태 유지 (false면 false, true면 true)
            }
        });
        
        setLastClickTime(clickTime);

        // 무당벌레 제거
        setLadybugs(prev => prev.filter(lb => lb.id !== id));
        console.log('✅ 무당벌레 클릭 제거:', id, `생성 후 ${timeToCatch}ms 만에 잡음, 연속 ${consecutiveClicks}마리 클릭, ${missedLadybugs}놓침`);

        // 뱃지 체크는 학습 종료 시점에 수행 (API 호출은 하지 않음)
        console.log('✅ 무당벌레 클릭 기록:', {
            id,
            timeToCatch,
            consecutiveClicks,
            clickedLadybugs: newClickedLadybugs.length
        });
    };

    // 상태 변화 추적 (디버깅용 - 언제 반영되는지 확인)
    useEffect(() => {
        console.log('📊 consecutiveClicks 상태 업데이트됨:', consecutiveClicks);
    }, [consecutiveClicks]);

    useEffect(() => {
        console.log('📊 totalMissed 상태 업데이트됨:', totalMissed);
    }, [totalMissed]);

    useEffect(() => {
        console.log('📊 missedLadybugs 상태 업데이트됨:', missedLadybugs);
    }, [missedLadybugs]);

    // 무당벌레가 모두 사라지면 생성 관련 상태만 리셋 (클릭 기록은 유지)
    useEffect(() => {
        if (ladybugs.length === 0 && ladybugCount >= 2) {
            console.log('🔄 무당벌레 생성 상태 리셋 (클릭 기록은 유지)');
            setLadybugCount(0);
            setFirstLadybugTime(null);
            setLastLadybugSpawnTime(null);
            // clickedLadybugs는 리셋하지 않음 - 누적 기록 유지
            // consecutiveClicks와 lastClickTime도 리셋하지 않음 - 다음 세트에서도 연속 클릭 체크 가능
        }
    }, [ladybugs.length, ladybugCount]);

    // 무당벌레 랜덤 생성 (10~30초마다) - 최대 1마리
    useEffect(() => {
        if (ladybugCount >= 3 || loading) return;

        const randomDelay = Math.random() * 20000 + 10000; // 10~30초
        console.log(`⏰ 다음 무당벌레 생성까지: ${Math.floor(randomDelay / 1000)}초`);

        const timer = setTimeout(() => {
            spawnLadybug();
        }, randomDelay);

        return () => clearTimeout(timer);
    }, [ladybugCount, loading, ladybugs.length]);

   const navigateToQuestion=()=>{
        // 질문하기 클릭 시간 기록
        setQuestionClickTime(Date.now());
        
        // URL에서 직접 chapterId 가져오기 (chapterData보다 더 신뢰할 수 있음)
        const chapterId = searchParams.get('chapterId') || chapterData?.chapterId;
        
        console.log("🔀 질문하기로 이동 - 전달 데이터:", {
            returnToIndex: currentIndex,
            from: "/study/level3",
            chapterId: chapterId,
            fromURL: searchParams.get('chapterId'),
            fromContext: chapterData?.chapterId
        });
        
        if (!chapterId) {
            console.error('⚠️⚠️⚠️ chapterId를 찾을 수 없습니다!');
            alert('오류가 발생했습니다. chapterId를 찾을 수 없습니다.');
            return;
        }
        
        navigate("/question",{
            state:{
                returnToIndex:currentIndex,
                from: "/study/level3",
                chapterId: chapterId
            }
        });
   }

   // Level 3 데이터 가져오기
   useEffect(() => {
        const loadLevel3Data = async () => {
            const chapterId = searchParams.get('chapterId') || chapterData?.chapterId;
            
            if (!chapterId) {
                console.error("❌ chapterId가 없습니다.");
                setSentences(["❌ 단원 정보가 없습니다. 다시 돌아가주세요."]);
                return;
            }

            try {
                setLoading(true);
                console.log("🔄 Level 3 데이터 로딩 중... chapterId:", chapterId, "bookId:", chapterData?.bookId);
                const level3Data = await fetchChapterContents(3, chapterId, chapterData?.bookId);
                console.log("✅ Level 3 데이터:", level3Data);
                
                // Context 업데이트 (bookId 보존)
                setChapterData({
                    ...level3Data,
                    bookId: chapterData?.bookId
                });
                
                const contents = level3Data?.content;
                
                if (contents) {
                    console.log("✅ Chapter content:", contents);
                    
                    //문장 분리 (\n 기준으로만 분리)
                    const splitSentences = contents
                        .split(/\n/)  // \n 기준으로만 분리
                        .filter((s) => s.trim() !== ""); //공백만 있는 문장 등을 제거
                    
                    console.log("🐋분할된 최종 문장 배열:",splitSentences);

                    //질문 감지 함수
                    const isQuestion = (s) => s.includes("?");

                    //질문이 포함된 문장의 인덱스만 추출
                    const questionIndexes=splitSentences
                        .map((s,i)=>isQuestion(s)?i:null)
                        .filter((i)=>i!=null);
                    console.log("🧠 질문 문장 인덱스:", questionIndexes);

                    setSentences(splitSentences);
                    setQuestionIndexes(questionIndexes);
                } else {
                    setSentences(["❌ 내용이 없습니다."]);
                }
            } catch (error) {
                console.error("❌ Level 3 데이터 로딩 실패:", error);
                setSentences(["❌ 내용을 불러오는데 실패했습니다. 다시 시도해주세요."]);
            } finally {
                setLoading(false);
            }
        };

        loadLevel3Data();
    }, [searchParams]);


    //질문 버튼 누른 후 다시 학습하기 3단계로 돌아온 경우 포함
    useEffect(()=>{
        console.log("🐛returnToIndex",returnToIndex);
        setCurrentIndex(returnToIndex);
        setIsTtsCompleted(false); // TTS 완료 상태 초기화
    },[]); //의존성 배열이 비어 있어야 컴포넌트 최초 마운트 시 한 번만 실행

    // currentIndex가 변경될 때마다 TTS 완료 상태 초기화
    useEffect(() => {
        setIsTtsCompleted(false);
    }, [currentIndex]);



    //질문 문장인 경우 -> 사용자 입력 UI 노출 + 답변 수집
    //질문이 끝나면 답변 버튼이 생성되도록 함 
    const goToNextSentence = async () => {
    if (!preloadDone) return;
    
    // AI 응답 재생 단계인 경우
    if (isAnsweringPhase) {
        if (currentIndex < answers.length - 1) {
            console.log("✅ AI 응답 다음 문장:", currentIndex + 1);
            setIsTtsCompleted(false); // TTS 완료 상태 초기화
            setCurrentIndex(currentIndex + 1);
        } else {
            // AI 응답 + 이후 컨텐츠 재생 완료 - 질문 단계로 돌아감
            console.log("✅ AI 응답 및 이후 컨텐츠 재생 완료");
            setAiResponse("");
            setIsTtsCompleted(false);
            
            // 저장된 원래 질문 인덱스 다음의 일반 문장으로 이동
            const originalQuestionIndex = questionIndexBeforeAnswerRef.current;
            if (originalQuestionIndex !== null && originalQuestionIndex !== undefined) {
                // 질문 다음의 첫 번째 일반 문장 인덱스 계산
                const nextContentIndex = originalQuestionIndex + 1;
                console.log("✅ 질문 다음 컨텐츠로 이동:", nextContentIndex, "(원래 질문 인덱스:", originalQuestionIndex + ")");
                
                // 다음 질문 인덱스 찾기
                const nextQuestionIndex = questionIndexes.find(idx => idx > originalQuestionIndex);
                const endIndex = nextQuestionIndex !== undefined ? nextQuestionIndex : sentences.length;
                
                // 이미 재생한 컨텐츠를 건너뛰고 다음 위치로 이동
                if (endIndex < sentences.length) {
                    // 다음 질문이 있으면 그 질문으로 이동
                    setCurrentIndex(endIndex);
                } else {
                    // 다음 질문이 없으면 마지막 문장으로 이동
                    setCurrentIndex(sentences.length - 1);
                }
                
                // 질문 단계로 돌아가기
                setIsAnsweringPhase(false);
                setAnswers([]);
                questionIndexBeforeAnswerRef.current = null; // ref 초기화
            } else {
                // 저장된 인덱스가 없으면 다음 질문으로 이동
                const questionIdx = questionIndexes.find(idx => idx > currentIndex) || questionIndexes[questionIndexes.length - 1];
                if (questionIdx !== undefined) {
                    setIsAnsweringPhase(false);
                    setAnswers([]);
                    setCurrentIndex(questionIdx);
                } else {
                    // 다음 질문이 없으면 그냥 단계만 변경
                    setIsAnsweringPhase(false);
                    setAnswers([]);
                }
            }
        }
        return;
    }
    
    // 모든 문장을 다 본 후에 완료
    console.log("🔍 goToNextSentence 체크:", { currentIndex, sentencesLength: sentences.length, isLast: currentIndex >= sentences.length - 1 });
    
    if (currentIndex < sentences.length - 1){
        console.log("✅currentIndex:",currentIndex, "/", sentences.length - 1, "- 다음 문장으로 이동");
        setIsTtsCompleted(false); // TTS 완료 상태 초기화
        setCurrentIndex(currentIndex+1);
    } else {
        // 마지막 문장까지 모두 본 경우 (currentIndex === sentences.length - 1)
        console.log("✅ 모든 문장 완료, 다음 단계로 이동", { currentIndex, sentencesLength: sentences.length });
        setIsQuestionFinished(true); //질문 끝났다는 상태
        setIsFinished(true);
        setIsTtsCompleted(true); // TTS 완료 상태 설정
        
        // 즉시 다음 단계로 이동 (비동기 처리)
        (async () => {
        
        // Level 3 완료 시 질문/답변 저장 API 호출
        const chapterId = searchParams.get('chapterId') || chapterData?.chapterId;
        if (chapterId) {
            try {
                console.log("💾 질문/답변 저장 API 호출 시작 - chapterId:", chapterId);
                const response = await api.post(`/api/question/save-all`, null, {
                    params: {
                        chapterId: chapterId
                    }
                });
                console.log("✅ 질문/답변 저장 성공:", response.data);
                
                // sessionStorage에서 해당 chapterId의 질문 데이터 삭제 (선택적)
                try {
                    const storageKey = `questionData_${chapterId}`;
                    sessionStorage.removeItem(storageKey);
                    console.log("🧹 sessionStorage 질문 데이터 삭제 완료");
                } catch (error) {
                    console.error("⚠️ sessionStorage 삭제 실패 (무시):", error);
                }
            } catch (error) {
                console.error("❌ 질문/답변 저장 API 호출 실패:", error);
                // 에러가 발생해도 학습 완료는 진행 (사용자 경험을 위해)
            }
        } else {
            console.error("⚠️ chapterId가 없어서 질문/답변 저장 API를 호출할 수 없습니다.");
        }
        
        // 무당벌레 뱃지 체크 및 API 호출
        if (chapterId) {
            const badgesToWin = [];
            
            console.log('🔍 학습 종료 시 무당벌레 뱃지 체크:', {
                chapterId,
                clickedLadybugs: clickedLadybugs.length,
                speedHunter,
                fineHunter
            });

            // SPEED_HUNTER: 실시간으로 체크한 결과 사용
            if (speedHunter) {
                badgesToWin.push('SPEED_HUNTER');
                console.log('🏆 SPEED_HUNTER 뱃지 획득 조건 만족! (모든 무당벌레를 2초 이내에 잡음)');
            } else {
                console.log('❌ SPEED_HUNTER 조건 불만족: 무당벌레를 놓치거나 2초 초과');
            }

            // FINE_HUNTER: 연속 3마리 잡았는지 확인
            if (fineHunter) {
                badgesToWin.push('FINE_HUNTER');
                console.log('🏆 FINE_HUNTER 뱃지 획득 조건 만족! (연속 3마리 잡음)');
            } else {
                console.log('❌ FINE_HUNTER 조건 불만족: 연속 3마리를 잡지 않음');
            }

            // 뱃지 획득 API 호출
            if (badgesToWin.length > 0) {
                try {
                    console.log('📡 학습 종료 시 뱃지 API 호출 시작:', { chapterId, badgesToWin });
                    await winBadge(chapterId, badgesToWin);
                    console.log('✅ 뱃지 획득 성공:', badgesToWin);
                } catch (error) {
                    console.error('❌ 뱃지 획득 실패:', error);
                    console.error('❌ 에러 상세:', error.response?.data || error.message);
                }
            } else {
                console.log('⚠️ 획득할 뱃지가 없어 API 호출하지 않음');
            }
        }
        
            alert("✅학습을 모두 완료했어요! 게임 단계로 이동해볼까요?")
            await completeSession(); // Level 3 완료 상태 전송
            
            // 학습 완료 시 적절한 게임 선택
            const finalChapterId = searchParams.get('chapterId') || chapterData?.chapterId;
            const { getGameForChapter } = await import('../../../utils/gameSelector');
            const gamePath = getGameForChapter(finalChapterId, 'study');
            navigate(gamePath);
        })();
    }
   };



   //AI로부터 답변 받기.. 
   const handleUserSubmit = async () => {
        // 실제로는 여기에 AI 호출 로직이 들어감 (예: fetch("/chat", { method: POST ... }))
        console.log("🙋 유저 입력:", userAnswer);
        if(!userAnswer||userAnswer.trim()===""){
            alert("🚨답변을 입력해주세요!")
            return; //함수 실행 중단 
        }

        // 로딩 시작
        setIsAiLoading(true);
        setAiResponse("");

        try {
            // 다른 API 요청과 동일한 패턴으로 시도
            const feedback=await handleFeedback();
            console.log("✅AI피드백:",feedback.result)
            
            const fullResponse = feedback.result;
            setAiResponse(fullResponse);
            
            // AI 응답을 문장부호(.,!) 단위로 분리
            const splitAnswers = fullResponse
                .split(/(?<=[.,!])\s+/)
                .filter((s) => s.trim() !== "");
            
            // 문장이 너무 길 경우 추가 분리 (예: 100자 이상)
            const finalAnswers = splitAnswers.flatMap(sentence => {
                if (sentence.length > 100) {
                    // 긴 문장은 추가로 분리
                    return sentence.split(/(?<=[.?!])\s+/).filter((s) => s.trim() !== "");
                }
                return [sentence];
            });
            
            // AI 답변 전 원래 질문 인덱스 저장
            questionIndexBeforeAnswerRef.current = currentIndex;
            
            // AI 답변 이후 재생할 컨텐츠 문장들을 미리 추가
            const nextContentIndex = currentIndex + 1;
            const contentAfterAnswer = [];
            
            // 질문 다음부터 다음 질문 전까지의 문장들을 추가
            if (nextContentIndex < sentences.length) {
                const nextQuestionIndex = questionIndexes.find(idx => idx > currentIndex);
                const endIndex = nextQuestionIndex !== undefined ? nextQuestionIndex : sentences.length;
                
                for (let i = nextContentIndex; i < endIndex; i++) {
                    // 질문이 아닌 일반 문장만 추가
                    if (!questionIndexes.includes(i)) {
                        contentAfterAnswer.push(sentences[i]);
                    }
                }
            }
            
            // AI 답변 + 이후 컨텐츠를 하나의 배열로 합치기
            const allAnswers = [...finalAnswers, ...contentAfterAnswer];
            
            setAnswers(allAnswers);
            setIsAnsweringPhase(true);
            setCurrentIndex(0); // AI 응답은 항상 0부터 시작
            setIsTtsCompleted(false); // TTS 완료 상태 초기화
        } catch (error) {
            console.error("❌ AI 응답 처리 실패:", error);
            const errorResponse = "응답을 받아오는 중 오류가 발생했습니다.";
            setAiResponse(errorResponse);
            setAnswers([errorResponse]);
            setIsAnsweringPhase(true);
            setCurrentIndex(0);
            setIsTtsCompleted(false);
        } finally {
            // 로딩 종료
            setIsAiLoading(false);
            setIsAnswering(false);
            setIsVoiceRecognitionComplete(false);
            setRecognizedText("");
            setUserAnswer("");
        }
    };

    const handleFeedback=async()=>{
                try{
                    console.log("🔍 AI 반응 요청 시작 - 현재 인덱스:", currentIndex);
                    console.log("🔍 질문:", sentences[currentIndex]);
                    console.log("🔍 사용자 답변:", userAnswer);
                    console.log("🔍 브라우저 쿠키:", document.cookie); // 쿠키 확인
                    
                    const requestBody = {
                        quiz: sentences[currentIndex], // 질문
                        userAnswer: userAnswer, // 사용자 답변
                    };
                    
                    console.log("🔍 요청 본문:", requestBody);
                    
                    const res=await api.post('/api/study/ai/content-chat', requestBody);

                    console.log("📡 응답 상태:", res.status, res.statusText);
                    console.log("✅AI 반응:", res.data);
                    
                    // 응답 구조: { message, status, data: { conversation_id, result } }
                    return { result: res.data?.data?.result || res.data?.result || "응답을 받아오지 못했습니다." };
                }catch(e){
                    console.error("❌AI 반응 요청 실패:", e);
                    console.error("🔍 에러 응답:", e.response);
                    console.error("🔍 에러 상태:", e.response?.status);
                    console.error("🔍 에러 데이터:", e.response?.data);
                    
                    return{result:"😟오류 발생: " + (e.response?.data?.message || e.message)};
                }
            };
        
    const handleNavigate=async()=>{
        navigate('/game');
    }

   //다음 문장으로 넘어가도록 함함
   const handleNext=async()=>{
    // 기존 코드: 모든 문장을 다 본 후에 /game으로 이동
    // if (currentIndex<sentences.length-1){
    //     setCurrentIndex(currentIndex+1);
    // }else{
    //     //여태까지 질문한 내용들을 DB에 저장하는 API
    //     try{
    //         const response=await api.post(`/api/question/saveAll?chapterId=${chapterData?.chapterId}`);
    //         console.log("🐯 질문/답변 저장 성공");
    //     }catch(e){
    //         console.log("❌ 저장 중 오류 발생",e);
    //     }
    //     //피드백 저장
    //     await saveFeedbacks(chapterData?.chapterId);
    //     navigate("/game")
    // }

    // 수정된 코드: 2-3개 문장만 보고 바로 /game으로 이동
    if (currentIndex < 2) { // 0, 1 인덱스까지만 (즉, 처음 2-3개 문장)
        setCurrentIndex(currentIndex + 1);
    } else {
        //여태까지 질문한 내용들을 DB에 저장하는 API
        try{
            const response=await api.post(`/api/question/saveAll?chapterId=${chapterData?.chapterId}`);
            console.log("🐯 질문/답변 저장 성공");
        }catch(e){
            console.log("❌ 저장 중 오류 발생",e);
        }

        //피드백 저장
        await saveFeedbacks(chapterData?.chapterId);
        navigate("/game")
    }
   };

   async function saveFeedbacks(chapterId){
    try{
        const response=await api.post(`/api/study/feedback/saveAll?chapterId=${chapterId}`);
        console.log("✅피드백 저장 성공:", response.data);
    }catch(e){
        console.error("❌피드백들을 전부 저장하는 데 실패했어요.", e);
        throw e;
    }
   }
    // 음성인식 시작/종료 함수
    const handleVoiceRecognition = () => {
        if (!isRecording) {
            startVoiceRecognition();
        } else {
            stopVoiceRecognition();
        }
    };

    const startVoiceRecognition = () => {
     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
         const recognition = new SpeechRecognition();
         
         // recognition 객체를 ref에 저장
         recognitionRef.current = recognition;
         
         recognition.lang = 'ko-KR';
         recognition.continuous = false;
         recognition.interimResults = false;
         
         recognition.onstart = () => {
             setIsRecording(true);
             console.log('음성인식 시작');
         };
         
         recognition.onresult = (event) => {
             const transcript = event.results[0][0].transcript;
             setRecognizedText(transcript);
             setUserAnswer(transcript);
             console.log('인식된 텍스트:', transcript);
         };
         
         recognition.onend = () => {
             setIsRecording(false);
             setIsVoiceRecognitionComplete(true);
             recognitionRef.current = null; // 종료 시 ref 초기화
             console.log('음성인식 종료');
         };
         
         recognition.onerror = (event) => {
             console.error('음성인식 오류:', event.error);
             setIsRecording(false);
             recognitionRef.current = null; // 에러 시 ref 초기화
             alert('음성인식에 실패했습니다. 다시 시도해주세요.');
         };
         
         recognition.start();
     } else {
         alert('이 브라우저는 음성인식을 지원하지 않습니다.');
     }
};

// 음성인식 종료
const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop(); // 음성인식 중지
        recognitionRef.current = null;
    }
    setIsRecording(false);
    setIsVoiceRecognitionComplete(true);
    console.log('음성인식 수동 중지');
};



    return(
    <>
        {/* 무당벌레 렌더링 */}
        {ladybugs.map(ladybug => (
            <Ladybug
                key={ladybug.id}
                style={{
                    left: `${ladybug.x}px`,
                    top: `${ladybug.y}px`,
                    ['--move-x-1']: `${ladybug.moveX1 || 30}px`,
                    ['--move-y-1']: `${ladybug.moveY1 || -20}px`,
                    ['--move-x-2']: `${ladybug.moveX2 || -20}px`,
                    ['--move-y-2']: `${ladybug.moveY2 || -30}px`,
                    ['--move-x-3']: `${ladybug.moveX3 || 25}px`,
                    ['--move-y-3']: `${ladybug.moveY3 || -10}px`,
                }}
                onClick={() => handleLadybugClick(ladybug.id)}
            >
                <LadybugImage src={ladybugImage} alt="무당벌레" />
            </Ladybug>
        ))}
        
        <Wrapper> 
                <MainWrapper>
                {/* <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={
                    isFinished?(
                        <Button
                        onClick={handleNext}
                        >다음 단계로</Button>
                    ):(
                        <Button disabled>진행 중..</Button> 
                    )
                    }
                >
                3/6 선생님과 학습하기
                </MiniHeader> */}
            <ImageWithSpeechWrapper>
              <ContentContainer>
                <LeftSection>
                  <HoppinImage src={hoppin} alt="호핀" />
                </LeftSection>

                <RightSection>
                  <QuestionButton onClick={navigateToQuestion}>
                        <QuestionIconImg src={questionIcon} alt="질문 아이콘" />
                        질문하기
                    </QuestionButton>
                </RightSection>
              </ContentContainer>

              <TtsPlayer
                sentences={ttsSentences}     // useMemo로 감싼 배열
                answers={answers}             // AI 응답 문장 배열
                isAnsweringPhase={isAnsweringPhase}  // AI 응답 재생 단계 여부
                currentIndex={currentIndex}  // 현재 읽을 인덱스
                autoPlay={!isFinished}  // isFinished가 true면 자동 재생 중지
                style={{ display: "none" }}
                onPreloadDone={() => setPreloadDone(true)}  // 캐싱 끝나면 true
                onTtsEnd={() => setIsTtsCompleted(true)}  // TTS 재생 완료 시 호출
            />
            
            {!preloadDone ? (
                <SpeechBubble>
                    <TextBox>화면을 준비 중입니다...</TextBox>
                </SpeechBubble>
                ) : !isAnswering ? (
                    <>
                    <SpeechWrapper>
                    <SpeechBubble>
                        
                         <TextBox>
                            {/* ✅ 응답이 있으면 응답만 표시, 로딩 중이면 스피너 표시 */}
                            {isAiLoading ? (
                            <LoadingContainer>
                                <LoadingSpinner />
                                <span>AI가 답변을 생각하고 있어요...</span>
                            </LoadingContainer>
                            ) : isAnsweringPhase && answers.length > 0 ? (
                            <div>
                                 {answers[currentIndex] || ""}
                            </div>
                            ) : aiResponse ? (
                            <div>
                                 {aiResponse}
                            </div>
                            ) : (
                            <div>
                                {sentences.length > 0 ? sentences[currentIndex] : "❌"}
                            </div>
                            )}
                        </TextBox>

                        

                            {/*일반 문장 or 질문+답변 완료 시에만 next 버튼 표시 (질문이고 답변 없을 때는 제외) */}
                            {(!questionIndexes.includes(currentIndex) || (isAnsweringPhase && answers.length > 0)) && isTtsCompleted && (
                                <ButtonWrapper>
                                    {((isAnsweringPhase && currentIndex > 0) || (!isAnsweringPhase && currentIndex > 0)) && (
                                        <BackButton onClick={()=>{
                                            if (isAnsweringPhase) {
                                                setCurrentIndex(Math.max(0, currentIndex - 1));
                                            } else {
                                                setCurrentIndex(currentIndex - 1);
                                                setAiResponse(""); //이전 문장으로 갈 때 aiResponse초기화
                                            }
                                            setIsTtsCompleted(false); // TTS 완료 상태 초기화
                                        }}>
                                            이전
                                        </BackButton>
                                    )}
                                    <BubbleButton onClick={()=>{
                                        if (!isAnsweringPhase) {
                                            setAiResponse(""); //다음 문장 넘어갈 때 aiResponse초기화
                                        }
                                        setIsTtsCompleted(false); // TTS 완료 상태 초기화
                                        goToNextSentence();
                                    }}>
                                        다음
                                    </BubbleButton>
                                </ButtonWrapper>
                            )}
                    

                    {/* ✅ 질문이고 아직 대답 전일 경우만 버튼 표시 (TTS 완료 후 활성화) */}
                    {questionIndexes.includes(currentIndex) && !aiResponse && isTtsCompleted && (
                        !isVoiceRecognitionComplete ? (
                            <AnswerButton onClick={handleVoiceRecognition}>
                                {isRecording ? "음성인식 중..." : "대답하기"}
                            </AnswerButton>
                        ) : (
                            <AnswerInputBox>
                                <Input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="인식된 답변을 확인하고 수정하세요"
                                />
                                <SendButton onClick={handleUserSubmit}>보내기</SendButton>
                            </AnswerInputBox>
                        )
                    )}
                    </SpeechBubble>

                    </SpeechWrapper>
                    </>
                ):(
                    //isAnswering===true일 때 사용자 입력 UI 표시
                    <AnswerInputBox>
                        <Input
                            type="text"
                            onChange={(e)=>setUserAnswer(e.target.value)}
                            placeholder="너의 생각을 입력해봐"
                        />
                        <SubmitButton onClick={handleUserSubmit}>답변하기</SubmitButton>
                        {isAiLoading ? (
                            <LoadingContainer>
                                <LoadingSpinner />
                                <span>AI가 답변을 생각하고 있어요...</span>
                            </LoadingContainer>
                        ) : aiResponse && <AiResponseBox>{aiResponse}</AiResponseBox>}
                    </AnswerInputBox>
                )}
               </ImageWithSpeechWrapper>
                    
                </MainWrapper>
        </Wrapper>
    </>
    );
}

export default StudyPage;