import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import testImage from "../../../assets/testImage.png";
import MiniHeader from "../../../components/study/MiniHeader";
import Button from "../../../components/Button";
import nextButton from "../../../assets/nextButton.png";
import { useChapter } from "../../../context/ChapterContext";
import { useActivityTracker } from "../../../hooks/useActivityTracker";

import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import TtsPlayer from "../../../components/TtsPlayer";
import background from "../../../assets/study_background.png";
import hoppin from "../../../assets/hopin.svg";
import questionIcon from "../../../assets/question_icon.svg";

/*학습하기2단계 - 학습목표+이미지 제시하며 질문..*/


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
  width: 100%;
  min-height: 100vh;
  
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
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 2rem;
  gap: 0;
`;

const HoppinImage = styled.img`
  width: clamp(200px, 25vw, 350px);
  height: auto;
  object-fit: contain;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
`;

const ObjectiveImage = styled.img`
  width: clamp(250px, 35vw, 400px);
  max-height: 380px;
  height: auto;
  object-fit: contain;
  margin-bottom: 1rem;
`;

const ImageWithSpeechWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 1rem 0rem;
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



const SpeechWrapper=styled.div`
    position:relative;
    width:100%;
    // height:20%;
    display:flex;
    align-items:stretch;
    flex-direction: row;
    align-items: center;
    justify-content: center;

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
  background-color: #2774B2;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1b5c91;
  }
`;

const AiResponseBox = styled.div`
  margin-top: 24px;
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

const ImageButton=styled.img`
position: absolute;
  right: 20px;
  bottom: 20px;
  width:60px;
  height:auto;
  cursor:pointer;

  padding: 10px 16px;
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

`;

const AnswerButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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



const NextStepButton = styled(Button)`
  
  b: ${({ $active }) => ($active ? "#f5c77a" : "#2774B2")};
  cursor: ${({ $active }) => ($active ? "pointer" : "not-allowed")};
  
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: all 0.3s;


  // 🔄 깜빡임 효과 (AI 응답 완료 후)
  ${({ $active }) =>
    $active &&
    `
    animation: blink 1s ease-in-out infinite;
  `}

  @keyframes blink {
    0%, 100% {
      box-shadow: 0 0 0px rgba(39, 116, 178, 0.8);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 10px rgba(39, 116, 178, 0.8);
      transform: scale(1.03);
    }
  }
`;


