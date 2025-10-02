import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import testImage from "../../../assets/testImage.png";
import MiniHeader from "../../../components/study/MiniHeader";
import Button from "../../../components/Button";
import nextButton from "../../../assets/nextButton.png";
import Sidebar from "../../../components/Sidebar";
import { useChapter } from "../../../context/ChapterContext";

import { useNavigate } from "react-router-dom";
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

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
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
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ImageWrapper=styled.div`
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    gap: 2rem;
`



const Image=styled.img`
    display:flex;
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    width: 30%;
    display:block;
    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    align-self:center;/*가로 중앙 정렬*/
    // margin-bottom:0px;
`;

const ObjectiveImage = styled.img`
  display:flex;
  height:auto;
  object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
  width: 30%;
  display:block;
  margin-bottom: 1rem;
`;

const ImageWithSpeechWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  width: 100%;
  margin:1rem 0rem;
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



const SpeechWrapper=styled.div`
    position:relative;
    width:100%;
    // height:20%;
    display:flex;
    align-items:stretch;
    flex-direction: row;
    gap:20px; /*형제 요소 사이의 간격*/

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
  margin: 1rem 0; /* 이미지와 스피치 버블 사이 간격 */
  align-self: flex-end; /* 오른쪽 정렬 */
  gap: 0.5rem;
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
    const {chapterData}=useChapter();
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

    useEffect(()=>{
        console.log("📦 현재 저장된 chapterData:", chapterData);
        if(chapterData){
            // const question=chapterData.question; //질문 필드 추가해야함
            const question=chapterData?.objectiveQuestion;
            const img=chapterData.imgUrl; //이미지 불러올 수 있는지 확인해보기
            console.log("📷chapterData.imgUrl",img);
            console.log("✅chapterData.objectiveQuestion")
            setImage(img);

           const splitSentences = question
            .split(/(?<=[.?!])\s+/)
            .filter((s) => s.trim() !== "");

            setSentences(splitSentences);
            setCurrentIndex(0);
            setPreloadDone(false);
            
        }else{
            setSentences(["❌ 내용이 없습니다. 다시 돌아가주세요."])
        }
    },[chapterData]);




   const handleAnswer=()=>{
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
        navigate('/study/level3');
      }
    }
   };

   


   //AI로부터 답변 받기.. 
   const handleUserSubmit = async () => {
        // 실제로는 여기에 AI 호출 로직이 들어감 (예: fetch("/chat", { method: POST ... }))
        console.log("🙋 유저 입력:", userAnswer);

        // 임시 응답 시뮬레이션 //AI 모델 추후에 연결.. 
        const response=chapterData?.objectiveAnswer;
        const fullResponse=`${response}. 그럼 이제 본격적으로 수업을 들어가볼까?`;
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
            <ContentWrapper>
                <Sidebar user={user} login={login} setLogin={setLogin} defaultCollapsed={true} />
                <MainWrapper>
                        {/* <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={<NextStepButton
                        disabled={!aiResponse} //aiResponse 없으면 비활성화
                        $active={!!aiResponse} //깜빡이는 스타일을 위한 props 전달
                        onClick={()=>{
                            if(aiResponse){
                                navigate('/study/level3');
                            }
                        }}
                        >다음 단계로</NextStepButton>
                    }
                >
                2/6 : 학습 자료
                        </MiniHeader> */}
            <ImageWithSpeechWrapper>
              <ImageWrapper>
                    <Image src={hoppin} alt="샘플" />
                <ObjectiveImage 
                    src={image} 
                    alt="학습 이미지" 
                    onError={(e)=>e.target.src=testImage} //기본 이미지로 fallback
                />
              </ImageWrapper>
                <QuestionButton onClick={()=>navigate('/question')}>
                   <QuestionIconImg src={questionIcon} alt="질문 아이콘" />
                   질문하기
                </QuestionButton>

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
            </ContentWrapper>
        </Wrapper>
    );
}

export default StudyLv2_withImg;