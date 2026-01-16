import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-pencil.png";
import Button from "../../../components/Button";
import { fetchChapterContents, fetchChapters} from "../../../api/study/level3API";
import { fetchChapterTitle } from "../../../api/study/level1API";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {useParams} from "react-router-dom";
import MiniHeader from "../../../components/study/MiniHeader";
import {useChapter} from "../../../context/ChapterContext";
import TtsPlayer from "../../../components/TtsPlayer";
import background from "../../../assets/study_background.png";
import hoppin from "../../../assets/hoppin_normal.png";
import { useActivityTracker } from "../../../hooks/useActivityTracker";
import api from "../../../api/login/axiosInstance";
// 동영상으로 대체하는 부분 (주석처리)
// import hoppinVideo from "../../../assets/hoppin_video/hoppin_hello1-1.mp4";
// import hoppinTalkVideo from "../../../assets/hoppin_video/hoppin_talk.mp4";
import hoppin_laugh from "../../../assets/hoppin_oh.png";
import hoppin_moving from "../../../assets/hoppin_moving.gif";

/*학습하기-1단계-1*/
const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 0;
  padding: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const MainWrapper = styled.div` 
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ImageWrapper=styled.div`
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    width: 40%; /* 고정된 컨테이너 너비 */
    height: 50vh; /* 고정된 컨테이너 높이 */
    min-height: 400px; /* 최소 높이 보장 */
    max-height: 600px; /* 최대 높이 제한 */
    
    /* 반응형: 작은 화면에서는 비율 유지하며 축소 */
    @media (max-width: 768px) {
        width: 350px;
        height: 420px;
    }
    
    @media (max-width: 480px) {
        width: 280px;
        height: 336px;
    }
`

const Image=styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain; /* 이미지의 원본 비율을 유지하면서 컨테이너에 맞춤 */
    display: block;
`;

const Video=styled.video`
    display:flex;
    height:auto;
    object-fit:contain; /*영상의 원본 비율을 유지 -> 영상 전체가 보이도록 안 잘리게 */
    width: 50%;
    display:block;
    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    align-self:center;/*가로 중앙 정렬*/
`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height: fit-content;
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    justify-content: center; /* 수평 중앙 */
    align-items: center;     /* 수직 중앙 */
    flex-direction: column;
    gap: 1rem;
    position:relative;

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

