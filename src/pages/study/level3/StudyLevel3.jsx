import styled from "styled-components";
import React, { useState, useEffect, useMemo } from "react";

import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import Button from "../../../components/Button";
import { useNavigate,useLocation } from "react-router-dom";
import { fetchFeedback } from "../../../api/study/level3API";
import MiniHeader from "../../../components/study/MiniHeader";
import Sidebar from "../../../components/Sidebar";
import { useChapter } from "../../../context/ChapterContext";
import background from "../../../assets/study_background.png";
import hopin from "../../../assets/hopin.svg";
import questionIcon from "../../../assets/question_icon.svg";
import TtsPlayer from "../../../components/TtsPlayer";
import api from "../../../api/login/axiosInstance";


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
    // gap:12px;
`;

const ImageWithSpeechWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: 100%;
  margin:1rem 0rem;
`;

const SpeechWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: stretch;
  flex-direction: row;
  gap: 20px;
`;

const Image=styled.img`
    width:50%; 
    height:auto;
    object-fit:contain;
    // width: clamp(100px,40vw,250px); //최소 150px, 최대 250px, 화면 너비 40%까지 가능
    align-self:center;
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


function StudyPage({ user, login, setLogin }){

    const navigate=useNavigate();
    const location=useLocation();
    const [sentences,setSentences]=useState([]);
    const [currentIndex,setCurrentIndex]=useState(0);

    
    const {chapterData}=useChapter();
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
    const ttsSentences = useMemo(() => sentences, [sentences]);
    const nextContext=sentences[currentIndex+1]||"다음 학습 내용 없음";
    const returnToIndex=location.state?.returnToIndex??0;

   const navigateToQuestion=()=>{
        console.log("🐛question에게 보내는 returnToIndex:",currentIndex)
        navigate("/question",{
            state:{
                returnToIndex:currentIndex,
                from: "/study/level3"
            }
        });
   }

   useEffect(() => {

        //chapterData를 사용하려면 직접 url 열면 안됨.. navigate로 url이동해야 (Context는 메모리에만 존재하기 때문에 초기화됨)
        console.log("📦 현재 저장된 chapterData:", chapterData);
        if (chapterData?.content) {
            const contents = chapterData.content;
            console.log("✅ Chapter content:", contents);
            
            //문장 분리
            const baseSentences = contents
            .split(/(?<=[.?!])\s+/)
            .filter((s) => s.trim() !== ""); //공백만 있는 문장 등을 제거
            
            //질문 감지 함수
            const isQuestion = (s) => s.includes("?");

            //긴 문장 분할 함수(질문 제외)
            const breakLongSentence = (sentence, max = 50) => {
                if (isQuestion(sentence)) return [sentence]; // ✅ 질문이면 그대로
                if (sentence.length <= max) return [sentence];

                const mid = Math.floor(sentence.length / 2);
                let splitIndex = sentence.lastIndexOf(" ", mid);
                if (splitIndex === -1) splitIndex = mid;
                const first = sentence.slice(0, splitIndex).trim();
                const second = sentence.slice(splitIndex).trim();
                return [first, second];
            };

            //문장분해
            const splitSentences=baseSentences
                .map((s)=>breakLongSentence(s))
                .flat();
            console.log("🐋분할된 최종 문장 배열:",splitSentences);

            //질문이 포함된 문장의 인덱스만 추출
            const questionIndexes=splitSentences
                .map((s,i)=>isQuestion(s)?i:null)
                .filter((i)=>i!=null);
            console.log("🧠 질문 문장 인덱스:", questionIndexes);

            setSentences(splitSentences);
            setQuestionIndexes(questionIndexes);
            

        } else {
            setSentences(["❌ 내용이 없습니다. 다시 돌아가주세요."]);
        }
    }, [chapterData]);


    //질문 버튼 누른 후 다시 학습하기 3단계로 돌아온 경우 포함
    useEffect(()=>{
        console.log("🐛returnToIndex",returnToIndex);
        setCurrentIndex(returnToIndex);
    },[]); //의존성 배열이 비어 있어야 컴포넌트 최초 마운트 시 한 번만 실행



    //질문 문장인 경우 -> 사용자 입력 UI 노출 + 답변 수집
    //질문이 끝나면 답변 버튼이 생성되도록 함 
    const goToNextSentence=()=>{
    if (!preloadDone) return;
    
    // 기존 코드: 모든 문장을 다 본 후에 완료
    // if (currentIndex<sentences.length-1){
    //     console.log("✅currentIndex:",currentIndex);
    //     setCurrentIndex(currentIndex+1);
    // }else{
    //     setIsQuestionFinished(true);
    //     setIsFinished(true);
    //     alert("✅학습을 모두 완료했어요! 다음 단계로 이동해볼까요? 오른 쪽의 다음 단계로 버튼을 클릭해주세요 ")
    // }

    // 수정된 코드: 2-3개 문장만 보고 완료
    if (currentIndex < 2) { // 0, 1 인덱스까지만
        console.log("✅currentIndex:",currentIndex);
        setCurrentIndex(currentIndex+1);
    } else {
        setIsQuestionFinished(true); //질문 끝났다는 상태
        setIsFinished(true);
        alert("✅학습을 모두 완료했어요! 게임 단계로 이동해볼까요?")
        navigate("/game")
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

        // 다른 API 요청과 동일한 패턴으로 시도

        const feedback=await handleFeedback();
        console.log("✅AI피드백:",feedback.result)
        // 임시 응답 시뮬레이션 //AI 모델 추후에 연결.. 
        setAiResponse(feedback.result);
        setIsAnswering(false);
        setIsVoiceRecognitionComplete(false);
        setRecognizedText("");
        setUserAnswer("");
    };

    const handleFeedback=async()=>{
                try{
                    console.log("🔍 피드백 요청 시작 - 현재 인덱스:", currentIndex);
                    console.log("🔍 질문:", sentences[currentIndex]);
                    console.log("🔍 사용자 답변:", userAnswer);
                    console.log("🔍 브라우저 쿠키:", document.cookie); // 쿠키 확인
                    
                    const requestBody = {
                        chapter: chapterData.content,
                        sentenceIndex: currentIndex,  // 다시 추가
                        question: sentences[currentIndex],
                        userAnswer: userAnswer,
                        nextContext: nextContext,
                    };
                    
                    console.log("🔍 요청 본문:", requestBody);
                    
                    const res=await api.post('/api/study/feedback', requestBody);

                    console.log("📡 응답 상태:", res.status, res.statusText);
                    console.log("✅저장된 피드백:",res.data);
                    return res.data;
                }catch(e){
                    console.error("❌피드백 요청 실패:", e);
                    console.error("🔍 에러 응답:", e.response);
                    console.error("🔍 에러 상태:", e.response?.status);
                    console.error("🔍 에러 데이터:", e.response?.data);
                    
                    // if (e.response?.status === 401) {
                    //     console.error("🚨 401 Unauthorized - 로그인 필요");
                    //     return{result:"😟오류 발생: 로그인이 필요합니다. 다시 로그인해주세요."};
                    // }
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
    <>
        <Wrapper> 
            <ContentWrapper>
                <Sidebar user={user} login={login} setLogin={setLogin} defaultCollapsed={true} />
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
              <ImageWrapper>
                    <Image src={hopin} alt="샘플" />
              </ImageWrapper>
              <QuestionButton onClick={()=>navigate('/question', {
                    state: { 
                        returnToIndex: currentIndex,
                        from: "/study/level3" 
                    }
                })}>
                    <QuestionIconImg src={questionIcon} alt="질문 아이콘" />
                    질문하기
                </QuestionButton>

              <TtsPlayer
                sentences={ttsSentences}     // useMemo로 감싼 배열
                answers={[]}                 // 답변 단계는 없으니 빈 배열
                isAnsweringPhase={false}     // 항상 질문 단계
                currentIndex={currentIndex}  // 현재 읽을 인덱스
                autoPlay={true}
                style={{ display: "none" }}
                onPreloadDone={() => setPreloadDone(true)}  // 캐싱 끝나면 true
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
                            {/* ✅ 응답이 있으면 응답만 표시 */}
                            {aiResponse ? (
                            <div>
                                 {aiResponse}
                            </div>
                            ) : (
                            <div>
                                {sentences.length > 0 ? sentences[currentIndex] : "❌"}
                            </div>
                            )}
                        </TextBox>

                        

                            {/*일반 문장 or 질문+답변 완료 시에만 next 버튼 표시*/}
                            {(!questionIndexes.includes(currentIndex)||aiResponse)&&(
                                <ButtonWrapper>
                                    {currentIndex > 0 && (
                                        <BackButton onClick={()=>{
                                            setCurrentIndex(currentIndex-1);
                                            setAiResponse(""); //이전 문장으로 갈 때 aiResponse초기화
                                        }}>
                                            이전
                                        </BackButton>
                                    )}
                                    <BubbleButton onClick={()=>{
                                        setAiResponse(""); //다음 문장 넘어갈 때 aiResponse초기화
                                        goToNextSentence();
                                    }}>
                                        다음
                                    </BubbleButton>
                                </ButtonWrapper>
                            )}
                    

                    {/* ✅ 질문이고 아직 대답 전일 경우만 버튼 표시 */}
                    {questionIndexes.includes(currentIndex) && !aiResponse && (
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
                        {aiResponse && <AiResponseBox>{aiResponse}</AiResponseBox>}
                    </AnswerInputBox>
                )}
               </ImageWithSpeechWrapper>
                    
                </MainWrapper>
            </ContentWrapper>
        </Wrapper>
    </>
    );
}

export default StudyPage;