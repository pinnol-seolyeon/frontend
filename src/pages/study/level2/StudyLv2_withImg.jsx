import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import testImage from "../../../assets/testImage.png";
import MiniHeader from "../../../components/study/MiniHeader";
import Button from "../../../components/Button";
import nextButton from "../../../assets/nextButton.png";
import { useChapter } from "../../../context/ChapterContext";

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import TtsPlayer from "../../../components/TtsPlayer";

/*학습하기2단계 - 학습목표+이미지 제시하며 질문..*/


const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    

`;

const ImageWrapper=styled.div`
    position:relative;
    display:flex;
    align-items:flex-start;
    gap:12px;
`



const Image=styled.img`
    // width:80%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:300px;
    display:block;

    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    // align-self:center;/*가로 중앙 정렬*/
    margin-top:10rem;
    margin-bottom:0px;

`;

const TestImage = styled.img`
  width: 50%;               // 💡 명확히 비율 고정하고 싶을 때
  height: auto;
  object-fit: contain;
  margin:20px;       // px로 명확한 spacing (또는 rem 사용 가능)

  @media (max-width: 768px) {
    width: 40%;             // 💡 모바일 대응
    margin-top: 16px;
    margin-right: 10px;
  }
`;

const ImageWithSpeechWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  width: 100%;
  margin-top: 3rem;
`;


const SpeechWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: flex-start; /* 세로 정렬을 시작점으로 */
  width: 100%;
`;

const SpeechBubble = styled.div`
  display: inline-block;          /* 내용을 감싸는 크기 */
  max-width: 80%;                 /* 화면 너비의 80%까지 */
  flex-shrink: 1;                 /* 부모 flex 안에서 줄어들기 허용 */
  overflow-wrap: break-word;      /* 단어 단위 줄바꿈 */
  word-wrap: break-word;
  white-space: pre-wrap;          /* 기존 줄바꿈 유지, 넘치면 줄바꿈 */

  padding: 12px 16px;
  background-color: #e9f1fb;
  border: 0.2px solid black;
  border-radius: 0px 50px 50px 0px;
  box-sizing: border-box;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 16px;
    border-width: 8px 8px 0 8px;
    border-style: solid;
    border-color: #2774B2 transparent transparent transparent;
  }
`;

const TextBox = styled.div`
  display: block;
  font-size: clamp(20px, 2vw, 30px);
  line-height: 1.6;
  word-break: break-word;
  margin: 0;
  padding: 0;
`;


const AnswerInputBox = styled.div`
  display: flex;
  flex-direction: row;
  width:50rem;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  gap: 12px;
`;



const Input = styled.input`
  width: 80%;
  max-width: 600px;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
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
  background-color: #2774B2;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  white-space: nowrap;

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
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
function StudyLv2_withImg(props){

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
    
    const [preloadDone, setPreloadDone] = useState(false)

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
        alert("✅다음 단계로 넘어가볼까요?");
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
      
    };
    
    return(
    <>
        <Wrapper>
            <Box>
                <MiniHeader
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
                </MiniHeader>
            <ImageWithSpeechWrapper>
              <ImageWrapper>
                <Image src={tiger} alt="샘플" />
                <TestImage 
                    src={image} 
                    alt="학습 이미지" 
                    onError={(e)=>e.target.src=testImage} //기본 이미지로 fallback
                />
                {/* <QuestionButton>질문</QuestionButton> */}
              </ImageWrapper>

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
                            {!aiResponse&&( //aiResponse가 아닐 때
                                <ImageButton
                                    src={nextButton}
                                    alt="버튼"
                                    onClick={handleAnswer}
                                />
                            )}


                            {aiResponse&&isAnsweringPhase&&(
                                 <ImageButton
                                    src={nextButton}
                                    alt="버튼"
                                    onClick={handleAnswer}
                                />
                            )}
                    </SpeechBubble>

                            {isQuestionFinished && !aiResponse&&(
                                <AnswerButtonWrapper>
                                    <AnswerButton onClick={() => setIsAnswering(true)}>대답하기 🎙️</AnswerButton>
                                </AnswerButtonWrapper>
                            )}

                            
                            </> 
                        ) : ( //isAnswering이 True일때
                            <>
                            <AnswerInputBox>
                                <Input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="너의 생각을 입력해봐 🐯"
                                />
                                <SubmitButton onClick={handleUserSubmit}>제출</SubmitButton>
                                {aiResponse && <AiResponseBox>{aiResponse}</AiResponseBox>}
                                {/* {nextResponse && <AiResponseBox>{nextResponse}</AiResponseBox>} */}
                            </AnswerInputBox>
                            </>
                        )}
                  </SpeechWrapper>
                )}
               </ImageWithSpeechWrapper>
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyLv2_withImg;