// 토스트 메시지 스타일
const Toast = styled.div`
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    color: #454545;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-size: 16px;
    font-weight: 500;
    max-width: 90%;
    text-align: center;
    line-height: 1.5;
    animation: slideDown 0.3s ease-out;
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;

function StudyPage({ user, login, setLogin }){

    const navigate=useNavigate();
    const {chapterId}=useParams();
    const [titleText,setTitleText]=useState("");
    const [title,setTitle]=useState("");
    const [onlyText,setOnlyText]=useState("");
    const [loading,setLoading]=useState(true);
    const [step,setStep]=useState(0); //0이면 인사, 1이면 제목 출력
    const {chapterData}=useChapter();
    const [isFinished,setIsFinished]=useState(false);
    const [showToast, setShowToast] = useState(true); // 토스트 표시 여부
    const [isFirstChapter, setIsFirstChapter] = useState(false); // 첫 번째 챕터인지 여부
    const [isTtsPlaying, setIsTtsPlaying] = useState(false); // TTS 재생 중인지 여부
    const [currentCharacterImage, setCurrentCharacterImage] = useState(hoppin); // 현재 표시할 캐릭터 이미지
    const animationIntervalRef = useRef(null); // 애니메이션 interval ref
    // 동영상으로 대체하는 부분 (주석처리)
    // const videoRef = useRef(null); // 영상 ref
    const hasPlayedTtsRef = useRef(false); // TTS가 이미 재생되었는지 추적
    const textToReadRef = useRef(""); // 현재 재생 중인 텍스트 추적
    
    // chapterData 디버깅
    console.log('📚 StudyPage1 - chapterData:', {
        chapterId: chapterData?.chapterId,
        bookId: chapterData?.bookId,
        fullData: chapterData
    });
    
    // 챕터 리스트 가져오기 (첫 번째 챕터 확인용)
    useEffect(() => {
        if (!chapterData?.bookId || !chapterData?.chapterId) return;
        
        const loadChapters = async () => {
            try {
                const data = await fetchChapters(chapterData.bookId);
                console.log("🔍 챕터 리스트 데이터:", data);
                
                // API 응답 구조: data.data.chapterList.content[0].chapterId
                if (data && data.data && data.data.chapterList && Array.isArray(data.data.chapterList.content)) {
                    const chapters = data.data.chapterList.content;
                    if (chapters.length > 0) {
                        const firstChapterId = chapters[0].chapterId;
                        const currentChapterId = chapterData.chapterId;
                        const isFirst = firstChapterId === currentChapterId || String(firstChapterId) === String(currentChapterId);
                        setIsFirstChapter(isFirst);
                        console.log('📖 첫 번째 챕터 확인:', { firstChapterId, currentChapterId, isFirst });
                    }
                }
            } catch (err) {
                console.log("❌ 챕터 리스트 조회 실패:", err);
            }
        };
        
        loadChapters();
    }, [chapterData?.bookId, chapterData?.chapterId]);
    
    // 활동 감지 Hook 사용 (level 1)
    const { completeSession } = useActivityTracker(
        chapterData?.chapterId, 
        1, // level 1
        user?.userId, // userId 전달
        chapterData?.bookId // bookId 전달
    );

    const fullTitle="";
    const [preloadDone, setPreloadDone] = useState(false);
    const [isTtsCompleted, setIsTtsCompleted] = useState(false); // TTS 재생 완료 상태

    //토스트 메시지 자동 숨김 (5초 후)
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 5000); // 5초 후 사라짐
            
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // useEffect(()=>{
    //     const loadChapterTitle=async()=>{
    //         try{
    //             if(chapterData?.chapterTitle){
    //                 const fullTitle=chapterData.chapterTitle;
    //                 setTitle(fullTitle);
    //             }

    //             //텍스트만 추출
    //             const match = fullTitle.match(/^\d+\.(.+)$/);
    //             const onlyText=match?match[1]:"";
    //             setTitleText(onlyText);
                
    //         }catch(err){
    //             setTitle("⚠️단원명 로딩실패")
    //             setTitleText("");
    //         }finally{
    //             setLoading(false);
    //             setPreloadDone(false);
    //         }
    //     };

    //     loadChapterTitle();
    // },[chapterId,chapterData]);
    useEffect(() => {
    const loadChapterTitle = async () => {
        try {
        // 1) fullTitle을 밖에서 선언
        const fullTitle = chapterData?.chapterTitle || "";

        // 2) 제목 원문 저장
        setTitle(fullTitle);

        // 3) 숫자·점 제거 후 순수 텍스트만 추출
        const match = fullTitle.match(/^\d+\.(.+)$/);
        const onlyText=match?match[1]:"";
        setTitleText(onlyText);
        } catch (err) {
        setTitle("⚠️단원명 로딩실패");
        setTitleText("");
        } finally {
        setLoading(false);
        setPreloadDone(false);
        }
    };
        loadChapterTitle();
    
    }, [chapterData]);


    const handleNext = async () => {
        if (step===0){
            setStep(1);
            setPreloadDone(false);
            setIsTtsCompleted(false); // TTS 완료 상태 초기화
            setIsTtsPlaying(false); // TTS 재생 상태 초기화
            setCurrentCharacterImage(hoppin); // hoppin으로 초기화
            // 애니메이션 정지
            if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
                animationIntervalRef.current = null;
            }
            // 동영상으로 대체하는 부분 (주석처리)
            // if (videoRef.current) {
            //     videoRef.current.pause();
            //     videoRef.current.currentTime = 0;
            // }
        }else{
            await completeSession(); // Level 1 완료 상태 전송
            navigate(`/study/2?chapterId=${chapterData?.chapterId}`);
            setIsFinished(true);
        }
    }

    const handleBack=()=>{

        setIsTtsPlaying(false);
        setCurrentCharacterImage(hoppin); // hoppin으로 초기화
        // 애니메이션 정지
        if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
        }
        hasPlayedTtsRef.current = false; // TTS 재생 플래그 초기화
        // 동영상으로 대체하는 부분 (주석처리)
        // if (videoRef.current) {
        //     videoRef.current.pause();
        //     videoRef.current.currentTime = 0;
        // }
        
        if (step===1){
            setStep(0);
            setPreloadDone(false);
            setIsTtsCompleted(false); // TTS 완료 상태 초기화
        }else{
            // step이 0이면 이전 페이지로 이동
            navigate(-1);
        }
    }

    // 이름 처리 함수 (첫 글자 제외하고 "이" 붙이기)
    const getNameForGreeting = (fullName) => {
        if (!fullName || fullName.length <= 1) return fullName || "";
        // 첫 글자 제외하고 나머지 + "이"
        return fullName.substring(1) + "이";
    };

    // 이름 처리 함수 (첫 글자 제외)
    const getNameForCalling = (fullName) => {
        if (!fullName || fullName.length <= 1) return fullName || "";
        // 첫 글자 제외
        return fullName.substring(1);
    };

    // isFirstChapter는 useEffect에서 설정됨
    
    const userName = user?.name || "";
    const nameForGreeting = getNameForGreeting(userName);
    const nameForCalling = getNameForCalling(userName);

    const textToRead = useMemo(() => {
        if (loading) {
        return [];
        }
        if (step === 0) {
            return [isFirstChapter
                ? `안녕! 나는 ${nameForGreeting}를 위한 금융 선생님 호핀이야. 만나서 반가워!`
                : `안녕 ${nameForCalling}아! 오늘도 만나서 반가워!`];
        } else {
            return [`이번 단원을 소개할게.\n오늘은 ${titleText} 이야`];
        }
    }, [loading, step, titleText, nameForCalling, nameForGreeting, isFirstChapter]);
    
    // step이 변경될 때 TTS 재생 플래그 초기화
    useEffect(() => {
        hasPlayedTtsRef.current = false;
        setIsTtsCompleted(false);
        setIsTtsPlaying(false);
        setCurrentCharacterImage(hoppin); // hoppin으로 초기화
        textToReadRef.current = "";
        // 애니메이션 정지
        if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
        }
        // 동영상으로 대체하는 부분 (주석처리)
        // if (videoRef.current) {
        //     videoRef.current.pause();
        //     videoRef.current.currentTime = 0;
        // }
    }, [step]);

    // 기존 코드: 이미지가 왔다갔다 하는 코드 (나중에 참고용으로 주석 처리)
    // useEffect(() => {
    //     if (isTtsPlaying) {
    //         // hoppin과 hoppin_laugh를 번갈아가며 표시
    //         let isHoppin = true;
    //         animationIntervalRef.current = setInterval(() => {
    //             setCurrentCharacterImage(isHoppin ? hoppin_laugh : hoppin);
    //             isHoppin = !isHoppin;
    //         }, 300); // 300ms마다 변경 (game2처럼 움직이는 효과)
    //     } else {
    //         // TTS가 끝나면 hoppin으로 고정
    //         setCurrentCharacterImage(hoppin);
    //         if (animationIntervalRef.current) {
    //             clearInterval(animationIntervalRef.current);
    //             animationIntervalRef.current = null;
    //         }
    //     }

    //     // cleanup
    //     return () => {
    //         if (animationIntervalRef.current) {
    //             clearInterval(animationIntervalRef.current);
    //             animationIntervalRef.current = null;
    //         }
    //     };
    // }, [isTtsPlaying]);

    // 새로운 코드: TTS 재생 중에는 gif, 재생 안 할 때는 정적 이미지
    useEffect(() => {
        if (isTtsPlaying) {
            // TTS 재생 중: gif 표시
            setCurrentCharacterImage(hoppin_moving);
        } else {
            // TTS 재생 안 할 때: 정적 이미지(hoppin) 표시
            setCurrentCharacterImage(hoppin);
        }
    }, [isTtsPlaying]);

      
    
    return(
    <>
        {/* 토스트 메시지 */}
          {showToast && (
              <Toast>
                  학습 도중 화면에 나타난 무당벌레를 클릭해 없애주세요!<br/>
                  무당벌레는 학습 3단계에서 나타날 수 있습니다!
              </Toast>
          )}
        
        <Wrapper>
            <ContentWrapper>
                <MainWrapper>
                    {/* <MiniHeader
                            left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                            right={
                            isFinished?(
                                <Button onClick={() => navigate(`/study/2?chapterId=${chapterData?.chapterId}`)}>다음 단계로</Button>
                            ):<Button disabled>진행 중...</Button>
                            }
                        >
                        1/6 선생님과 학습하기
                        </MiniHeader> */}
                    <ImageWrapper>
                        {/* 동영상으로 대체하는 부분 (주석처리) */}
                        {/* {isTtsPlaying ? (
                            <Video
                                ref={videoRef}
                                src={step === 0 ? hoppinVideo : hoppinTalkVideo}
                                autoPlay={false}
                                loop={false}
                                playsInline
                                muted={false}
                                onEnded={() => {
                                    // 영상이 끝나면 정지하고 이미지로 전환
                                    setIsTtsPlaying(false);
                                    if (videoRef.current) {
                                        videoRef.current.pause();
                                        videoRef.current.currentTime = 0;
                                    }
                                }}
                            />
                        ) : (
                            <Image src={hoppin} alt="샘플" />
                        )} */}
                        {/* TTS 재생 중에는 gif, 재생 안 할 때는 정적 이미지 표시 */}
                        {/* 기존 코드: hoppin과 hoppin_laugh를 번갈아가며 표시하는 방식 (주석 처리) */}
                        <Image 
                            src={currentCharacterImage} 
                            alt="호핀"
                        />
                    </ImageWrapper>
                    <TtsPlayer
                        key={`tts-${step}-${textToRead.join('')}`}
                        sentences={textToRead}
                        answers={[]}
                        isAnsweringPhase={false}
                        currentIndex={0}
                        autoPlay={(() => {
                            // 텍스트가 변경되었거나 아직 재생하지 않은 경우에만 자동 재생
                            const currentText = textToRead.join('');
                            if (textToReadRef.current !== currentText && preloadDone && !hasPlayedTtsRef.current) {
                                textToReadRef.current = currentText;
                                return true;
                            }
                            return false;
                        })()}
                        style={{ display: "none" }}
                        onPreloadDone={() => {
                            setPreloadDone(true);
                        }}
                        onTtsStart={() => {
                            hasPlayedTtsRef.current = true;
                            setIsTtsPlaying(true);
                            // 동영상으로 대체하는 부분 (주석처리)
                            // // 영상 재생 시작 (약간의 지연을 두어 상태 업데이트 후 재생)
                            // setTimeout(() => {
                            //     if (videoRef.current) {
                            //         videoRef.current.currentTime = 0;
                            //         videoRef.current.play().catch((e) => {
                            //             console.error("영상 재생 오류:", e);
                            //             setIsTtsPlaying(false);
                            //         });
                            //     }
                            // }, 50);
                        }}
                        onTtsEnd={() => {
                            setIsTtsCompleted(true);
                            setIsTtsPlaying(false);
                            setCurrentCharacterImage(hoppin); // TTS 종료 시 hoppin으로 고정
                            // 애니메이션 정지
                            if (animationIntervalRef.current) {
                                clearInterval(animationIntervalRef.current);
                                animationIntervalRef.current = null;
                            }
                            // 동영상으로 대체하는 부분 (주석처리)
                            // // 영상 즉시 정지
                            // if (videoRef.current) {
                            //     videoRef.current.pause();
                            //     videoRef.current.currentTime = 0;
                            // }
                        }}
                    />
                    { !preloadDone ? (
                        <SpeechBubble>
                            <TextBox>화면을 준비 중입니다...</TextBox>
                        </SpeechBubble>
                    ) : (
                        <SpeechBubble>
                            <TextBox>
                                {loading
                                    ? "단원을 준비 중이에요..."
                                    : step===0
                                        ? (isFirstChapter
                                            ? `안녕! 나는 ${nameForGreeting}를 위한 금융 선생님 호핀이야. 만나서 반가워!`
                                            : `안녕 ${nameForCalling}아! 오늘도 만나서 반가워!`)
                                        : `이번 단원을 소개할게.\n오늘은 ${titleText}이야`}
                            </TextBox>
                              {/* TTS 재생 완료 시에만 버튼 표시 */}
                              {isTtsCompleted && (
                              <ButtonWrapper>
                                 {step > 0 && (
                                    <BackButton onClick={handleBack}>
                                        뒤로
                                    </BackButton>
                                 )}
                                 <BubbleButton onClick={handleNext}>
                                          {step===0?"다음":"시작하기"}
                                 </BubbleButton>
                              </ButtonWrapper>
                              )}

                        </SpeechBubble>
                    )}
                </MainWrapper>
            </ContentWrapper>
        </Wrapper>
    </>
    );
}

export default StudyPage;