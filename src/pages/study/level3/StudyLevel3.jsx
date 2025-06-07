import styled from "styled-components";
import React,{useState,useEffect} from "react";

import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import Button from "../../../components/Button";
import { useNavigate,useLocation } from "react-router-dom";
import { fetchFeedback } from "../../../api/study/level3API";
import nextButton from "../../../assets/nextButton.png";
import MiniHeader from "../../../components/study/MiniHeader";
import { useChapter } from "../../../context/ChapterContext";

/*학습하기-3단계-1*/


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
    align-items:center;
    justify-content:center;
    margin-top:129px;
    gap:12px;
`;

const Image=styled.img`
    width:100%; 
    height:auto;
    object-fit:contain;
    max-width:300px;
    display:block;
    align-self:center;
    margin-top:100px;
    margin-bottom:0px;
`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height:250px; /* ✅ 고정 높이로 조정 */
    background-color:#FEF3E1;
    position:relative;
    align-items: center;
    justify-content: center;
`;


const TextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 180px; /* ✅ 고정 높이 */
  margin: 0 auto;
  padding: 40px;
  font-size: clamp(20px, 3vw, 32px);
  line-height: 1.6;
  letter-spacing: 0.03em;
  font-weight: 500;
  font-family: "Noto Sans KR", sans-serif;
  color: #333;
  white-space: normal;      /* ✅ 줄바꿈 허용 */
  word-break: keep-all;     /* ✅ 단어 잘림 방지 */
`;


const BubbleButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;
  padding: 20px 32px;
  background-color: #2774B2;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  border: 0.2px solid black;
  transition: background-color 0.3s;
  font-size:20px;
  &:hover {
    background-color: #1b5c91;
  }
`;

const QuestionButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;
  padding: 16px 16px;
  background-color: #2774B2;
  color: white;
  border-radius: 15px;
  cursor: pointer;
  border: 0.2px solid black;

  font-size:18px;

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }
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

const AnswerInputBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  gap: 12px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  width: 60%;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 16px;
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

function StudyPage(){

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
    const nextContext=sentences[currentIndex+1]||"다음 학습 내용 없음";
    const returnToIndex=location.state?.returnToIndex??0;

 
    //질문하기로 이동
   const navigateToQuestion=()=>{
        console.log("🐛question에게 보내는 returnToIndex:",currentIndex)
        navigate("/question",{state:{returnToIndex:currentIndex}});
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
    if (currentIndex<sentences.length-1){
        console.log("✅currentIndex:",currentIndex);
        setCurrentIndex(currentIndex+1);
        
    }else{
        setIsQuestionFinished(true); //질문 끝났다는 상태
        setIsFinished(true);
        alert("✅학습을 모두 완료했어요! 다음 단계로 이동해볼까요? ")
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

        const feedback=await handleFeedback();
        console.log("✅AI피드백:",feedback.result)
        // 임시 응답 시뮬레이션 //AI 모델 추후에 연결.. 
        setAiResponse(feedback.result);
        setIsAnswering(false);
    };

    const handleFeedback=async()=>{
                try{
                    const res=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/feedback`,{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json",
                        },
                        credentials:"include",
                        body:JSON.stringify({
                            chapter:chapterData.content,
                            sentenceIndex:currentIndex,
                            question:sentences[currentIndex],
                            userAnswer,
                            nextContext,
                        }),
                    });

                    if(!res.ok){
                        throw new Error("❌피드백 불러오는 데 실패");
                    }

                    const data=await res.json();
                    console.log("✅저장된 피드백:",data);
                    return data;
                }catch(e){
                    console.log("❌피드백 요청 실패:",e);
                    return{reaction:"😟오류 발생"};
                }
            };
        
    const handleNavigate=async()=>{
        navigate('/game');
    }

   //다음 문장으로 넘어가도록 함함
   const handleNext=async()=>{
    if (currentIndex<sentences.length-1){
        setCurrentIndex(currentIndex+1);
    }else{
        alert("✅다음 단계로 넘어가볼까요?")

        //여태까지 질문한 내용들을 DB에 저장하는 API
        try{
            const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/question/saveAll?chapterId=${chapterData?.chapterId}`,{
                method:'POST',
                credentials:'include',
            });

            if(!response.ok){
                const err=await response.text();
                throw new Error(err);
            }

            console.log("🐯 질문/답변 저장 성공");
        }catch(e){
            console.log("❌ 저장 중 오류 발생",e);
        }

        //피드백 저장
        await saveFeedbacks(chapterData?.chapterId);
        navigate("/study/level3/2") //추후 `/game`으로 변경
    }
   };

   async function saveFeedbacks(chapterId){
    const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/feedback/saveAll?chapterId=${chapterId}`,{
        method:"POST",
        credentials:"include"
    });
    if (!response.ok){
        throw new Error("❌피드백들을 전부 저장하는 데 실패했어요.");
    }

    console.log(("✅",response));
   }


    return(
    <>
        <Wrapper>
            <Box>
                <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={
                    isFinished?(
                        <Button
                        onClick={handleNext}
                        >다음 단계로</Button>
                    ):(
                        <Button
                        onClick={handleNavigate}
                        >다음 단계로</Button>
                        // <Button disabled>진행 중..</Button> //배포 시 disabled 로 변경 ⭐⭐
                    )
                    }
                >
                3/6 선생님과 학습하기
                </MiniHeader>
            <ImageWrapper>
                <Image src={tiger} alt="샘플" />
                <QuestionButton onClick={navigateToQuestion}
                >질문</QuestionButton>
            </ImageWrapper>
                {!isAnswering?(
                    <>
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
                                <ImageButton
                                 src={nextButton} 
                                 alt="버튼" 
                                 onClick={()=>{
                                     setAiResponse(""); //다음 문장 넘어갈 때 aiResponse초기화
                                    goToNextSentence();
                                 }}
                                />

                            )}
                    

                    {/* ✅ 질문이고 아직 대답 전일 경우만 버튼 표시 */}
                    {questionIndexes.includes(currentIndex) && !aiResponse && (
                        <BubbleButton onClick={() => setIsAnswering(true)}>
                        🎙️ 대답하기
                        </BubbleButton>
                    )}
                    </SpeechBubble>
                    </>
                ):(
                    //isAnswering===true일 때 사용자 입력 UI 표시
                    <AnswerInputBox>
                        <Input
                            type="text"
                            value={userAnswer}
                            onChange={(e)=>setUserAnswer(e.target.value)}
                            placeholder="🎙️너의 생각을 입력해봐"
                        />
                        <SubmitButton onClick={handleUserSubmit}>제출</SubmitButton>
                        {aiResponse && <AiResponseBox>{aiResponse}</AiResponseBox>}
                    </AnswerInputBox>
                )}
                    
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;