//물어보고 대답하면 그에 따른 반응을 해줘야함.. 그러려면 AI와 연결할필요있음.. 
function StudyLv2_withImg({ user, login, setLogin }){

    const navigate=useNavigate();
    const [searchParams] = useSearchParams();
    const {chapterData, setChapterData}=useChapter();
    const [sentences,setSentences]=useState([]);
    const [answers,setAnswers]=useState([]);
    const [currentIndex,setCurrentIndex]=useState(0);
    const [image,setImage]=useState();

    const [isQuestionFinished,setIsQuestionFinished]=useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [aiResponse, setAiResponse] = useState("");
 
    const [isAnswering,setIsAnswering]=useState(false);
    const [isAnsweringPhase,setIsAnsweringPhase]=useState(false); //현재가 질문을 보여주는 단계인지, AI의 답변을 보여주는 단계인지 //False=질문, ai=true

    // 다음 문장(문맥)
    const nextContext = sentences[currentIndex + 1] || "다음 학습 내용 없음";
    
    const [preloadDone, setPreloadDone] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recognizedText, setRecognizedText] = useState("");
    const [isVoiceRecognitionComplete, setIsVoiceRecognitionComplete] = useState(false);
    const [loading, setLoading] = useState(false);

    // 활동 감지 Hook 사용 (level 2, start-level 스킵)
    // FIXME: 백엔드 start-level API 401 에러로 임시 스킵
    const { completeSession } = useActivityTracker(
        chapterData?.chapterId, 
        2, // level 2
        user?.userId,
        chapterData?.bookId,
        0, // minusFocusingScore
        true // skipStartLevel: 백엔드 이슈로 임시 스킵
    );

    // Level 2 데이터는 context에서 가져오기 (StudyPage2에서 이미 로드됨)
    useEffect(() => {
        if (chapterData) {
            console.log("✅ Level 2 데이터 사용 (context):", chapterData);
            
            const question = chapterData?.objectiveQuestion;
            const img = chapterData?.imgUrl;
            console.log("📷 imgUrl:", img);
            console.log("✅ objectiveQuestion:", question);
            
            // imgUrl이 있으면 설정, 없으면 undefined (onError로 fallback 처리)
            setImage(img || undefined);

            if (question) {
                const splitSentences = question
                    .split(/(?<=[.?!])\s+/)
                    .filter((s) => s.trim() !== "");
                setSentences(splitSentences);
            } else {
                setSentences(["질문이 없습니다."]);
            }
            
            setCurrentIndex(0);
            setPreloadDone(false);
            setLoading(false);
        } else {
            console.error("❌ chapterData가 없습니다!");
            setSentences(["❌ 데이터를 불러올 수 없습니다."]);
            setLoading(false);
        }
    }, [chapterData]);




   const handleAnswer = async () => {
    if(!aiResponse){
      if(currentIndex<sentences.length-1){
        setCurrentIndex(currentIndex+1);
      }else{
        setIsQuestionFinished(true);
      }
    }else{
      if(currentIndex<answers.length-1){
        setCurrentIndex(currentIndex+1);
      }else{
        // 답변을 맞추는 화면이 아니면 다음 단계로 이동
        await completeSession(); // Level 2 완료 상태 전송
        navigate(`/study/level3?chapterId=${chapterData?.chapterId}`);
      }
    }
   };

   


   //AI로부터 답변 받기.. 
   const handleUserSubmit = async () => {
        // 실제로는 여기에 AI 호출 로직이 들어감 (예: fetch("/chat", { method: POST ... }))
        console.log("🙋 유저 입력:", userAnswer);

        // objectiveAnswer가 있으면 사용, 없으면 기본 응답 사용
        const response = chapterData?.objectiveAnswer || "좋은 답변이에요";
        const fullResponse = `${response}. 그럼 이제 본격적으로 수업을 들어가볼까?`;
        // setNextResponse(`그럼 이제 본격적으로 수업을 들어가볼까?`);
        setAiResponse(fullResponse);

        const splitAnswers = fullResponse
            .split(/(?<=[.?!])\s+/)
            .filter((s) => s.trim() !== "");

        setAnswers(splitAnswers);
        setIsAnsweringPhase(true);
        setCurrentIndex(0);
        setIsAnswering(false);
        setPreloadDone(false);
        setIsVoiceRecognitionComplete(false);
        setRecognizedText("");
        setUserAnswer("");
    };

    // 음성인식 시작/종료 함수
    const handleVoiceRecognition = () => {
        if (!isRecording) {
            startVoiceRecognition();
        } else {
            stopVoiceRecognition();
        }
    };

    // 음성인식 시작
    const startVoiceRecognition = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
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
                console.log('음성인식 종료');
            };
            
            recognition.onerror = (event) => {
                console.error('음성인식 오류:', event.error);
                setIsRecording(false);
                alert('음성인식에 실패했습니다. 다시 시도해주세요.');
            };
            
            recognition.start();
        } else {
            alert('이 브라우저는 음성인식을 지원하지 않습니다.');
        }
    };

    // 음성인식 종료
    const stopVoiceRecognition = () => {
        setIsRecording(false);
        setIsVoiceRecognitionComplete(true);
    };
    
    return(
        <Wrapper>
                <MainWrapper>
                        {/* <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={<NextStepButton
                        disabled={!aiResponse} //aiResponse 없으면 비활성화
                        $active={!!aiResponse} //깜빡이는 스타일을 위한 props 전달
                        onClick={()=>{
                            if(aiResponse){
                                navigate(`/study/level3?chapterId=${chapterData?.chapterId}`);
                            }
                        }}
                        >다음 단계로</NextStepButton>
                    }
                >
                2/6 : 학습 자료
                        </MiniHeader> */}
            <ImageWithSpeechWrapper>
              <ContentContainer>
                <LeftSection>
                  <HoppinImage src={hoppin} alt="호핀" />
                </LeftSection>

                <RightSection>
                  <ObjectiveImage 
                      src={image} 
                      alt="학습 이미지" 
                      onError={(e)=>e.target.src=testImage}
                  />
                </RightSection>
              </ContentContainer>

              <TtsPlayer
                sentences={sentences}
                answers={answers}
                isAnsweringPhase={isAnsweringPhase}
                currentIndex={currentIndex}
                autoPlay={true}
                style={{ display: "none" }}
                onPreloadDone={() => setPreloadDone(true)}
              />
              { !preloadDone ? (
                <TextBox>화면을 준비 중입니다...</TextBox>
                ) : (
              <SpeechWrapper>
                {!isAnswering?(//isAnswering이 false일 때 
                    <>
                    <SpeechBubble>
                        <TextBox>
                          {isAnsweringPhase?(
                            answers.length>0?answers[currentIndex]:"답변이 없습니다."
                          ):(
                            sentences.length>0?sentences[currentIndex]:"질문이 없습니다."
                          )}
                        </TextBox>
                        {!aiResponse ? (
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
                        ) : (
                            <AnswerButton onClick={handleAnswer} style={{marginTop: '1rem'}}>
                                다음 단계로
                            </AnswerButton>
                        )}
                    </SpeechBubble>
                            </> 
                        ) : ( //isAnswering이 True일때
                            <>
                            {aiResponse && <AiResponseBox>{aiResponse}</AiResponseBox>}
                            </>
                        )}
                  </SpeechWrapper>
                )}
               </ImageWithSpeechWrapper>
                </MainWrapper>
        </Wrapper>
    );
}

export default StudyLv2_withImg;